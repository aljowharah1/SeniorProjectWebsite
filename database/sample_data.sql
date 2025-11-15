-- Sample Data for Pothole Monitoring System
-- Insert test data for demo purposes

USE pothole_monitoring;

-- Insert demo user (password: rasd2025)
-- Note: In production, use proper password hashing (bcrypt, argon2, etc.)
INSERT INTO users (username, password_hash, full_name, email, role, department) VALUES
('demo', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo User', 'demo@rasd.edu.sa', 'admin', 'Municipality Operations'),
('operator1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmad Al-Zahrani', 'ahmad@riyadh.gov.sa', 'operator', 'Road Maintenance'),
('viewer1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fatima Al-Qahtani', 'fatima@riyadh.gov.sa', 'viewer', 'Planning Department');

-- Insert sample pothole detections in different areas of Riyadh
INSERT INTO potholes (latitude, longitude, depth, width, severity, status, location_name, district, detected_at) VALUES
-- High severity potholes
(24.7136, 46.6753, 8.5, 45.0, 'high', 'pending', 'King Fahd Road', 'Al Olaya', '2025-11-15 08:30:00'),
(24.6877, 46.7219, 9.2, 52.0, 'high', 'pending', 'Al Khaleej Street', 'Al Malaz', '2025-11-15 09:15:00'),
(24.7741, 46.7386, 7.8, 48.0, 'high', 'pending', 'Northern Ring Road', 'Al Nakheel', '2025-11-15 10:45:00'),
(24.6509, 46.7152, 8.0, 40.0, 'high', 'resolved', 'Al Madina Road', 'Al Batha', '2025-11-14 14:20:00'),

-- Medium severity potholes
(24.7244, 46.6925, 5.5, 35.0, 'medium', 'pending', 'Olaya Street', 'Al Olaya', '2025-11-15 11:00:00'),
(24.6945, 46.6871, 6.2, 38.0, 'medium', 'pending', 'King Abdullah Road', 'Al Murabbah', '2025-11-15 12:30:00'),
(24.7563, 46.6988, 5.8, 33.0, 'medium', 'pending', 'Takhassusi Street', 'Al Sulimaniyah', '2025-11-15 13:45:00'),
(24.6798, 46.7543, 5.0, 30.0, 'medium', 'resolved', 'Makkah Road', 'Al Naseem', '2025-11-14 16:00:00'),
(24.7092, 46.6534, 6.0, 36.0, 'medium', 'resolved', 'Prince Mohammed Bin Abdulaziz Road', 'Al Mohammadiyah', '2025-11-14 17:30:00'),

-- Low severity potholes
(24.7418, 46.6632, 3.5, 25.0, 'low', 'pending', 'Al Amir Sultan Street', 'Al Wurud', '2025-11-15 14:00:00'),
(24.6632, 46.7234, 3.2, 22.0, 'low', 'resolved', 'Imam Saud Bin Abdulaziz Road', 'Al Rabwah', '2025-11-14 18:45:00'),
(24.7854, 46.7124, 4.0, 28.0, 'low', 'resolved', 'Eastern Ring Road', 'Al Rabi', '2025-11-14 19:15:00');

-- Insert detection metadata for some potholes
INSERT INTO detection_metadata (pothole_id, detection_method, vehicle_id, confidence_score, speed_at_detection, weather_condition, temperature) VALUES
(1, 'vehicle_sensor', 'VEH-001', 95.50, 65.0, 'Clear', 28.5),
(2, 'camera_ai', 'CAM-012', 92.30, NULL, 'Clear', 29.0),
(3, 'vehicle_sensor', 'VEH-003', 88.70, 70.0, 'Partly Cloudy', 27.8),
(4, 'citizen_app', NULL, NULL, NULL, 'Clear', 30.5),
(5, 'vehicle_sensor', 'VEH-002', 91.20, 55.0, 'Clear', 28.0),
(6, 'camera_ai', 'CAM-008', 87.40, NULL, 'Clear', 29.5),
(7, 'vehicle_sensor', 'VEH-001', 93.80, 60.0, 'Clear', 28.2),
(8, 'manual_report', NULL, NULL, NULL, 'Clear', 31.0),
(9, 'camera_ai', 'CAM-015', 89.60, NULL, 'Partly Cloudy', 27.5),
(10, 'vehicle_sensor', 'VEH-004', 85.30, 50.0, 'Clear', 28.8);

-- Insert repair logs for resolved potholes
INSERT INTO repair_logs (pothole_id, action_type, performed_by, action_date, duration_minutes, materials_used, cost, verification_status) VALUES
(4, 'inspected', 'Team Alpha', '2025-11-14 15:00:00', 15, NULL, NULL, 'approved'),
(4, 'repaired', 'Team Alpha', '2025-11-14 15:30:00', 45, 'Asphalt mix (50kg), Sealant', 350.00, 'approved'),
(4, 'verified', 'Inspector Ahmad', '2025-11-14 16:30:00', 10, NULL, NULL, 'approved'),

(8, 'inspected', 'Team Beta', '2025-11-14 16:15:00', 12, NULL, NULL, 'approved'),
(8, 'repaired', 'Team Beta', '2025-11-14 16:45:00', 35, 'Asphalt mix (40kg)', 280.00, 'approved'),

(9, 'inspected', 'Team Gamma', '2025-11-14 17:40:00', 10, NULL, NULL, 'approved'),
(9, 'repaired', 'Team Gamma', '2025-11-14 18:00:00', 30, 'Cold patch asphalt (30kg)', 220.00, 'approved'),

(11, 'inspected', 'Team Alpha', '2025-11-14 19:00:00', 8, NULL, NULL, 'approved'),
(11, 'repaired', 'Team Alpha', '2025-11-14 19:20:00', 25, 'Asphalt mix (25kg)', 180.00, 'approved'),

(12, 'inspected', 'Team Beta', '2025-11-14 19:30:00', 10, NULL, NULL, 'approved'),
(12, 'repaired', 'Team Beta', '2025-11-14 19:50:00', 28, 'Cold patch asphalt (30kg)', 200.00, 'approved');

-- Insert daily analytics
INSERT INTO analytics_daily (date, total_detected, high_severity_count, medium_severity_count, low_severity_count, resolved_count, pending_count, avg_resolution_time_hours, total_repair_cost) VALUES
('2025-11-14', 12, 4, 5, 3, 5, 7, 2.5, 1230.00),
('2025-11-15', 7, 3, 3, 1, 0, 7, NULL, 0.00);

-- Insert some audit log entries
INSERT INTO audit_log (user_id, action, table_name, record_id, new_values, ip_address) VALUES
(1, 'CREATE', 'potholes', 1, '{"severity":"high","status":"pending"}', '192.168.1.100'),
(2, 'UPDATE', 'potholes', 4, '{"status":"resolved"}', '192.168.1.101'),
(2, 'CREATE', 'repair_logs', 1, '{"action_type":"inspected"}', '192.168.1.101');
