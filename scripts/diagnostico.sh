#!/bin/bash
# Script de diagnóstico del sistema bancario
# Author: Cascade
# Description: System health check and diagnostics
#
# Convención de idioma:
# - Mensajes al usuario: Español
# - Nombres técnicos: Inglés (AWS resources, commands, etc.)
# - Logs: Español
# - Variables: Inglés

# Colores para los mensajes
VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
AZUL='\033[0;34m'
NC='\033[0m'

# Función para mostrar el estado
mostrar_estado() {
    local SERVICIO=$1
    local ESTADO=$2
    if [ $ESTADO -eq 0 ]; then
        echo -e "${VERDE}✅ $SERVICIO: Operativo${NC}"
    else
        echo -e "${ROJO}❌ $SERVICIO: No disponible${NC}"
    fi
}

echo -e "${AZUL}🔍 Iniciando diagnóstico del sistema...${NC}\n"

# 1. Verificar credenciales de AWS
echo -e "${AZUL}Verificando credenciales AWS...${NC}"
if aws sts get-caller-identity &>/dev/null; then
    IDENTITY=$(aws sts get-caller-identity)
    echo -e "${VERDE}✅ Credenciales válidas${NC}"
    echo -e "👤 Usuario: $(echo $IDENTITY | jq -r '.Arn')"
    echo -e "🔑 Cuenta: $(echo $IDENTITY | jq -r '.Account')"
else
    echo -e "${ROJO}❌ Credenciales de AWS no válidas${NC}"
    echo -e "${AMARILLO}💡 Ejecuta 'source terraform/config_aws.sh' para configurar las credenciales${NC}"
fi

echo -e "\n${AZUL}Verificando servicios AWS...${NC}"

# 2. Verificar DynamoDB
aws dynamodb describe-table --table-name sistema-bancario-auditoria &>/dev/null
mostrar_estado "DynamoDB (sistema-bancario-auditoria)" $?

# 3. Verificar Lambda
aws lambda get-function --function-name sistema-bancario-event-processor &>/dev/null
mostrar_estado "Lambda (sistema-bancario-event-processor)" $?

# 4. Verificar EventBridge
aws events describe-event-bus --name sistema-bancario-events &>/dev/null
mostrar_estado "EventBridge (sistema-bancario-events)" $?

# 5. Verificar Cognito
aws cognito-idp describe-user-pool --user-pool-id us-east-1_g5urRrRvg &>/dev/null
mostrar_estado "Cognito (sistema-bancario-users)" $?

# 6. Verificar API Gateway
aws apigateway get-rest-api --rest-api-id cvy20g7osc &>/dev/null
mostrar_estado "API Gateway (sistema-bancario-api)" $?

# 7. Verificar RDS
echo -e "\n${AZUL}Verificando base de datos...${NC}"
DB_ENDPOINT="sistema-bancario-db.c6daoieako9t.us-east-1.rds.amazonaws.com"
if nc -zw1 $DB_ENDPOINT 5432; then
    echo -e "${VERDE}✅ PostgreSQL: Accesible${NC}"
else
    echo -e "${ROJO}❌ PostgreSQL: No accesible${NC}"
fi

# 8. Verificar últimos eventos
echo -e "\n${AZUL}Verificando eventos recientes...${NC}"
EVENTOS=$(aws dynamodb query \
    --table-name sistema-bancario-auditoria \
    --index-name eventType-index \
    --key-condition-expression "eventType = :type" \
    --expression-attribute-values '{":type":{"S":"EnterpriseCreated"}}' \
    --limit 1 2>/dev/null)

if [ $? -eq 0 ]; then
    TOTAL=$(echo $EVENTOS | jq -r '.Count')
    echo -e "${VERDE}✅ Sistema de eventos operativo${NC}"
    echo -e "📊 Total eventos encontrados: $TOTAL"
else
    echo -e "${ROJO}❌ Error al consultar eventos${NC}"
fi

# 9. Verificar logs recientes
echo -e "\n${AZUL}Verificando logs recientes...${NC}"
if aws logs describe-log-streams \
    --log-group-name /aws/lambda/sistema-bancario-event-processor \
    --limit 1 &>/dev/null; then
    echo -e "${VERDE}✅ Logs disponibles${NC}"
else
    echo -e "${ROJO}❌ Logs no accesibles${NC}"
fi

echo -e "\n${AZUL}Resumen de recursos:${NC}"
terraform -chdir=terraform show | grep -E "aws_[a-z_]+\." | sort | uniq | while read -r line; do
    echo -e "- ${VERDE}✓${NC} ${line%%.*}"
done

echo -e "\n${VERDE}✨ Diagnóstico completado${NC}"
