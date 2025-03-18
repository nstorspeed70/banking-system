-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear enum para tipo de empresa
CREATE TYPE enterprise_type AS ENUM ('SAC', 'SRL', 'SA');

-- Crear tabla de empresas
CREATE TABLE IF NOT EXISTS enterprises (
    id SERIAL PRIMARY KEY,
    legal_business_name VARCHAR(100) NOT NULL,
    tax_id VARCHAR(15) UNIQUE NOT NULL,
    enterprise_type enterprise_type NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de personas
CREATE TABLE IF NOT EXISTS parties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de relación empresa-persona
CREATE TABLE IF NOT EXISTS enterprise_parties (
    enterprise_id INTEGER REFERENCES enterprises(id),
    party_id INTEGER REFERENCES parties(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (enterprise_id, party_id)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_enterprises_tax_id ON enterprises(tax_id);
CREATE INDEX IF NOT EXISTS idx_enterprises_is_active ON enterprises(is_active);
CREATE INDEX IF NOT EXISTS idx_parties_email ON parties(email);
CREATE INDEX IF NOT EXISTS idx_parties_is_active ON parties(is_active);
