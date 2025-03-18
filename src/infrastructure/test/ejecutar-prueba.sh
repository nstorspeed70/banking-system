#!/bin/bash

# Script para ejecutar prueba de conexión local
echo "🔧 Configuración de prueba local"
echo "-------------------------------"

# Solicitar contraseña de base de datos
echo -n "Por favor, ingresa la contraseña de la base de datos (dbmaster): "
read -s DB_PASSWORD
echo

# Exportar la contraseña como variable de entorno
export DB_PASSWORD

# Ejecutar la prueba
echo -e "\n🚀 Ejecutando prueba de conexión..."
npx ts-node src/infrastructure/test/prueba-local.ts
