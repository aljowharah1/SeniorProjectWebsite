// Test Database Connection Only
require('dotenv').config();
const database = require('./backend/database');

async function testConnection() {
    console.log('\n🔍 Testing PostgreSQL Connection...\n');
    console.log('Connection Details:');
    console.log(`  Host: ${process.env.DB_HOST}`);
    console.log(`  Port: ${process.env.DB_PORT}`);
    console.log(`  Database: ${process.env.DB_NAME}`);
    console.log(`  User: ${process.env.DB_USER}`);
    console.log(`  SSL: ${process.env.DB_SSL}\n`);

    const connected = await database.testConnection();

    if (connected) {
        console.log('✅ SUCCESS: Database connection works!\n');
        await database.close();
        process.exit(0);
    } else {
        console.log('❌ FAILED: Cannot connect to database\n');
        console.log('Check your .env file settings');
        process.exit(1);
    }
}

testConnection();
