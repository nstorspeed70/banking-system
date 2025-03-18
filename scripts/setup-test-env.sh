#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Configurando entorno de pruebas...${NC}\n"

# Cargar variables de entorno
source .env.test

# Crear usuario de prueba en Cognito
echo -e "${YELLOW}Creando usuario de prueba en Cognito...${NC}"
aws cognito-idp admin-create-user \
  --user-pool-id $COGNITO_USER_POOL_ID \
  --username $TEST_USER \
  --temporary-password $TEST_PASSWORD \
  --user-attributes Name=email,Value=$TEST_USER Name=email_verified,Value=true \
  --message-action SUPPRESS

# Establecer contraseña permanente
echo -e "${YELLOW}Estableciendo contraseña permanente...${NC}"
aws cognito-idp admin-set-user-password \
  --user-pool-id $COGNITO_USER_POOL_ID \
  --username $TEST_USER \
  --password $TEST_PASSWORD \
  --permanent

# Verificar que el usuario se creó correctamente
echo -e "${YELLOW}Verificando usuario...${NC}"
aws cognito-idp admin-get-user \
  --user-pool-id $COGNITO_USER_POOL_ID \
  --username $TEST_USER

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Entorno de pruebas configurado exitosamente${NC}"
else
    echo -e "\n${RED}❌ Error configurando el entorno de pruebas${NC}"
    exit 1
fi
