# RASD - Real-time Autonomous Safety Detector

A comprehensive pothole detection and monitoring system using AI, LiDAR, Camera, and GPS for safer, smarter roads.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- PostgreSQL database (optional, for production)
- Internet connection (for HiveMQ Cloud MQTT)

### Installation

```powershell
npm install
```

### Running the System

```powershell
.\start.ps1
```

Then open:
- **Homepage**: http://localhost:3000/
- **Dashboard**: http://localhost:3000/pages/demo-dashboard.html
- **Login Page**: http://localhost:3000/pages/demo-login.html

### Demo Credentials

- **Username**: `demo`
- **Password**: `rasd2025`

## 📁 Project Structure

```
SeniorProjectWebsite-main/
├── public/                    # Main website homepage
│   └── index.html            # Landing page
├── pages/                     # Application pages
│   ├── demo-login.html       # Authentication page
│   └── demo-dashboard.html   # Monitoring dashboard
├── assets/                    # Static assets
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   ├── js/
│   │   └── main.js           # Homepage scripts
│   ├── images/               # Images and logos
│   │   ├── members/          # Team photos
│   │   └── partners/         # Partner logos
│   └── video.mp4             # Demo video
├── scripts/                   # Application scripts
│   └── demo-dashboard.js     # Dashboard functionality
├── backend/                   # Server code
│   ├── server.js             # Express API server
│   ├── database.js           # Database operations
│   ├── mqttListener.js       # MQTT integration
│   └── data/                 # Data storage
│       └── potholes.json
├── database/                  # Database schemas
│   ├── README.md             # Database documentation
│   ├── pothole_schema.sql    # Main schema
│   ├── sample_data.sql       # Sample data
│   └── schema.sql            # Legacy schema
├── tests/                     # Test files
│   ├── test-connection.js    # Database connection test
│   ├── test-database.js      # Database operations test
│   └── test-mqtt.js          # MQTT connection test
├── media/                     # Large media files
│   └── 14363704_3840_2160_60fps.mp4
├── docs/                      # Documentation
│   └── README.md             # Detailed documentation
├── .env                       # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
└── start.ps1                 # Startup script
```

## 📡 MQTT Integration

### HiveMQ Cloud Configuration

- **Host**: `8bf2d0ee356f406f8c671f57ebc1c67f.s1.eu.hivemq.cloud`
- **Port**: `8883` (MQTTS)
- **Topic**: `rasd/events`
- **Username**: `RASD1`

### Send Test Pothole

```bash
mosquitto_pub -h 8bf2d0ee356f406f8c671f57ebc1c67f.s1.eu.hivemq.cloud \
  -p 8883 -t "rasd/events" -u "RASD1" -P "Rasd@12312312" \
  --capath /etc/ssl/certs/ \
  -m '{"type":"pothole","lat":24.7136,"lon":46.6753,"confidence":95.5,"timestamp":"2025-11-25T00:00:00Z"}'
```

## 🔌 API Endpoints

- `GET /api/potholes` - Get all potholes
- `POST /api/potholes` - Add new pothole
- `GET /api/statistics` - Get system statistics
- `PATCH /api/potholes/:id/status` - Update pothole status
- `GET /api/health` - Health check

## 🧪 Testing

Run tests from the project root:

```powershell
# Test database connection
node tests/test-connection.js

# Test database operations
node tests/test-database.js

# Test MQTT connection
node tests/test-mqtt.js
```

## 🌟 Features

- **Real-Time Detection**: LiDAR + Camera fusion for instant pothole identification
- **Driver Alerts**: LED guidance system (Green = Safe, Orange = Caution, Red = Danger)
- **Cloud Dashboard**: GPS-tagged hazards for municipal monitoring
- **MQTT Integration**: Real-time data streaming via HiveMQ Cloud
- **PostgreSQL Database**: Scalable data storage

## 👥 Team

**RASD Project - Prince Sultan University**

- **Taynam Alzamel** - AI, Robotics & Embedded Systems
- **Aljowharah Aljubair** - Computer Vision & IoT Systems
- **Jumana Almushcab** - Cybersecurity & Sustainability
- **Sarah Alkahwaji** - AI & Data Science

## 🇸🇦 Vision 2030 Alignment

RASD supports Saudi Arabia's Vision 2030 by contributing to:
- Safer mobility infrastructure
- AI and technology leadership
- Smart city initiatives (NEOM, Riyadh Smart City)

## 📄 License

© 2025 RASD Team — Prince Sultan University
