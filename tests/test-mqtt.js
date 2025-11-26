// MQTT Test Script - Send Test Messages to HiveMQ Cloud
require('dotenv').config();
const mqtt = require('mqtt');

const MQTT_CONFIG = {
    host: process.env.MQTT_HOST || '8bf2d0ee356f406f8c671f57ebc1c67f.s1.eu.hivemq.cloud',
    port: parseInt(process.env.MQTT_PORT) || 8883,
    protocol: 'mqtts',
    username: process.env.MQTT_USERNAME || 'RASD1',
    password: process.env.MQTT_PASSWORD || 'Rasd@12312312',
    clientId: `test_${Math.random().toString(16).slice(3)}`,
};

const TOPIC = process.env.MQTT_TOPIC || 'rasd/gps/data';

console.log('\n📡 Connecting to HiveMQ Cloud...\n');

const client = mqtt.connect(`${MQTT_CONFIG.protocol}://${MQTT_CONFIG.host}:${MQTT_CONFIG.port}`, {
    username: MQTT_CONFIG.username,
    password: MQTT_CONFIG.password,
    clientId: MQTT_CONFIG.clientId,
    rejectUnauthorized: true,
});

client.on('connect', () => {
    console.log('✅ Connected to HiveMQ Cloud\n');

    // Send test message with ONLY latitude and longitude
    const testMessage = {
        lat: 24.80534553,
        lon: 46.66214752
    };

    console.log('📤 Sending location to HiveMQ...');
    console.log(`📍 Latitude: ${testMessage.lat}`);
    console.log(`📍 Longitude: ${testMessage.lon}`);
    console.log('\nMessage payload:');
    console.log(JSON.stringify(testMessage, null, 2));
    client.publish(TOPIC, JSON.stringify(testMessage), { qos: 1 });

    // Disconnect after sending
    setTimeout(() => {
        console.log('\n✅ Location sent to HiveMQ!\n');
        client.end();
        process.exit(0);
    }, 2000);
});

client.on('error', (error) => {
    console.error('❌ MQTT Error:', error.message);
    process.exit(1);
});
