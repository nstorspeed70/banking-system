#!/bin/bash
# Script para probar el sistema bancario
# Autor: Cascade
# Fecha: 2025-03-14

# Colores para los mensajes
VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
AZUL='\033[0;34m'
NC='\033[0m'

# Configuración
API_URL="https://cvy20g7osc.execute-api.us-east-1.amazonaws.com/dev"
COGNITO_CLIENT_ID="2qg67m083md62on495ptt3okqs"
COGNITO_USER_POOL_ID="us-east-1_g5urRrRvg"

echo -e "${AZUL}🚀 Iniciando prueba del Sistema Bancario...${NC}\n"

# Verificar credenciales de AWS
echo -e "${AZUL}🔑 Verificando credenciales de AWS...${NC}"
if ! aws sts get-caller-identity &>/dev/null; then
    echo -e "${ROJO}❌ Credenciales de AWS no válidas${NC}"
    echo -e "${AMARILLO}💡 Ejecuta 'source config_aws.sh' para configurar las credenciales${NC}"
    exit 1
fi

echo -e "${VERDE}✅ Credenciales de AWS verificadas${NC}\n"

# Crear usuario de prueba
EMAIL="test.user.$(date +%s)@empresaprueba.com"
PASSWORD="Test123456!"

echo -e "${AZUL}👤 Creando usuario de prueba...${NC}"
echo -e "📧 Email: $EMAIL"

# Registrar usuario
if aws cognito-idp sign-up \
    --client-id $COGNITO_CLIENT_ID \
    --username $EMAIL \
    --password $PASSWORD \
    --user-attributes Name=email,Value=$EMAIL &>/dev/null; then
    echo -e "${VERDE}✅ Usuario registrado exitosamente${NC}"
else
    echo -e "${AMARILLO}⚠️  El usuario ya existe o hubo un error al registrar${NC}"
fi

# Confirmar usuario
echo -e "\n${AZUL}🔄 Confirmando usuario...${NC}"
if aws cognito-idp admin-confirm-sign-up \
    --user-pool-id $COGNITO_USER_POOL_ID \
    --username $EMAIL &>/dev/null; then
    echo -e "${VERDE}✅ Usuario confirmado exitosamente${NC}"
else
    echo -e "${AMARILLO}⚠️  El usuario ya estaba confirmado o hubo un error${NC}"
fi

# Iniciar sesión
echo -e "\n${AZUL}🔑 Iniciando sesión...${NC}"
AUTH_RESULT=$(aws cognito-idp initiate-auth \
    --client-id $COGNITO_CLIENT_ID \
    --auth-flow USER_PASSWORD_AUTH \
    --auth-parameters USERNAME=$EMAIL,PASSWORD=$PASSWORD)

if [ $? -eq 0 ]; then
    TOKEN=$(echo $AUTH_RESULT | jq -r '.AuthenticationResult.IdToken')
    echo -e "${VERDE}✅ Sesión iniciada correctamente${NC}"
else
    echo -e "${ROJO}❌ Error al iniciar sesión${NC}"
    exit 1
fi

# Crear empresa
echo -e "\n${AZUL}📦 Creando empresa de prueba...${NC}"
EMPRESA_DATA='{
    "taxId": "PE98765432109",
    "legalBusinessName": "Empresa API Test SRL",
    "enterpriseType": "SRL",
    "contactEmail": "contacto@empresatest.com",
    "contactPhone": "+51999777666"
}'

echo -e "📝 Datos de la empresa:"
echo "$EMPRESA_DATA" | jq '.'

RESPONSE=$(curl -s -X POST "$API_URL/enterprises" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$EMPRESA_DATA")

if [ $? -eq 0 ]; then
    echo -e "${VERDE}✅ Empresa creada exitosamente${NC}"
    echo -e "📋 Respuesta:"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${ROJO}❌ Error al crear la empresa${NC}"
    echo "$RESPONSE" | jq '.'
    exit 1
fi

# Listar empresas
echo -e "\n${AZUL}📋 Consultando lista de empresas...${NC}"
EMPRESAS=$(curl -s -X GET "$API_URL/enterprises" \
    -H "Authorization: $TOKEN")

if [ $? -eq 0 ]; then
    TOTAL=$(echo "$EMPRESAS" | jq '. | length')
    echo -e "${VERDE}✅ Se encontraron $TOTAL empresas${NC}"
    echo -e "📋 Lista de empresas:"
    echo "$EMPRESAS" | jq -r '.[] | "- \(.legalBusinessName) (RUC: \(.taxId))"'
else
    echo -e "${ROJO}❌ Error al consultar empresas${NC}"
    echo "$EMPRESAS" | jq '.'
    exit 1
fi

echo -e "\n${VERDE}✨ Prueba completada exitosamente${NC}"
