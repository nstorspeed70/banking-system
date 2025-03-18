#!/bin/bash

# Script para probar la conexión a la base de datos
echo "🔧 Prueba de Conexión a Base de Datos"
echo "------------------------------------"

# Usar la contraseña del ambiente si está disponible
if [ -z "$TF_VAR_db_password" ]; then
    echo -n "Por favor, ingresa la contraseña de la base de datos: "
    read -s DB_PASSWORD
    echo
else
    DB_PASSWORD=$TF_VAR_db_password
fi

# Configurar variables
export PGPASSWORD=$DB_PASSWORD
DB_HOST="sistema-bancario-db.c6daoieako9t.us-east-1.rds.amazonaws.com"
DB_USER="dbmaster"
DB_NAME="sistema_bancario"

echo -e "\n📡 Probando conexión..."
if psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\dt" > /dev/null 2>&1; then
    echo "✅ Conexión exitosa a la base de datos!"
    
    # Crear tabla de prueba
    echo -e "\n📝 Creando tabla de prueba..."
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME << EOF
    CREATE TABLE IF NOT EXISTS prueba_conexion (
        id SERIAL PRIMARY KEY,
        mensaje TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO prueba_conexion (mensaje) 
    VALUES ('Prueba de conexión desde ambiente local');

    SELECT * FROM prueba_conexion;
EOF

    echo -e "\n🧹 Limpiando..."
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "DROP TABLE prueba_conexion;"

    echo -e "\n✨ Prueba completada con éxito!"
else
    echo "❌ Error al conectar a la base de datos"
    echo "Por favor verifica:"
    echo "1. La contraseña es correcta"
    echo "2. El security group permite tu IP (${CURRENT_IP})"
    echo "3. La base de datos está activa"
fi

# Limpiar la contraseña del ambiente
unset PGPASSWORD
