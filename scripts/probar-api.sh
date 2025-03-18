#!/bin/bash
# Script para probar la API del sistema bancario
# Author: Cascade

# Colores para los mensajes
VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
AZUL='\033[0;34m'
NC='\033[0m'

# Configuración
API_URL="https://cvy20g7osc.execute-api.us-east-1.amazonaws.com/dev"
COGNITO_URL="https://sistema-bancario-dev.auth.us-east-1.amazoncognito.com"
CLIENT_ID="2qg67m083md62on495ptt3okqs"

# Función para mostrar el menú
mostrar_menu() {
    echo -e "${AZUL}🚀 API del Sistema Bancario${NC}"
    echo -e "\n${AMARILLO}Opciones disponibles:${NC}"
    echo "1. Registrar usuario"
    echo "2. Iniciar sesión"
    echo "3. Crear empresa"
    echo "4. Listar empresas"
    echo "5. Ver empresa específica"
    echo "6. Actualizar empresa"
    echo "7. Eliminar empresa"
    echo "8. Salir"
}

# Función para registrar usuario
registrar_usuario() {
    echo -e "\n${AZUL}📝 Registrar nuevo usuario${NC}"
    read -p "Email: " EMAIL
    read -s -p "Contraseña: " PASSWORD
    echo

    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{
            "ClientId": "'$CLIENT_ID'",
            "Username": "'$EMAIL'",
            "Password": "'$PASSWORD'",
            "UserAttributes": [
                {
                    "Name": "email",
                    "Value": "'$EMAIL'"
                }
            ]
        }' \
        "$COGNITO_URL/signup" | jq '.'

    echo -e "${VERDE}✅ Usuario registrado. Revisa tu correo para confirmar la cuenta.${NC}"
}

# Función para iniciar sesión
iniciar_sesion() {
    echo -e "\n${AZUL}🔑 Iniciar sesión${NC}"
    read -p "Email: " EMAIL
    read -s -p "Contraseña: " PASSWORD
    echo

    RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{
            "AuthFlow": "USER_PASSWORD_AUTH",
            "ClientId": "'$CLIENT_ID'",
            "AuthParameters": {
                "USERNAME": "'$EMAIL'",
                "PASSWORD": "'$PASSWORD'"
            }
        }' \
        "$COGNITO_URL/oauth2/token")

    TOKEN=$(echo $RESPONSE | jq -r '.IdToken')
    echo -e "${VERDE}✅ Sesión iniciada. Token guardado.${NC}"
    export TOKEN
}

# Función para crear empresa
crear_empresa() {
    echo -e "\n${AZUL}📦 Crear nueva empresa${NC}"
    read -p "RUC: " TAX_ID
    read -p "Razón Social: " BUSINESS_NAME
    read -p "Tipo (SRL/SAC): " TYPE
    read -p "Email: " EMAIL
    read -p "Teléfono: " PHONE

    curl -s -X POST "$API_URL/enterprises" \
        -H "Authorization: $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "taxId": "'$TAX_ID'",
            "legalBusinessName": "'$BUSINESS_NAME'",
            "enterpriseType": "'$TYPE'",
            "contactEmail": "'$EMAIL'",
            "contactPhone": "'$PHONE'"
        }' | jq '.'
}

# Función para listar empresas
listar_empresas() {
    echo -e "\n${AZUL}📋 Listando empresas...${NC}"
    curl -s -X GET "$API_URL/enterprises" \
        -H "Authorization: $TOKEN" | jq '.'
}

# Función para ver empresa específica
ver_empresa() {
    echo -e "\n${AZUL}🔍 Ver empresa específica${NC}"
    read -p "ID de la empresa: " ID

    curl -s -X GET "$API_URL/enterprises/$ID" \
        -H "Authorization: $TOKEN" | jq '.'
}

# Función para actualizar empresa
actualizar_empresa() {
    echo -e "\n${AZUL}✏️  Actualizar empresa${NC}"
    read -p "ID de la empresa: " ID
    read -p "Nueva Razón Social: " BUSINESS_NAME
    read -p "Nuevo Teléfono: " PHONE

    curl -s -X PUT "$API_URL/enterprises/$ID" \
        -H "Authorization: $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "legalBusinessName": "'$BUSINESS_NAME'",
            "contactPhone": "'$PHONE'"
        }' | jq '.'
}

# Función para eliminar empresa
eliminar_empresa() {
    echo -e "\n${AZUL}🗑️  Eliminar empresa${NC}"
    read -p "ID de la empresa: " ID

    curl -s -X DELETE "$API_URL/enterprises/$ID" \
        -H "Authorization: $TOKEN" | jq '.'
}

# Menú principal
while true; do
    mostrar_menu
    read -p "Selecciona una opción: " opcion
    case $opcion in
        1) registrar_usuario ;;
        2) iniciar_sesion ;;
        3) crear_empresa ;;
        4) listar_empresas ;;
        5) ver_empresa ;;
        6) actualizar_empresa ;;
        7) eliminar_empresa ;;
        8) echo -e "\n${VERDE}👋 ¡Hasta luego!${NC}"; exit 0 ;;
        *) echo -e "${ROJO}❌ Opción no válida${NC}" ;;
    esac
    echo -e "\nPresiona Enter para continuar..."
    read
done
