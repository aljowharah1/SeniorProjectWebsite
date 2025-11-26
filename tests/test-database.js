// Test Database Schema with Separate Camera/LiDAR Confidence
require('dotenv').config();
const database = require('./backend/database');

async function testDatabase() {
    console.log('\n🔍 Testing Database with Separate Confidence Values...\n');

    try {
        // Test 1: Connection
        console.log('1️⃣ Testing connection...');
        const connected = await database.testConnection();
        if (!connected) {
            console.log('❌ Connection failed - cannot continue tests\n');
            process.exit(1);
        }

        // Test 2: Insert Camera-only pothole
        console.log('2️⃣ Testing Camera-only detection...');
        const cameraPothole = await database.insertPothole({
            latitude: 24.7136,
            longitude: 46.6753,
            timestamp: new Date().toISOString(),
            detectionType: 'Camera',
            camera_confidence: 74.5,
            lidar_confidence: null,
            sensor_id: 'CAM_001'
        });
        console.log(`   ✅ Inserted Camera pothole #${cameraPothole.id} (${cameraPothole.camera_confidence}%)`);

        // Test 3: Insert LiDAR-only pothole
        console.log('3️⃣ Testing LiDAR-only detection...');
        const lidarPothole = await database.insertPothole({
            latitude: 24.7140,
            longitude: 46.6755,
            timestamp: new Date().toISOString(),
            detectionType: 'LiDAR',
            camera_confidence: null,
            lidar_confidence: 82,
            sensor_id: 'LIDAR_001'
        });
        console.log(`   ✅ Inserted LiDAR pothole #${lidarPothole.id} (${lidarPothole.lidar_confidence}%)`);

        // Test 4: Insert Both sensors pothole
        console.log('4️⃣ Testing Both sensors detection...');
        const bothPothole = await database.insertPothole({
            latitude: 24.7145,
            longitude: 46.6760,
            timestamp: new Date().toISOString(),
            detectionType: 'Both',
            camera_confidence: 55.7,
            lidar_confidence: 74.2,
            sensor_id: 'FUSION_001'
        });
        console.log(`   ✅ Inserted Both pothole #${bothPothole.id}`);
        console.log(`      Camera: ${bothPothole.camera_confidence}%`);
        console.log(`      LiDAR: ${bothPothole.lidar_confidence}%`);

        // Test 5: Read all potholes
        console.log('5️⃣ Testing SELECT operation...');
        const allPotholes = await database.getAllPotholes();
        console.log(`   ✅ Found ${allPotholes.length} potholes in database`);

        // Test 6: Get statistics
        console.log('6️⃣ Testing STATISTICS view...');
        const stats = await database.getStatistics();
        console.log(`   ✅ Statistics:`);
        console.log(`      Total: ${stats.total}`);
        console.log(`      Camera: ${stats.camera_count}`);
        console.log(`      LiDAR: ${stats.lidar_count}`);
        console.log(`      Both: ${stats.both_count}`);
        console.log(`      Pending: ${stats.pending_count}`);

        // Test 7: Clean up
        console.log('7️⃣ Cleaning up test data...');
        await database.deletePothole(cameraPothole.id);
        await database.deletePothole(lidarPothole.id);
        await database.deletePothole(bothPothole.id);
        console.log(`   ✅ Deleted test potholes`);

        console.log('\n✅ ALL TESTS PASSED!\n');
        console.log('Your database supports separate camera and lidar confidence!\n');

    } catch (error) {
        console.log('\n❌ TEST FAILED:');
        console.log(`   Error: ${error.message}\n`);
        console.log('Possible issues:');
        console.log('  - Schema not updated (run new schema.sql in Supabase)');
        console.log('  - Missing camera_confidence/lidar_confidence columns');
        console.log('  - Table needs to be recreated\n');
    } finally {
        await database.close();
        process.exit(0);
    }
}

testDatabase();
