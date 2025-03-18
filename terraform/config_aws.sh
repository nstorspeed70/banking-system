#!/bin/bash
# Script para configurar variables de Terraform y credenciales de AWS
# IMPORTANTE: No subir este archivo a Git

# ==========================================
# Variables para Terraform
# ==========================================
# Contraseña para la base de datos PostgreSQL
export TF_VAR_db_password="sistema-bancario-2025"

# Ambiente de desarrollo
export TF_VAR_ambiente="dev"

# ==========================================
# Configuración de AWS
# ==========================================
# Región por defecto
export AWS_DEFAULT_REGION="us-east-1"
export AWS_REGION="us-east-1"

# Verificar si existe el directorio .aws
if [ ! -d ~/.aws ]; then
    echo "❌ Directorio .aws no encontrado"
    echo "Por favor, ejecuta 'aws configure' para configurar tus credenciales"
    exit 1
fi

# Verificar si existe el archivo de credenciales
if [ ! -f ~/.aws/credentials ]; then
    echo "❌ Archivo de credenciales no encontrado"
    echo "Por favor, ejecuta 'aws configure' para configurar tus credenciales"
    exit 1
fi

# Verificar si las credenciales son válidas
echo "🔑 Verificando credenciales de AWS..."
if ! aws sts get-caller-identity &>/dev/null; then
    echo "❌ Credenciales inválidas"
    echo "Por favor, ejecuta 'aws configure' para configurar nuevas credenciales"
    exit 1
fi

# Mostrar información del usuario
IDENTITY=$(aws sts get-caller-identity)
echo "✅ Credenciales válidas"
echo "👤 Usuario: $(echo $IDENTITY | jq -r '.Arn')"
echo "🔑 Account: $(echo $IDENTITY | jq -r '.Account')"

echo "✅ Variables de Terraform configuradas correctamente"
