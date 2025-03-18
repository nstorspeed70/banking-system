#!/bin/bash
# Script para ver eventos en DynamoDB
# Author: Cascade
# Description: View domain events stored in DynamoDB with user-friendly formatting
#
# Convención de idioma:
# - Mensajes al usuario: Español
# - Nombres técnicos: Inglés (AWS resources, commands, etc.)
# - Logs: Español
# - Variables: Inglés
# - Nombres de eventos: Inglés (ej: EnterpriseCreated)
# - Descripciones de eventos: Español

# Colores para los mensajes
VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
AZUL='\033[0;34m'
NC='\033[0m'

# Configuración
TABLE_NAME="sistema-bancario-auditoria"
INDEX_NAME="eventType-index"

echo -e "${AZUL}🔍 Consultando eventos del sistema...${NC}\n"

# Función para mostrar eventos de un tipo específico
mostrar_eventos() {
    local EVENT_TYPE=$1
    local LIMIT=${2:-5}

    echo -e "${AMARILLO}📦 Eventos de tipo: $EVENT_TYPE${NC}"
    
    aws dynamodb query \
        --table-name $TABLE_NAME \
        --index-name $INDEX_NAME \
        --key-condition-expression "eventType = :type" \
        --expression-attribute-values "{\":type\":{\"S\":\"$EVENT_TYPE\"}}" \
        --limit $LIMIT \
        | jq -r '.Items[] | {
            id: .id.S,
            timestamp: .timestamp.S,
            eventType: .eventType.S,
            detail: (.detail.M | {
                id: .id.S,
                taxId: .taxId.S,
                legalBusinessName: .legalBusinessName.S,
                enterpriseType: .enterpriseType.S,
                contactEmail: .contactEmail.S
            })
        }' | jq -r '. | "ID: \(.id)\nFecha: \(.timestamp)\nTipo: \(.eventType)\nDetalles:\n  - Empresa: \(.detail.legalBusinessName)\n  - RUC: \(.detail.taxId)\n  - Tipo: \(.detail.enterpriseType)\n  - Email: \(.detail.contactEmail)\n"'
}

# Verificar credenciales de AWS
echo -e "${AZUL}🔑 Verificando credenciales de AWS...${NC}"
if ! aws sts get-caller-identity &>/dev/null; then
    echo -e "${ROJO}❌ Error: Credenciales de AWS no válidas${NC}"
    echo -e "${AMARILLO}💡 Ejecuta 'source terraform/config_aws.sh' para configurar las credenciales${NC}"
    exit 1
fi
echo -e "${VERDE}✅ Credenciales verificadas${NC}\n"

# Verificar existencia de la tabla
echo -e "${AZUL}📋 Verificando tabla DynamoDB...${NC}"
if ! aws dynamodb describe-table --table-name $TABLE_NAME &>/dev/null; then
    echo -e "${ROJO}❌ Error: Tabla $TABLE_NAME no encontrada${NC}"
    exit 1
fi
echo -e "${VERDE}✅ Tabla encontrada${NC}\n"

# Mostrar eventos por tipo
echo -e "🔄 Últimos eventos registrados:\n"
mostrar_eventos "EnterpriseCreated"
echo -e "-------------------\n"
mostrar_eventos "EnterpriseUpdated"
echo -e "-------------------\n"
mostrar_eventos "EnterpriseDeleted"

echo -e "\n${VERDE}✨ Consulta completada${NC}"
