require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./database');
const mqttListener = require('./mqttListener');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from new directory structure
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/pages', express.static(path.join(__dirname, '..', 'pages')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use('/scripts', express.static(path.join(__dirname, '..', 'scripts')));
app.use('/media', express.static(path.join(__dirname, '..', 'media')));

// API Routes
app.get('/api/potholes', async (req, res) => {
    try {
        const potholes = await database.getAllPotholes();
        res.json({
            success: true,
            count: potholes.length,
            data: potholes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/potholes', async (req, res) => {
    try {
        const { lat, lon, timestamp, detectionType, cameraConfidence, lidarConfidence, sensor_id } = req.body;

        const pothole = await database.insertPothole({
            latitude: lat,
            longitude: lon,
            timestamp: timestamp || new Date().toISOString(),
            detectionType: detectionType || 'Camera',
            camera_confidence: cameraConfidence,
            lidar_confidence: lidarConfidence,
            sensor_id: sensor_id || 'API'
        });

        res.status(201).json({
            success: true,
            data: pothole
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/statistics', async (req, res) => {
    try {
        const stats = await database.getStatistics();
        res.json({
            success: true,
            data: {
                total: parseInt(stats.total),
                camera: parseInt(stats.camera_count),
                lidar: parseInt(stats.lidar_count),
                both: parseInt(stats.both_count),
                pending: parseInt(stats.pending_count),
                resolved: parseInt(stats.resolved_count)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.patch('/api/potholes/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const id = parseInt(req.params.id);

        const pothole = await database.updatePotholeStatus(id, status);

        if (pothole) {
            res.json({ success: true, data: pothole });
        } else {
            res.status(404).json({ success: false, error: 'Pothole not found' });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/health', async (req, res) => {
    const dbConnected = await database.testConnection();
    res.json({
        success: true,
        status: 'running',
        database: dbConnected ? 'connected' : 'disconnected',
        mqtt: 'connected'
    });
});

// Start server
async function start() {
    try {
        // Test database connection
        await database.testConnection();

        // Connect MQTT
        await mqttListener.connect();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n${'='.repeat(50)}`);
            console.log('🚀 RASD Backend Server Started');
            console.log(`${'='.repeat(50)}`);
            console.log(`   URL: http://localhost:${PORT}`);
            console.log(`   Dashboard: http://localhost:${PORT}/pages/demo-dashboard.html`);
            console.log(`   Database: PostgreSQL`);
            console.log(`${'='.repeat(50)}\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

start();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down gracefully...');
    mqttListener.disconnect();
    await database.close();
    process.exit(0);
});

module.exports = app;
