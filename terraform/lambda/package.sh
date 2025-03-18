#!/bin/bash

# Limpiar archivos anteriores
rm -rf node_modules enterprises_lambda.zip

# Instalar dependencias
npm install

# Crear el archivo ZIP incluyendo todos los archivos necesarios
zip -r enterprises_lambda.zip . \
    -x "package.sh" \
    -x "*.zip" \
    -x "*.git*" \
    -x "*.DS_Store"

echo "✅ Archivo ZIP creado correctamente"
