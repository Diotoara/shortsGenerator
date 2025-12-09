@echo off
cd backend

call .venv\Scripts\activate

call uvicorn main:app --host 127.0.0.1 --port 8000