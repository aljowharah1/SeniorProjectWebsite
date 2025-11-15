-- Pothole Monitoring System Database Schema
-- Created for RASD Senior Project
-- Database: pothole_monitoring

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pothole_monitoring;
USE pothole_monitoring;

-- Table: potholes
-- Stores all pothole detection records
CREATE TABLE IF NOT EXISTS potholes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    depth DECIMAL(6, 2) NOT NULL COMMENT 'Depth in centimeters',
    width DECIMAL(6, 2) DEFAULT NULL COMMENT 'Width in centimeters',
    severity ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    status ENUM('pending', 'resolved') NOT NULL DEFAULT 'pending',
    detected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL DEFAULT NULL,
    location_name VARCHAR(255) DEFAULT NULL COMMENT 'Street or area name',
    district VARCHAR(100) DEFAULT NULL COMMENT 'District in Riyadh',
    notes TEXT DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL COMMENT 'Path to pothole image',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_detected_at (detected_at),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Stores pothole detection records';

-- Table: detection_metadata
-- Stores metadata about how potholes were detected
CREATE TABLE IF NOT EXISTS detection_metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pothole_id INT NOT NULL,
    detection_method ENUM('vehicle_sensor', 'manual_report', 'camera_ai', 'citizen_app') NOT NULL,
    vehicle_id VARCHAR(50) DEFAULT NULL COMMENT 'ID of detecting vehicle if applicable',
    confidence_score DECIMAL(5, 2) DEFAULT NULL COMMENT 'AI confidence score (0-100)',
    speed_at_detection DECIMAL(5, 2) DEFAULT NULL COMMENT 'Vehicle speed in km/h',
    weather_condition VARCHAR(50) DEFAULT NULL,
    temperature DECIMAL(4, 1) DEFAULT NULL COMMENT 'Temperature in Celsius',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pothole_id) REFERENCES potholes(id) ON DELETE CASCADE,
    INDEX idx_pothole_id (pothole_id),
    INDEX idx_detection_method (detection_method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Metadata about pothole detections';

-- Table: repair_logs
-- Tracks repair and maintenance activities
CREATE TABLE IF NOT EXISTS repair_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pothole_id INT NOT NULL,
    action_type ENUM('inspected', 'marked', 'repaired', 'verified') NOT NULL,
    performed_by VARCHAR(100) NOT NULL COMMENT 'Name or ID of worker/team',
    action_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INT DEFAULT NULL COMMENT 'Time taken for repair',
    materials_used TEXT DEFAULT NULL,
    cost DECIMAL(10, 2) DEFAULT NULL COMMENT 'Repair cost in SAR',
    notes TEXT DEFAULT NULL,
    verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pothole_id) REFERENCES potholes(id) ON DELETE CASCADE,
    INDEX idx_pothole_id (pothole_id),
    INDEX idx_action_type (action_type),
    INDEX idx_action_date (action_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Logs repair and maintenance activities';

-- Table: analytics_daily
-- Aggregated daily statistics for performance tracking
CREATE TABLE IF NOT EXISTS analytics_daily (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_detected INT NOT NULL DEFAULT 0,
    high_severity_count INT NOT NULL DEFAULT 0,
    medium_severity_count INT NOT NULL DEFAULT 0,
    low_severity_count INT NOT NULL DEFAULT 0,
    resolved_count INT NOT NULL DEFAULT 0,
    pending_count INT NOT NULL DEFAULT 0,
    avg_resolution_time_hours DECIMAL(8, 2) DEFAULT NULL,
    total_repair_cost DECIMAL(12, 2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Daily aggregated statistics';

-- Table: users (for authentication and access control)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer',
    department VARCHAR(100) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User accounts for system access';

-- Table: audit_log
-- Tracks all system changes for accountability
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    old_values JSON DEFAULT NULL,
    new_values JSON DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Audit trail for all system changes';
