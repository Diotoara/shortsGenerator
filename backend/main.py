# import torch
# from TTS.api import TTS
# from fastapi import FastAPI
# import gradio as gr
# from pydantic import BaseModel

# app = FastAPI()
# device = "cuda" if torch.cuda.is_available() else "cpu"
# tts = TTS(model_name='tts_models/en/jenny/jenny').to(device)

# class TTSRequest(BaseModel):
#     text: str

# @app.post("/generate")
# def generate_audio(req:TTSRequest):
#     tts.tts_to_file(text=req.text, file_path="../outputs/output4.wav")
#     return "../outputs/output4.wav"

# # run this cli cmd to run file.
# # uvicorn main:app --host 0.0.0.0 --port 8000



import io
import soundfile as sf
import torch
from fastapi import FastAPI, Response
from pydantic import BaseModel
from TTS.api import TTS


app = FastAPI()
device = "cuda" if torch.cuda.is_available() else "cpu"
tts = TTS(model_name='tts_models/en/jenny/jenny').to(device)

class TTSRequest(BaseModel):
    text: str

@app.post("/generate")
def generate_audio(req: TTSRequest):
    audio_data = tts.tts(text=req.text)
    sampling_rate = tts.synthesizer.output_sample_rate
    wav_buffer = io.BytesIO()
    sf.write(wav_buffer, audio_data, sampling_rate, format='WAV')
    wav_bytes = wav_buffer.getvalue()
    return Response(content=wav_bytes, media_type="audio/wav")
