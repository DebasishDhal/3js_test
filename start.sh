#!/bin/bash
serve -s static -l 3000 & 
uvicorn main:app --host 0.0.0.0 --port 8000 