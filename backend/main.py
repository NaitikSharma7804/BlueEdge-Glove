"""
BlueEdge Glove — Core FastAPI Backend & Real-Time WebSocket Gateway
Orchestrates:
- ESP32 Hardware ingestion & Multi-patient simulation
- Edge Preprocessing & Signal Quality Index (SQI)
- 1D CNN + BiLSTM Edge Inference
- Hybrid Risk Engine & Clinical Insights
- Selective Cloud Synchronization & Offline Buffering
"""

import asyncio
import time
import json
from typing import List, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import Patient, PatientVitals, SensorQuality, AIInferenceResult, CloudSyncPayload, SystemStatus
from preprocessor import EdgePreprocessor
from inference import BlueEdgeEdgeModel
from risk_engine import HybridRiskEngine
from simulator import PhysiologicalSimulator
from sync_manager import SelectiveCloudSyncManager

app = FastAPI(
    title="BlueEdge Glove — Edge-AI Patient Monitoring Gateway",
    description="Offline-First Clinical Decision Support API with Selective Cloud Sync",
    version="1.4.0"
)

# CORS middleware for Next.js / Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Edge Subsystems
preprocessor = EdgePreprocessor()
edge_ai = BlueEdgeEdgeModel()
risk_engine = HybridRiskEngine()
sync_mgr = SelectiveCloudSyncManager()

system_mode = "SIMULATION" # LIVE_HARDWARE, SIMULATION, RESEARCH

# Pre-populate 12 clinical beds
PATIENT_SEEDS = [
    {"id": "P101", "name": "Heet Shah", "bed": "ICU-Bed 01", "age": 24, "gender": "M", "admission": "Post-Op Cardiac Recovery", "pathology": "Normal"},
    {"id": "P102", "name": "Jigyasa Lunawat", "bed": "Step-Down 04", "age": 23, "gender": "F", "admission": "Asthma Observation", "pathology": "Normal"},
    {"id": "P103", "name": "Prajjwal Gupta", "bed": "Telemetry 02", "age": 25, "gender": "M", "admission": "Suspected Sepsis / High Pyrexia", "pathology": "Sepsis/Fever"},
    {"id": "P104", "name": "Aditi Shanbhag", "bed": "ICU-Bed 03", "age": 24, "gender": "F", "admission": "Acute Respiratory Distress / Hypoxia", "pathology": "Hypoxia"},
    {"id": "P105", "name": "Harshi Mehta", "bed": "Step-Down 07", "age": 23, "gender": "F", "admission": "Ventricular Arrhythmia Evaluation", "pathology": "Arrhythmia"},
    {"id": "P106", "name": "Aarav Deshmukh", "bed": "Ward 12A", "age": 32, "gender": "M", "admission": "Trauma Observation / Mild Concussion", "pathology": "Normal"},
    {"id": "P107", "name": "Rohan Kulkarni", "bed": "ICU-Bed 05", "age": 67, "gender": "M", "admission": "Septic Shock / Vasopressor Support", "pathology": "Shock"},
    {"id": "P108", "name": "Ananya Iyer", "bed": "Ward 14B", "age": 29, "gender": "F", "admission": "Pneumonia Management", "pathology": "Normal"},
    {"id": "P109", "name": "Siddharth Nair", "bed": "Telemetry 06", "age": 45, "gender": "M", "admission": "Heart Failure Exacerbation", "pathology": "Normal"},
    {"id": "P110", "name": "Diya Sengupta", "bed": "Ward 08C", "age": 28, "gender": "F", "admission": "Post-Surgical Monitoring", "pathology": "Normal"},
    {"id": "P111", "name": "Priya Sharma", "bed": "ICU-Bed 08", "age": 52, "gender": "F", "admission": "Severe Bronchospasm", "pathology": "Normal"},
    {"id": "P112", "name": "Arjun Malhotra", "bed": "Step-Down 09", "age": 38, "gender": "M", "admission": "Syncope Evaluation", "pathology": "Normal"},
]

simulators: Dict[str, PhysiologicalSimulator] = {}
patients_store: Dict[str, Patient] = {}
patient_history: Dict[str, List[Dict[str, Any]]] = {}

# Initialize simulators and patient state
for p in PATIENT_SEEDS:
    pid = p["id"]
    sim = PhysiologicalSimulator(pid, base_state=p["pathology"])
    sim.set_pathology(p["pathology"])
    simulators[pid] = sim
    
    # Generate initial state
    vitals_data = sim.step_vitals()
    vitals = PatientVitals(**vitals_data)
    quality = SensorQuality()
    features = {"perfusion_index": 4.2, "ecg_amplitude": 1.2, "temperature_c": vitals.temperature, "respiratory_rate": vitals.respiratory_rate, "motion_index": 0.08, "gsr_microsiemens": vitals.gsr_microsiemens}
    ai_raw = edge_ai.infer(vitals_data, features, quality.overall_sqi)
    ai_final = risk_engine.evaluate(vitals_data, ai_raw, quality, [])
    
    status = "Stable"
    if ai_final.risk_level in ["CRITICAL", "HIGH"]:
        status = "Critical" if ai_final.risk_level == "CRITICAL" else "Warning"

    patient = Patient(
        id=pid,
        name=p["name"],
        bed=p["bed"],
        age=p["age"],
        gender=p["gender"],
        admission_reason=p["admission"],
        status=status,
        vitals=vitals,
        quality=quality,
        ai_analysis=ai_final,
        last_update=time.time()
    )
    patients_store[pid] = patient
    patient_history[pid] = [
        {"timestamp": "08:00", "status": "Stable", "event": "Admission baseline recorded"},
        {"timestamp": "09:15", "status": "Stable", "event": "Vital signs consistent with recovery baseline"},
    ]
    if p["pathology"] == "Hypoxia":
        patient_history[pid].extend([
            {"timestamp": "10:10", "status": "Warning", "event": "SpO₂ decreasing from 97% to 92%"},
            {"timestamp": "10:18", "status": "Warning", "event": "Edge AI risk score elevated to 0.74"},
            {"timestamp": "10:20", "status": "Critical", "event": "High-risk Hypoxia event generated locally"},
        ])
    elif p["pathology"] == "Arrhythmia":
        patient_history[pid].extend([
            {"timestamp": "10:05", "status": "Warning", "event": "Premature ventricular complexes (PVC) detected"},
            {"timestamp": "10:15", "status": "Warning", "event": "Irregular R-R variability confirmed by Edge SQA"},
        ])

# Connected WebSocket clients
connected_clients: List[WebSocket] = []

@app.get("/")
def read_root():
    return {
        "system": "BlueEdge Glove Edge-AI Gateway",
        "philosophy": "Sense locally -> Process locally -> Analyze locally -> Alert locally -> Synchronize selectively",
        "version": "1.4.0",
        "status": "OPERATIONAL"
    }

@app.get("/api/patients")
def get_patients():
    return list(patients_store.values())

@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: str):
    if patient_id not in patients_store:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patients_store[patient_id]

@app.get("/api/patients/{patient_id}/signals")
def get_patient_signals(patient_id: str, points: int = 50):
    if patient_id not in simulators:
        raise HTTPException(status_code=404, detail="Simulator for patient not found")
    chunk = simulators[patient_id].generate_waveform_chunk(n_points=points)
    return {"patient_id": patient_id, "waveforms": chunk}

@app.get("/api/patients/{patient_id}/history")
def get_patient_history(patient_id: str):
    if patient_id not in patient_history:
        return []
    return patient_history[patient_id]

@app.get("/api/system/status")
def get_system_status():
    stats = sync_mgr.get_stats()
    return SystemStatus(
        mode=system_mode,
        esp32_gateway_connected=True,
        signal_preprocessing_active=True,
        edge_ai_active=True,
        risk_engine_active=True,
        local_storage_active=True,
        cloud_sync_active=stats["cloud_sync_active"],
        internet_connected=stats["internet_connected"],
        buffered_events_count=stats["buffered_events_count"],
        raw_data_processed_kb=stats["raw_data_processed_kb"],
        cloud_sync_transmitted_kb=stats["cloud_sync_transmitted_kb"],
        bandwidth_reduction_pct=stats["bandwidth_reduction_pct"],
        edge_inference_latency_ms=14.8
    )

class ModeRequest(BaseModel):
    mode: str # LIVE_HARDWARE, SIMULATION, RESEARCH

@app.post("/api/system/mode")
def set_system_mode(req: ModeRequest):
    global system_mode
    if req.mode in ["LIVE_HARDWARE", "SIMULATION", "RESEARCH"]:
        system_mode = req.mode
        return {"status": "SUCCESS", "current_mode": system_mode}
    raise HTTPException(status_code=400, detail="Invalid mode")

class ConnectivityRequest(BaseModel):
    online: bool

@app.post("/api/system/cloud-connection")
def toggle_cloud_connection(req: ConnectivityRequest):
    sync_mgr.set_connectivity(req.online)
    return {"status": "SUCCESS", "internet_connected": sync_mgr.internet_connected}

class PathologyRequest(BaseModel):
    pathology: str # Normal, Hypoxia, Arrhythmia, Sepsis/Fever, Shock, Motion Artifact

@app.post("/api/patients/{patient_id}/simulate-pathology")
def set_pathology(patient_id: str, req: PathologyRequest):
    if patient_id not in simulators:
        raise HTTPException(status_code=404, detail="Patient not found")
    simulators[patient_id].set_pathology(req.pathology)
    step_patient_cycle(patient_id)
    return {"status": "SUCCESS", "patient_id": patient_id, "pathology": req.pathology}

class AdmitPatientRequest(BaseModel):
    name: str
    bed: str
    age: int
    gender: str
    admission_reason: str
    pathology: str = "Normal"
    glove_id: str = "BE-GLOVE-09"

@app.post("/api/patients")
def admit_patient(req: AdmitPatientRequest):
    new_num = len(patients_store) + 101
    pid = f"P{new_num}"
    
    sim = PhysiologicalSimulator(pid, base_state=req.pathology)
    sim.set_pathology(req.pathology)
    simulators[pid] = sim
    
    vitals_data = sim.step_vitals()
    vitals = PatientVitals(**vitals_data)
    quality = SensorQuality()
    features = {"perfusion_index": 4.2, "ecg_amplitude": 1.2, "temperature_c": vitals.temperature, "respiratory_rate": vitals.respiratory_rate, "motion_index": 0.08, "gsr_microsiemens": vitals.gsr_microsiemens}
    ai_raw = edge_ai.infer(vitals_data, features, quality.overall_sqi)
    ai_final = risk_engine.evaluate(vitals_data, ai_raw, quality, [])
    
    status = "Stable"
    if ai_final.risk_level in ["CRITICAL", "HIGH"]:
        status = "Critical" if ai_final.risk_level == "CRITICAL" else "Warning"
        
    now_str = time.strftime("%I:%M %p")
    new_patient = Patient(
        id=pid,
        name=req.name,
        bed=req.bed,
        age=req.age,
        gender=req.gender,
        admission_reason=req.admission_reason,
        status=status,
        vitals=vitals,
        quality=quality,
        ai_analysis=ai_final,
        last_update=time.time(),
        is_discharged=False,
        admitted_at=now_str,
        glove_id=req.glove_id
    )
    patients_store[pid] = new_patient
    patient_history[pid] = [
        {"timestamp": now_str, "status": "Stable", "event": f"Patient IN: Admitted to {req.bed}. Paired with {req.glove_id}."},
    ]
    return new_patient

class DischargeRequest(BaseModel):
    disposition: str = "Discharged Home"
    notes: str = "Patient stable; continuous telemetry disconnected."

@app.post("/api/patients/{patient_id}/discharge")
def discharge_patient(patient_id: str, req: DischargeRequest):
    if patient_id not in patients_store:
        raise HTTPException(status_code=404, detail="Patient not found")
    p = patients_store[patient_id]
    p.is_discharged = True
    now_str = time.strftime("%I:%M %p")
    p.discharged_at = now_str
    p.discharge_disposition = req.disposition
    p.discharge_notes = req.notes
    
    if patient_id not in patient_history:
        patient_history[patient_id] = []
    patient_history[patient_id].append({
        "timestamp": now_str,
        "status": "Stable",
        "event": f"Patient OUT: Discharged from {p.bed}. Disposition: {req.disposition}. {req.notes}"
    })
    return {"status": "SUCCESS", "patient_id": patient_id, "discharged_at": now_str}


class HardwareIngestPayload(BaseModel):
    device_id: str
    patient_id: str = "P101"
    raw_ppg: List[float] = []
    raw_ecg: List[float] = []
    skin_temp_c: float
    resp_rate: float
    imu_accel: List[float] = [0.0, 0.0, 9.81]
    gsr_val: float

@app.post("/api/hardware/ingest")
def ingest_esp32_hardware_packet(packet: HardwareIngestPayload):
    """
    Direct ingestion endpoint for physical ESP32 Glove or companion gateway.
    Raw multimodal packets are received locally, passed through SQA, filtered,
    inferenced, and evaluated without ever being sent to the cloud.
    """
    pid = packet.patient_id
    if pid not in patients_store:
        pid = "P101"
        
    quality = preprocessor.compute_sqi(packet.raw_ppg, packet.raw_ecg, packet.imu_accel)
    vitals_dict = {
        "heart_rate": 75,
        "spo2": 98,
        "temperature": packet.skin_temp_c,
        "respiratory_rate": int(packet.resp_rate),
        "gsr_microsiemens": packet.gsr_val,
        "motion_activity": "Resting" if quality.imu == "GOOD" else "Moving"
    }
    features = preprocessor.extract_features(packet.raw_ppg, packet.raw_ecg, packet.skin_temp_c, packet.resp_rate, packet.imu_accel, packet.gsr_val)
    ai_raw = edge_ai.infer(vitals_dict, features, quality.overall_sqi)
    ai_final = risk_engine.evaluate(vitals_dict, ai_raw, quality, [])

    # Update patient store
    p = patients_store[pid]
    p.vitals = PatientVitals(**vitals_dict)
    p.quality = quality
    p.ai_analysis = ai_final
    p.last_update = time.time()
    
    # Selective cloud sync processing
    sync_payload = CloudSyncPayload(
        patient_id=pid,
        timestamp=time.time(),
        heart_rate=p.vitals.heart_rate,
        spo2=p.vitals.spo2,
        temperature=p.vitals.temperature,
        respiratory_rate=p.vitals.respiratory_rate,
        risk_score=ai_final.risk_score,
        risk_level=ai_final.risk_level,
        predicted_state=ai_final.predicted_state,
        overall_sqi=quality.overall_sqi,
        model_version=ai_final.model_version
    )
    sync_mgr.process_telemetry(raw_sample_bytes=1024, payload=sync_payload)

    return {"status": "INGESTED_AND_EVALUATED_LOCALLY", "risk_level": ai_final.risk_level}

def step_patient_cycle(pid: str):
    sim = simulators[pid]
    vitals_data = sim.step_vitals()
    vitals = PatientVitals(**vitals_data)
    
    # Generate temporary waveforms for SQI & feature computation
    waveforms = sim.generate_waveform_chunk(n_points=20)
    ppg_arr = [w["ppg"] for w in waveforms]
    ecg_arr = [w["ecg"] for w in waveforms]
    accel_arr = [w["accel_mag"] for w in waveforms]

    quality = preprocessor.compute_sqi(ppg_arr, ecg_arr, accel_arr)
    features = preprocessor.extract_features(ppg_arr, ecg_arr, vitals.temperature, vitals.respiratory_rate, accel_arr, vitals.gsr_microsiemens)
    ai_raw = edge_ai.infer(vitals_data, features, quality.overall_sqi)
    
    # Check history trend
    prev_trend = [{"spo2": vitals.spo2}]
    ai_final = risk_engine.evaluate(vitals_data, ai_raw, quality, prev_trend)

    status = "Stable"
    if ai_final.risk_level == "CRITICAL":
        status = "Critical"
    elif ai_final.risk_level in ["HIGH", "MODERATE"]:
        status = "Warning"

    p = patients_store[pid]
    p.vitals = vitals
    p.quality = quality
    p.ai_analysis = ai_final
    p.status = status
    p.last_update = time.time()

    # Selective Cloud Sync step (2KB raw window vs 140B compact payload)
    sync_payload = CloudSyncPayload(
        patient_id=pid,
        timestamp=time.time(),
        heart_rate=vitals.heart_rate,
        spo2=vitals.spo2,
        temperature=vitals.temperature,
        respiratory_rate=vitals.respiratory_rate,
        risk_score=ai_final.risk_score,
        risk_level=ai_final.risk_level,
        predicted_state=ai_final.predicted_state,
        overall_sqi=quality.overall_sqi,
        model_version=ai_final.model_version,
        event_type="RISK_ALERT" if status != "Stable" else "PERIODIC_SUMMARY"
    )
    sync_mgr.process_telemetry(raw_sample_bytes=2048, payload=sync_payload)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            # Step simulators for active patients
            for pid in ["P101", "P102", "P103", "P104", "P105"]:
                step_patient_cycle(pid)

            # Generate waveform chunk for active telemetry patient (P104 or P101)
            p104_wave = simulators["P104"].generate_waveform_chunk(n_points=15)
            p101_wave = simulators["P101"].generate_waveform_chunk(n_points=15)

            stats = sync_mgr.get_stats()
            payload = {
                "type": "TELEMETRY_UPDATE",
                "timestamp": time.time(),
                "patients": [p.model_dump() for p in patients_store.values()],
                "active_waveforms": {
                    "P104": p104_wave,
                    "P101": p101_wave
                },
                "sync_stats": stats,
                "system_mode": system_mode
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
    except Exception as e:
        if websocket in connected_clients:
            connected_clients.remove(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
