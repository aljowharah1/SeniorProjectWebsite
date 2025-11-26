-- RASD Pothole Detection System - PostgreSQL Schema (Updated)
-- Separate confidence values for Camera and LiDAR

-- Drop existing table if you want to recreate
-- DROP TABLE IF EXISTS potholes CASCADE;
-- DROP VIEW IF EXISTS pothole_statistics;

-- Potholes table with separate confidence values
CREATE TABLE IF NOT EXISTS potholes (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    detection_type VARCHAR(20) NOT NULL CHECK (detection_type IN ('Camera', 'LiDAR', 'Both')),
    camera_confidence DECIMAL(5, 2) CHECK (camera_confidence >= 0 AND camera_confidence <= 100),
    lidar_confidence DECIMAL(5, 2) CHECK (lidar_confidence >= 0 AND lidar_confidence <= 100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
    sensor_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_potholes_status ON potholes(status);
CREATE INDEX IF NOT EXISTS idx_potholes_detection_type ON potholes(detection_type);
CREATE INDEX IF NOT EXISTS idx_potholes_timestamp ON potholes(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_potholes_location ON potholes(latitude, longitude);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_potholes_updated_at ON potholes;
CREATE TRIGGER update_potholes_updated_at BEFORE UPDATE
    ON potholes FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- View for statistics
CREATE OR REPLACE VIEW pothole_statistics AS
SELECT
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE detection_type = 'Camera') as camera_count,
    COUNT(*) FILTER (WHERE detection_type = 'LiDAR') as lidar_count,
    COUNT(*) FILTER (WHERE detection_type = 'Both') as both_count,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
    COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count
FROM potholes;
