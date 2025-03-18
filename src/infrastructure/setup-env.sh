#!/bin/bash

# Configuración de variables de entorno para el sistema bancario
echo "Configurando variables de entorno..."

# AWS Credentials (ya configuradas en ~/.aws/credentials)
export AWS_REGION=us-east-1

# Database Configuration
export DB_HOST=sistema-bancario-db.c6daoieako9t.us-east-1.rds.amazonaws.com
export DB_PORT=5432
export DB_USER=dbmaster
export DB_NAME=sistema_bancario

# Solicitar contraseña de base de datos de forma segura
echo -n "Por favor, ingresa la contraseña de la base de datos: "
read -s DB_PASSWORD
echo
export DB_PASSWORD

# EventBridge Configuration
export EVENT_BUS_NAME=sistema-bancario-events

# DynamoDB Configuration
export DYNAMODB_TABLE=sistema-bancario-auditoria

echo "✅ Variables de entorno configuradas correctamente"
