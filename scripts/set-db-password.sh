#!/bin/bash

# Script para configurar la contraseña de la base de datos de manera segura
# NO almacena la contraseña en archivos

# Generar una contraseña segura aleatoria
PASS_LENGTH=16
DB_PASSWORD=$(openssl rand -base64 $PASS_LENGTH)

# Exportar la contraseña como variable de entorno
export TF_VAR_db_password="$DB_PASSWORD"

# Mostrar la contraseña (solo una vez)
echo "Nueva contraseña generada para la base de datos:"
echo "$DB_PASSWORD"
echo
echo "Esta contraseña ha sido exportada como TF_VAR_db_password"
echo "Por favor, guárdala en un lugar seguro."
