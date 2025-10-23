-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    certificate_type VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    file_url VARCHAR(500),
    container_number VARCHAR(100),
    commodity VARCHAR(255),
    treatment_type VARCHAR(100),
    gas_type VARCHAR(100),
    concentration VARCHAR(100),
    exposure_time VARCHAR(100),
    temperature VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create fumigation_records table
CREATE TABLE IF NOT EXISTS fumigation_records (
    id SERIAL PRIMARY KEY,
    certificate_id INTEGER REFERENCES certificates(id),
    container_number VARCHAR(100) NOT NULL,
    commodity VARCHAR(255) NOT NULL,
    treatment_date DATE NOT NULL,
    gas_type VARCHAR(100) NOT NULL,
    concentration VARCHAR(100) NOT NULL,
    exposure_time VARCHAR(100) NOT NULL,
    temperature VARCHAR(100) NOT NULL,
    humidity VARCHAR(100),
    inspector_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@prana.com', '$2b$10$hash_for_admin123', 'Admin User', 'admin'),
('user@prana.com', '$2b$10$hash_for_user123', 'Regular User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample certificates
INSERT INTO certificates (
    user_id, certificate_number, certificate_type, company_name, 
    issue_date, expiry_date, status, container_number, commodity,
    treatment_type, gas_type, concentration, exposure_time, temperature
) VALUES
(2, 'PRANA-2024-001', 'Fumigation Certificate', 'PT Exportir Indonesia', 
 '2024-01-15', '2024-07-15', 'active', 'TEMU1234567', 'Coffee Beans',
 'Methyl Bromide', 'CH3Br', '32 g/m³', '24 hours', '25°C'),
(2, 'PRANA-2024-002', 'ISPM-15 Certificate', 'PT Kayu Ekspor', 
 '2024-02-01', '2024-08-01', 'active', 'TCLU9876543', 'Wooden Pallets',
 'Heat Treatment', 'N/A', 'N/A', '30 minutes', '56°C'),
(2, 'PRANA-2024-003', 'AFAS Certificate', 'PT Agro Export', 
 '2024-02-15', '2024-08-15', 'active', 'MSKU5555555', 'Rice',
 'Phosphine', 'PH3', '2 g/m³', '72 hours', '28°C')
ON CONFLICT (certificate_number) DO NOTHING;
