const { Pool } = require('pg');

/**
 * PostgreSQL Database Module for RASD
 * Supports both local and cloud PostgreSQL databases
 * Updated to use separate camera_confidence and lidar_confidence
 */

class Database {
    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'rasd_potholes',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.pool.on('error', (err) => {
            console.error('❌ Unexpected database error:', err);
        });
    }

    /**
     * Test database connection
     */
    async testConnection() {
        try {
            const client = await this.pool.connect();
            console.log('✅ PostgreSQL connected successfully');
            client.release();
            return true;
        } catch (error) {
            console.error('❌ PostgreSQL connection failed:', error.message);
            return false;
        }
    }

    /**
     * Insert a new pothole with separate camera and lidar confidence
     */
    async insertPothole(data) {
        const query = `
      INSERT INTO potholes (latitude, longitude, timestamp, detection_type, camera_confidence, lidar_confidence, sensor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

        const values = [
            data.latitude,
            data.longitude,
            data.timestamp || new Date().toISOString(),
            data.detectionType || 'Camera',
            data.camera_confidence || null,
            data.lidar_confidence || null,
            data.sensor_id || 'UNKNOWN'
        ];

        try {
            const result = await this.pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Error inserting pothole:', error);
            throw error;
        }
    }

    /**
     * Get all potholes
     */
    async getAllPotholes(limit = 1000) {
        const query = `
      SELECT * FROM potholes
      ORDER BY timestamp DESC
      LIMIT $1
    `;

        try {
            const result = await this.pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            console.error('❌ Error fetching potholes:', error);
            throw error;
        }
    }

    /**
     * Get pothole by ID
     */
    async getPotholeById(id) {
        const query = 'SELECT * FROM potholes WHERE id = $1';

        try {
            const result = await this.pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Error fetching pothole:', error);
            throw error;
        }
    }

    /**
     * Update pothole status
     */
    async updatePotholeStatus(id, status) {
        const query = `
      UPDATE potholes
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

        try {
            const result = await this.pool.query(query, [status, id]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Error updating status:', error);
            throw error;
        }
    }

    /**
     * Get statistics using optimized view
     */
    async getStatistics() {
        const query = 'SELECT * FROM pothole_statistics';

        try {
            const result = await this.pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Error fetching statistics:', error);
            throw error;
        }
    }

    /**
     * Delete pothole
     */
    async deletePothole(id) {
        const query = 'DELETE FROM potholes WHERE id = $1 RETURNING id';

        try {
            const result = await this.pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Error deleting pothole:', error);
            throw error;
        }
    }

    /**
     * Close database connection pool
     */
    async close() {
        await this.pool.end();
        console.log('✅ Database connection closed');
    }
}

module.exports = new Database();
