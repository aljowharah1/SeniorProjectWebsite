# Pothole Monitoring System - Database Documentation

## Overview
This database is designed to store and manage pothole detection data for the Riyadh Municipality Pothole Monitoring System (RASD Senior Project).

## Database Structure

### Tables

#### 1. `potholes`
Main table storing all pothole detection records.

**Columns:**
- `id` - Primary key, auto-increment
- `latitude` - GPS latitude coordinate (DECIMAL 10,8)
- `longitude` - GPS longitude coordinate (DECIMAL 11,8)
- `depth` - Pothole depth in centimeters (DECIMAL 6,2)
- `width` - Pothole width in centimeters (DECIMAL 6,2)
- `severity` - Severity level: 'low', 'medium', or 'high'
- `status` - Current status: 'pending' or 'resolved'
- `detected_at` - Timestamp when pothole was detected
- `resolved_at` - Timestamp when pothole was resolved (nullable)
- `location_name` - Street or area name (VARCHAR 255)
- `district` - District in Riyadh (VARCHAR 100)
- `notes` - Additional notes (TEXT)
- `image_url` - Path to pothole image (VARCHAR 500)
- `created_at` - Record creation timestamp
- `updated_at` - Record last update timestamp

**Indexes:**
- Severity, Status, Detection date, Location coordinates

---

#### 2. `detection_metadata`
Stores metadata about how potholes were detected.

**Columns:**
- `id` - Primary key
- `pothole_id` - Foreign key to potholes table
- `detection_method` - Method: 'vehicle_sensor', 'manual_report', 'camera_ai', or 'citizen_app'
- `vehicle_id` - ID of detecting vehicle (if applicable)
- `confidence_score` - AI detection confidence (0-100)
- `speed_at_detection` - Vehicle speed in km/h
- `weather_condition` - Weather at time of detection
- `temperature` - Temperature in Celsius
- `created_at` - Record creation timestamp

---

#### 3. `repair_logs`
Tracks all repair and maintenance activities.

**Columns:**
- `id` - Primary key
- `pothole_id` - Foreign key to potholes table
- `action_type` - Type: 'inspected', 'marked', 'repaired', or 'verified'
- `performed_by` - Name or ID of worker/team
- `action_date` - When the action was performed
- `duration_minutes` - Time taken for the repair
- `materials_used` - Materials used in repair (TEXT)
- `cost` - Repair cost in Saudi Riyals
- `notes` - Additional notes
- `verification_status` - Status: 'pending', 'approved', or 'rejected'
- `created_at` - Record creation timestamp

---

#### 4. `analytics_daily`
Aggregated daily statistics for performance tracking.

**Columns:**
- `id` - Primary key
- `date` - Date of statistics (unique)
- `total_detected` - Total potholes detected
- `high_severity_count` - Count of high severity potholes
- `medium_severity_count` - Count of medium severity potholes
- `low_severity_count` - Count of low severity potholes
- `resolved_count` - Count of resolved potholes
- `pending_count` - Count of pending potholes
- `avg_resolution_time_hours` - Average resolution time
- `total_repair_cost` - Total repair costs for the day
- `created_at` - Record creation timestamp
- `updated_at` - Record last update timestamp

---

#### 5. `users`
User accounts for authentication and access control.

**Columns:**
- `id` - Primary key
- `username` - Unique username (VARCHAR 50)
- `password_hash` - Hashed password (VARCHAR 255)
- `full_name` - User's full name
- `email` - Email address (unique)
- `role` - User role: 'admin', 'operator', or 'viewer'
- `department` - User's department
- `is_active` - Account active status (BOOLEAN)
- `last_login` - Last login timestamp
- `created_at` - Account creation timestamp
- `updated_at` - Account last update timestamp

**Default Users:**
- Username: `demo`, Password: `rasd2025`, Role: Admin

---

#### 6. `audit_log`
Tracks all system changes for accountability.

**Columns:**
- `id` - Primary key
- `user_id` - Foreign key to users table
- `action` - Action performed (VARCHAR 100)
- `table_name` - Table that was modified
- `record_id` - ID of the modified record
- `old_values` - Previous values (JSON)
- `new_values` - New values (JSON)
- `ip_address` - User's IP address
- `user_agent` - User's browser/device info
- `created_at` - When action was performed

---

## Installation Instructions

### Prerequisites
- MySQL 5.7+ or MariaDB 10.2+
- Database user with CREATE DATABASE privileges

### Setup Steps

1. **Create the database and tables:**
```bash
mysql -u root -p < database/pothole_schema.sql
```

2. **Insert sample data (optional for demo):**
```bash
mysql -u root -p < database/sample_data.sql
```

3. **Verify installation:**
```sql
USE pothole_monitoring;
SHOW TABLES;
SELECT COUNT(*) FROM potholes;
```

---

## Common Queries

### Get all pending high-severity potholes
```sql
SELECT
    id, latitude, longitude, depth, location_name, district, detected_at
FROM potholes
WHERE severity = 'high' AND status = 'pending'
ORDER BY detected_at DESC;
```

### Get potholes detected today
```sql
SELECT *
FROM potholes
WHERE DATE(detected_at) = CURDATE()
ORDER BY severity DESC, detected_at DESC;
```

### Get repair history for a specific pothole
```sql
SELECT
    rl.action_type,
    rl.performed_by,
    rl.action_date,
    rl.duration_minutes,
    rl.cost,
    rl.verification_status
FROM repair_logs rl
WHERE rl.pothole_id = 1
ORDER BY rl.action_date ASC;
```

### Get daily statistics
```sql
SELECT
    date,
    total_detected,
    high_severity_count,
    medium_severity_count,
    low_severity_count,
    resolved_count,
    pending_count,
    avg_resolution_time_hours,
    total_repair_cost
FROM analytics_daily
WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
ORDER BY date DESC;
```

### Get detection methods breakdown
```sql
SELECT
    dm.detection_method,
    COUNT(*) as count,
    AVG(dm.confidence_score) as avg_confidence
FROM detection_metadata dm
GROUP BY dm.detection_method
ORDER BY count DESC;
```

### Get potholes by district
```sql
SELECT
    district,
    COUNT(*) as total,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
FROM potholes
GROUP BY district
ORDER BY total DESC;
```

---

## API Integration Notes

### Inserting a new pothole detection
```sql
INSERT INTO potholes
    (latitude, longitude, depth, width, severity, status, location_name, district)
VALUES
    (24.7136, 46.6753, 8.5, 45.0, 'high', 'pending', 'King Fahd Road', 'Al Olaya');

-- Get the inserted ID
SET @pothole_id = LAST_INSERT_ID();

-- Insert detection metadata
INSERT INTO detection_metadata
    (pothole_id, detection_method, vehicle_id, confidence_score, speed_at_detection)
VALUES
    (@pothole_id, 'vehicle_sensor', 'VEH-001', 95.5, 65.0);
```

### Marking a pothole as resolved
```sql
UPDATE potholes
SET status = 'resolved', resolved_at = NOW()
WHERE id = 1;
```

### Recording a repair action
```sql
INSERT INTO repair_logs
    (pothole_id, action_type, performed_by, duration_minutes, materials_used, cost)
VALUES
    (1, 'repaired', 'Team Alpha', 45, 'Asphalt mix (50kg), Sealant', 350.00);
```

---

## Security Notes

1. **Password Hashing**: Always use bcrypt, argon2, or similar for password hashing
2. **SQL Injection**: Use prepared statements in your application code
3. **Access Control**: Implement role-based access control based on user roles
4. **Audit Trail**: All modifications are logged in the audit_log table
5. **Backup**: Regular database backups are recommended

---

## Maintenance

### Regular Tasks
1. Archive old resolved potholes (older than 1 year)
2. Update daily analytics table
3. Clean up old audit logs (older than 6 months)
4. Optimize indexes quarterly

### Backup Script Example
```bash
#!/bin/bash
mysqldump -u root -p pothole_monitoring > backup_$(date +%Y%m%d).sql
```

---

## Support
For questions or issues, contact the RASD development team.

**Database Version:** 1.0
**Last Updated:** November 2025
