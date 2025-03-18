#!/bin/bash
# Script para verificar convenciones de idioma
# Author: Cascade
# Description: Verify language conventions across the codebase

# Colores para los mensajes
VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
AZUL='\033[0;34m'
NC='\033[0m'

echo -e "${AZUL}🔍 Verificando convenciones de idioma...${NC}\n"

# Verificar código fuente (debe estar en inglés)
echo -e "${AZUL}📝 Verificando código fuente...${NC}"
SPANISH_VARS=$(find src -type f -name "*.ts" -exec grep -l "const \(el\|la\|los\|las\)" {} \;)
if [ -n "$SPANISH_VARS" ]; then
    echo -e "${ROJO}❌ Se encontraron variables en español:${NC}"
    echo "$SPANISH_VARS"
else
    echo -e "${VERDE}✅ No se encontraron variables en español${NC}"
fi

# Verificar mensajes de error (deben estar en español)
echo -e "\n${AZUL}💬 Verificando mensajes de error...${NC}"
ENGLISH_ERRORS=$(find src -type f -name "*.ts" -exec grep -l "throw new.*('The\|Invalid\|Error:" {} \;)
if [ -n "$ENGLISH_ERRORS" ]; then
    echo -e "${ROJO}❌ Se encontraron mensajes de error en inglés:${NC}"
    echo "$ENGLISH_ERRORS"
else
    echo -e "${VERDE}✅ Mensajes de error correctamente en español${NC}"
fi

# Verificar nombres de eventos (deben estar en inglés)
echo -e "\n${AZUL}🔄 Verificando nombres de eventos...${NC}"
SPANISH_EVENTS=$(find src -type f -name "*.ts" -exec grep -l "Creado\|Actualizado\|Eliminado')" {} \;)
if [ -n "$SPANISH_EVENTS" ]; then
    echo -e "${ROJO}❌ Se encontraron eventos en español:${NC}"
    echo "$SPANISH_EVENTS"
else
    echo -e "${VERDE}✅ Nombres de eventos correctamente en inglés${NC}"
fi

# Verificar logs (deben estar en español)
echo -e "\n${AZUL}📋 Verificando logs...${NC}"
ENGLISH_LOGS=$(find src -type f -name "*.ts" -exec grep -l "console.log('Processing\|Created\|Updated')" {} \;)
if [ -n "$ENGLISH_LOGS" ]; then
    echo -e "${ROJO}❌ Se encontraron logs en inglés:${NC}"
    echo "$ENGLISH_LOGS"
else
    echo -e "${VERDE}✅ Logs correctamente en español${NC}"
fi

# Verificar documentación técnica (debe estar en inglés)
echo -e "\n${AZUL}📚 Verificando documentación técnica...${NC}"
SPANISH_DOCS=$(find src -type f -name "*.ts" -exec grep -l "@description.*empresa\|@param.*usuario" {} \;)
if [ -n "$SPANISH_DOCS" ]; then
    echo -e "${ROJO}❌ Se encontró documentación técnica en español:${NC}"
    echo "$SPANISH_DOCS"
else
    echo -e "${VERDE}✅ Documentación técnica correctamente en inglés${NC}"
fi

# Verificar scripts de diagnóstico (mensajes deben estar en español)
echo -e "\n${AZUL}🛠️  Verificando scripts de diagnóstico...${NC}"
ENGLISH_SCRIPTS=$(find scripts -type f -name "*.sh" -exec grep -l "echo.*'Checking\|Processing\|Error:'" {} \;)
if [ -n "$ENGLISH_SCRIPTS" ]; then
    echo -e "${ROJO}❌ Se encontraron mensajes en inglés en scripts:${NC}"
    echo "$ENGLISH_SCRIPTS"
else
    echo -e "${VERDE}✅ Scripts correctamente en español${NC}"
fi

# Resumen
echo -e "\n${AZUL}📊 Resumen de convenciones de idioma:${NC}"
echo -e "- 💻 Código fuente: ${VERDE}Inglés${NC}"
echo -e "- 💬 Mensajes de error: ${VERDE}Español${NC}"
echo -e "- 🔄 Nombres de eventos: ${VERDE}Inglés${NC}"
echo -e "- 📋 Logs: ${VERDE}Español${NC}"
echo -e "- 📚 Documentación técnica: ${VERDE}Inglés${NC}"
echo -e "- 🛠️  Scripts de diagnóstico: ${VERDE}Español${NC}"

echo -e "\n${AZUL}💡 Recomendaciones:${NC}"
echo -e "1. Mantener nombres de variables y funciones en inglés"
echo -e "2. Escribir mensajes de error y logs en español"
echo -e "3. Documentar código en inglés"
echo -e "4. Mantener mensajes de diagnóstico en español"

echo -e "\n${VERDE}✨ Verificación completada${NC}"
