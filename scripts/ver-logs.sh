#!/bin/bash
# Script para ver logs de Lambda con formato amigable
# Author: Cascade
# Description: View Lambda logs with user-friendly formatting
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

echo -e "${AZUL}📋 Obteniendo logs de Lambda...${NC}\n"

# Obtener el último stream de logs
STREAM=$(aws logs describe-log-streams \
  --log-group-name /aws/lambda/sistema-bancario-event-processor \
  --order-by LastEventTime \
  --descending \
  --limit 1 \
  --query 'logStreams[0].logStreamName' \
  --output text)

if [ $? -ne 0 ]; then
    echo -e "${ROJO}❌ Error al obtener el stream de logs${NC}"
    exit 1
fi

# Obtener y formatear los logs
aws logs get-log-events \
  --log-group-name /aws/lambda/sistema-bancario-event-processor \
  --log-stream-name "$STREAM" \
  --limit 100 | jq -r '.events[] | "\(.timestamp/1000 | strftime("%Y-%m-%d %H:%M:%S")) \(.message)"' | while read -r line; do
    if [[ $line == *"ERROR"* ]]; then
        echo -e "${ROJO}$line${NC}"
    elif [[ $line == *"WARN"* ]]; then
        echo -e "${AMARILLO}$line${NC}"
    elif [[ $line == *"✅"* ]] || [[ $line == *"SUCCESS"* ]]; then
        echo -e "${VERDE}$line${NC}"
    else
        echo "$line"
    fi
done

echo -e "\n${AZUL}✨ Fin de los logs${NC}"
