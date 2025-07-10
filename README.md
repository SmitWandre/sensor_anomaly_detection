# Sensor Anomaly Detection

A simple web app that flags “normal” vs. “anomaly” hours in temperature & humidity CSVs and visualizes the results.

## Prerequisites
- Docker & Docker Compose  
- Node.js & npm  

## Setup
1. Copy `.env.example` → `.env` and fill in your secrets.  
2. From project root:
   ```bash
   docker-compose build
   docker-compose up -d
   docker-compose exec web python manage.py migrate

In a new terminal:

bash
Copy
Edit
cd frontend
npm install
npm start
Usage
Visit http://localhost:3000

Upload a CSV with columns:

makefile
Copy
Edit
timestamp,temperature,humidity
2025-07-09T00:00:00,22.5,55.0
…  
Watch the line-chart (temperature over time) and scatter-plot (temp vs. humidity clusters).

## Handy Commands

# Reset database
docker-compose down -v

# View backend logs
docker-compose logs web --tail=50

# Rebuild frontend
cd frontend && npm run build
makefile
Copy
Edit
::contentReference[oaicite:0]{index=0}
