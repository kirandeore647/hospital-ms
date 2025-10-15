# Database Setup Script

# Create the database
CREATE DATABASE IF NOT EXISTS hospital_management_system;

# Use the database
USE hospital_management_system;

# The application will automatically create tables using JPA/Hibernate
# However, if you want to create them manually, here are the table structures:

# Users table (stores all user types - Admin, Doctor, Patient)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(10),
    role ENUM('ADMIN', 'DOCTOR', 'PATIENT') NOT NULL,
    specialization VARCHAR(255), -- For doctors only
    license_number VARCHAR(255), -- For doctors only
    address TEXT, -- For patients only
    emergency_contact VARCHAR(255), -- For patients only
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

# Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_datetime DATETIME NOT NULL,
    status ENUM('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

# Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    duration INT, -- in days
    prescribed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

# Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_datetime);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor ON prescriptions(doctor_id);

# Insert sample admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, phone_number, role, created_at, updated_at) 
VALUES ('admin', 'admin@hospital.com', '$2a$10$8K1p/a0dxn2XZkJ2Hx4K0OJ6qBP/lB4lXYO/oN3jE7.8x4yB5C2D6', 'System', 'Administrator', '1234567890', 'ADMIN', NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

# Insert sample doctor (password: doctor123)
INSERT INTO users (username, email, password, first_name, last_name, phone_number, role, specialization, license_number, created_at, updated_at) 
VALUES ('doctor1', 'doctor1@hospital.com', '$2a$10$8K1p/a0dxn2XZkJ2Hx4K0OJ6qBP/lB4lXYO/oN3jE7.8x4yB5C2D6', 'John', 'Smith', '1234567891', 'DOCTOR', 'Cardiology', 'DOC123456', NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

# Insert sample patient (password: patient123)
INSERT INTO users (username, email, password, first_name, last_name, phone_number, role, address, emergency_contact, created_at, updated_at) 
VALUES ('patient1', 'patient1@hospital.com', '$2a$10$8K1p/a0dxn2XZkJ2Hx4K0OJ6qBP/lB4lXYO/oN3jE7.8x4yB5C2D6', 'Jane', 'Doe', '1234567892', 'PATIENT', '123 Main St, City, State', '9876543210', NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

# Note: The above passwords are hashed using BCrypt
# Plain text passwords for testing:
# Admin: admin123
# Doctor: doctor123  
# Patient: patient123