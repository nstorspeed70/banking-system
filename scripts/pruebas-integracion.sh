#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando pruebas de integración...${NC}\n"

# Verificar variables de entorno
if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Error: DB_PASSWORD no está configurado${NC}"
    exit 1
fi

# Instalar dependencias
echo -e "${YELLOW}Instalando dependencias...${NC}"
npm install jest axios aws-sdk pg uuid --save-dev

# Ejecutar pruebas de base de datos
echo -e "\n${YELLOW}Ejecutando pruebas de base de datos...${NC}"
jest tests/integration/db/database.test.js --verbose

# Ejecutar pruebas de autenticación
echo -e "\n${YELLOW}Ejecutando pruebas de autenticación...${NC}"
jest tests/integration/auth/cognito.test.js --verbose

# Ejecutar pruebas de API
echo -e "\n${YELLOW}Ejecutando pruebas de API...${NC}"
jest tests/integration/api/enterprises.test.js --verbose

# Verificar resultados
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Todas las pruebas de integración pasaron exitosamente${NC}"
else
    echo -e "\n${RED}❌ Algunas pruebas fallaron${NC}"
    exit 1
fi
