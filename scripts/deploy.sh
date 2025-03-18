#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando despliegue a producción...${NC}\n"

# Verificar variables de entorno requeridas
required_vars=(
    "DB_PASSWORD"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Error: La variable de entorno $var no está definida${NC}"
        exit 1
    fi
done

# Construir la aplicación
echo -e "${YELLOW}Construyendo la aplicación...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en la construcción${NC}"
    exit 1
fi

# Aplicar migraciones de base de datos
echo -e "${YELLOW}Aplicando migraciones de base de datos...${NC}"
npm run typeorm migration:run -- -d src/infrastructure/config/typeorm.config.ts

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al aplicar migraciones${NC}"
    exit 1
fi

# Desplegar a AWS Lambda
echo -e "${YELLOW}Desplegando a AWS Lambda...${NC}"
cd terraform && terraform init && terraform apply -auto-approve

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el despliegue${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Despliegue completado exitosamente${NC}"
