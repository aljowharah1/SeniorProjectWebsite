const mqtt = require('mqtt');
const database = require('./database');

/**
 * MQTT Listener for RASD Pothole Detection
 * Connects to HiveMQ Cloud and saves potholes to PostgreSQL
 * Supports separate camera and lidar confidence values
 */

// HiveMQ Cloud Configuration
const MQTT_CONFIG = {
    host: process.env.MQTT_HOST || '8bf2d0ee356f406f8c671f57ebc1c67f.s1.eu.hivemq.cloud',
    port: parseInt(process.env.MQTT_PORT) || 8883,
    protocol: 'mqtts',
    username: process.env.MQTT_USERNAME || 'RASD1',
    password: process.env.MQTT_PASSWORD || 'Rasd@12312312',
    clientId: `rasd_${Math.random().toString(16).slice(3)}`,
    reconnectPeriod: 1000,
};

const TOPIC = process.env.MQTT_TOPIC || 'rasd/events';

class MQTTListener {
    constructor() {
        this.client = null;
    }

    async connect() {
        console.log('\n🔌 Connecting to HiveMQ Cloud...');
        const brokerUrl = `${MQTT_CONFIG.protocol}://${MQTT_CONFIG.host}:${MQTT_CONFIG.port}`;

        this.client = mqtt.connect(brokerUrl, {
            username: MQTT_CONFIG.username,
            password: MQTT_CONFIG.password,
            clientId: MQTT_CONFIG.clientId,
            reconnectPeriod: MQTT_CONFIG.reconnectPeriod,
            rejectUnauthorized: true,
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('connect', () => {
            console.log('✅ Connected to HiveMQ Cloud');
            this.client.subscribe(TOPIC, { qos: 1 }, (err) => {
                if (!err) {
                    console.log(`📡 Subscribed to: ${TOPIC}`);
                    console.log('🎧 Listening for potholes...\n');
                }
            });
        });

        this.client.on('message', async (topic, message) => {
            try {
                const payload = message.toString();
                console.log(`📨 Message: ${payload}`);

                const data = JSON.parse(payload);
                await this.savePothole(data);
            } catch (error) {
                console.error('❌ Error processing message:', error.message);
            }
        });

        this.client.on('error', (error) => {
            console.error('❌ MQTT Error:', error.message);
        });

        this.client.on('reconnect', () => {
            console.log('🔄 Reconnecting...');
        });
    }

    async savePothole(data) {
        try {
            const pothole = await database.insertPothole({
                latitude: data.lat,
                longitude: data.lon,
                timestamp: data.timestamp,
                detectionType: data.detectionType || data.detection_type,
                camera_confidence: data.camera_confidence || data.cameraConfidence,
                lidar_confidence: data.lidar_confidence || data.lidarConfidence,
                sensor_id: data.sensor_id
            });

            // Display confidence based on detection type
            const confidenceStr = pothole.detection_type === 'Both'
                ? `Cam: ${pothole.camera_confidence}%, LiDAR: ${pothole.lidar_confidence}%`
                : pothole.detection_type === 'Camera'
                    ? `Camera: ${pothole.camera_confidence}%`
                    : `LiDAR: ${pothole.lidar_confidence}%`;

            console.log(`✅ Pothole #${pothole.id} saved (${pothole.detection_type}, ${confidenceStr})\n`);
        } catch (error) {
            console.error('❌ Error saving pothole:', error.message);
        }
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            console.log('🔌 MQTT Disconnected');
        }
    }
}

module.exports = new MQTTListener();
