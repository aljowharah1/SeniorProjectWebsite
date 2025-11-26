# RASD Pothole Detection System

Real-time pothole detection and monitoring system using MQTT and IoT sensors.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- Internet connection (for HiveMQ Cloud)

### Installation

```powershell
cd "SeniorProjectWebsite-main"
npm install
```

### Running the System

```powershell
.\start.ps1
```

Then open: **http://localhost:3000/demo-dashboard.html**

## 📡 MQTT Integration

### HiveMQ Cloud Config
- **Host:** `8bf2d0ee356f406f8c671f57ebc1c67f.s1.eu.hivemq.cloud`
- **Port:** `8883` (MQTTS)
- **Topic:** `rasd/events`
- **User:** `RASD1`

### Send Test Pothole

```bash
mosquitto_pub -h 8bf2d0ee356f406f8c671f57ebc1c67f.s1.eu.hivemq.cloud \
  -p 8883 -t "rasd/events" -u "RASD1" -P "Rasd@12312312" \
  --capath /etc/ssl/certs/ \
  -m '{"type":"pothole","lat":24.7136,"lon":46.6753,"confidence":95.5,"timestamp":"2025-11-25T00:00:00Z"}'
```

## 💾 Database

Potholes are saved to: `backend/data/potholes.json`

## 🔌 API Endpoints

- `GET /api/potholes` - Get all potholes
- `GET /api/statistics` - Get statistics
- `PATCH /api/potholes/:id/status` - Update status
- `GET /api/health` - Health check

## 📁 Project Structure

```
SeniorProjectWebsite-main/
├── backend/
│   ├── server.js          # Express API server
│   ├── mqttListener.js    # MQTT HiveMQ integration
│   └── data/
│       └── potholes.json  # JSON database
├── demo-dashboard.html    # Main dashboard
├── demo-dashboard.js      # Dashboard logic
├── package.json
└── start.ps1             # Startup script
```

## Team

RASD Project - Prince Sultan University
- Taynam Alzamel
- Aljowharah Aljubair  
- Jumana Almushcab
- Sarah Alkahwaji
