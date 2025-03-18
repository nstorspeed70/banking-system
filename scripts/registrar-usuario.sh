#!/bin/bash
# Script para registrar usuarios en Cognito
# Author: Cascade

# Colores para los mensajes
VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
AZUL='\033[0;34m'
NC='\033[0m'

# Configuración de Cognito
USER_POOL_ID="us-east-1_g5urRrRvg"
CLIENT_ID="2qg67m083md62on495ptt3okqs"

echo -e "${AZUL}🔐 Registro de Usuario en Sistema Bancario${NC}"

# Solicitar información del usuario
echo -e "\n${AZUL}📝 Ingrese los datos del usuario:${NC}"
read -p "Email: " EMAIL
read -s -p "Contraseña: " PASSWORD
echo

# Validar contraseña
if [[ ${#PASSWORD} -lt 8 ]]; then
    echo -e "${ROJO}❌ La contraseña debe tener al menos 8 caracteres${NC}"
    exit 1
fi

if [[ ! $PASSWORD =~ [A-Z] ]]; then
    echo -e "${ROJO}❌ La contraseña debe tener al menos una mayúscula${NC}"
    exit 1
fi

if [[ ! $PASSWORD =~ [a-z] ]]; then
    echo -e "${ROJO}❌ La contraseña debe tener al menos una minúscula${NC}"
    exit 1
fi

if [[ ! $PASSWORD =~ [0-9] ]]; then
    echo -e "${ROJO}❌ La contraseña debe tener al menos un número${NC}"
    exit 1
fi

if [[ ! $PASSWORD =~ ['!@#$%^&*()_+'] ]]; then
    echo -e "${ROJO}❌ La contraseña debe tener al menos un símbolo${NC}"
    exit 1
fi

echo -e "\n${AZUL}🔄 Registrando usuario...${NC}"

# Crear usuario
aws cognito-idp admin-create-user \
    --user-pool-id $USER_POOL_ID \
    --username $EMAIL \
    --temporary-password $PASSWORD \
    --user-attributes Name=email,Value=$EMAIL Name=email_verified,Value=true \
    --message-action SUPPRESS

if [ $? -ne 0 ]; then
    echo -e "${ROJO}❌ Error al crear usuario${NC}"
    exit 1
fi

echo -e "${VERDE}✅ Usuario creado exitosamente${NC}"

# Establecer contraseña permanente
echo -e "\n${AZUL}🔄 Configurando contraseña permanente...${NC}"

aws cognito-idp admin-set-user-password \
    --user-pool-id $USER_POOL_ID \
    --username $EMAIL \
    --password $PASSWORD \
    --permanent

if [ $? -ne 0 ]; then
    echo -e "${ROJO}❌ Error al establecer contraseña${NC}"
    exit 1
fi

echo -e "${VERDE}✅ Contraseña establecida exitosamente${NC}"

# Obtener token
echo -e "\n${AZUL}🔄 Obteniendo token de acceso...${NC}"

TOKEN_RESULT=$(aws cognito-idp initiate-auth \
    --client-id $CLIENT_ID \
    --auth-flow USER_PASSWORD_AUTH \
    --auth-parameters USERNAME=$EMAIL,PASSWORD=$PASSWORD)

if [ $? -ne 0 ]; then
    echo -e "${ROJO}❌ Error al obtener token${NC}"
    exit 1
fi

ID_TOKEN=$(echo $TOKEN_RESULT | jq -r '.AuthenticationResult.IdToken')
ACCESS_TOKEN=$(echo $TOKEN_RESULT | jq -r '.AuthenticationResult.AccessToken')

echo -e "${VERDE}✅ Token obtenido exitosamente${NC}"

# Guardar tokens
echo -e "\n${AZUL}💾 Guardando tokens...${NC}"
echo "export ID_TOKEN=\"$ID_TOKEN\"" > tokens.sh
echo "export ACCESS_TOKEN=\"$ACCESS_TOKEN\"" >> tokens.sh
chmod +x tokens.sh

echo -e "${VERDE}✅ Proceso completado exitosamente${NC}"
echo -e "\n${AMARILLO}Para usar los tokens:${NC}"
echo -e "source tokens.sh"

# Mostrar ejemplo de uso
echo -e "\n${AZUL}📝 Ejemplo de uso con curl:${NC}"
echo -e "curl -H \"Authorization: \$ID_TOKEN\" {{apiUrl}}/enterprises"
