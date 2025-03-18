-- Tabla de empresas
CREATE TABLE IF NOT EXISTS enterprises (
    id VARCHAR(36) PRIMARY KEY,
    tax_id VARCHAR(13) UNIQUE NOT NULL,
    legal_business_name VARCHAR(100) NOT NULL,
    enterprise_type VARCHAR(10) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT enterprise_type_check CHECK (enterprise_type IN ('SRL', 'SAC', 'SA')),
    CONSTRAINT tax_id_format CHECK (tax_id ~ '^PE[0-9]{11}$')
);

-- Tabla de partes
CREATE TABLE IF NOT EXISTS parties (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL,
    enterprise_id VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enterprise FOREIGN KEY (enterprise_id) REFERENCES enterprises(id),
    CONSTRAINT role_check CHECK (role IN ('ADMIN', 'EMPLOYEE', 'READ_ONLY')),
    CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_enterprises_tax_id ON enterprises(tax_id);
CREATE INDEX IF NOT EXISTS idx_enterprises_is_active ON enterprises(is_active);
CREATE INDEX IF NOT EXISTS idx_parties_enterprise_id ON parties(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_parties_email ON parties(email);
CREATE INDEX IF NOT EXISTS idx_parties_is_active ON parties(is_active);

-- Comentarios
COMMENT ON TABLE enterprises IS 'Tabla que almacena la información de las empresas registradas';
COMMENT ON COLUMN enterprises.id IS 'Identificador único de la empresa (UUID)';
COMMENT ON COLUMN enterprises.tax_id IS 'RUC de la empresa (formato: PE12345678901)';
COMMENT ON COLUMN enterprises.legal_business_name IS 'Razón social de la empresa';
COMMENT ON COLUMN enterprises.enterprise_type IS 'Tipo de empresa (SRL, SAC, SA)';
COMMENT ON COLUMN enterprises.contact_email IS 'Email de contacto de la empresa';
COMMENT ON COLUMN enterprises.contact_phone IS 'Teléfono de contacto de la empresa';
COMMENT ON COLUMN enterprises.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN enterprises.updated_at IS 'Fecha y hora de última actualización';
COMMENT ON COLUMN enterprises.is_active IS 'Indica si el registro está activo (true) o eliminado (false)';

COMMENT ON TABLE parties IS 'Tabla que almacena la información de las partes registradas';
COMMENT ON COLUMN parties.id IS 'Identificador único de la parte (UUID)';
COMMENT ON COLUMN parties.name IS 'Nombre de la parte';
COMMENT ON COLUMN parties.email IS 'Email de la parte';
COMMENT ON COLUMN parties.role IS 'Rol de la parte (ADMIN, EMPLOYEE, READ_ONLY)';
COMMENT ON COLUMN parties.enterprise_id IS 'Identificador de la empresa a la que pertenece la parte';
COMMENT ON COLUMN parties.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN parties.updated_at IS 'Fecha y hora de última actualización';
COMMENT ON COLUMN parties.is_active IS 'Indica si el registro está activo (true) o eliminado (false)';

-- Crear función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers
CREATE TRIGGER update_enterprises_timestamp
    BEFORE UPDATE ON enterprises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parties_timestamp
    BEFORE UPDATE ON parties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
