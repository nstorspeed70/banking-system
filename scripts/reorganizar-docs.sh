#!/bin/bash
# Script para reorganizar la documentación
# Author: Cascade
# Description: Reorganize documentation maintaining language conventions

# Colores para los mensajes
VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
AZUL='\033[0;34m'
NC='\033[0m'

echo -e "${AZUL}🔄 Reorganizando documentación...${NC}\n"

# Crear estructura de directorios
echo -e "${AZUL}📁 Creando estructura de directorios...${NC}"
mkdir -p docs/{es,en}
echo -e "${VERDE}✅ Directorios creados${NC}\n"

# Mover archivos existentes
echo -e "${AZUL}📋 Actualizando README principal...${NC}"
cat > README.md << 'EOL'
# Sistema Bancario API

> **Nota Importante**: Este proyecto sigue una convención bilingüe donde la documentación de uso está en español para facilitar el diagnóstico y la interacción con usuarios, mientras que todo el código, nombres de funciones, variables y documentación técnica están en inglés siguiendo las mejores prácticas de desarrollo.

## 📚 Documentación

### En Español
- [🚀 Guía Rápida](docs/es/guia-rapida.md) - Inicio rápido y comandos comunes
- [🔄 Sistema de Eventos](docs/es/eventos.md) - Documentación del sistema de eventos

### In English
- [📖 Technical Documentation](docs/en/technical.md) - Architecture, code examples and development guidelines

## 🚀 Inicio Rápido

\`\`\`bash
# 1. Configurar AWS
source terraform/config_aws.sh

# 2. Instalar dependencias
npm install

# 3. Crear infraestructura
cd terraform && terraform apply -auto-approve

# 4. Probar el sistema
./scripts/diagnostico.sh
\`\`\`

## 🛠️ Scripts de Diagnóstico

\`\`\`bash
# Diagnóstico general
./scripts/diagnostico.sh

# Ver logs
./scripts/ver-logs.sh

# Ver eventos
./scripts/ver-eventos.sh
\`\`\`

## 🏗️ Estructura del Proyecto

\`\`\`
.
├── src/                    # Código fuente
│   ├── domain/            # Capa de dominio
│   ├── application/       # Capa de aplicación
│   ├── infrastructure/    # Capa de infraestructura
│   └── interface/         # Capa de interfaz
├── docs/                  # Documentación
│   ├── es/               # Documentación en español
│   └── en/               # Technical documentation
├── scripts/              # Scripts de diagnóstico
└── terraform/            # Infraestructura como código
\`\`\`

## 🌟 Características

- ✨ Clean Architecture
- 🎯 Domain-Driven Design (DDD)
- 📦 CQRS (Command Query Responsibility Segregation)
- 🔄 Event-Driven Architecture
- 🚀 Serverless con AWS Lambda
- 🔐 Autenticación con Cognito
- 📊 Auditoría con DynamoDB

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
EOL

echo -e "${VERDE}✅ README actualizado${NC}\n"

# Verificar archivos
echo -e "${AZUL}🔍 Verificando documentación...${NC}"
for file in docs/es/guia-rapida.md docs/es/eventos.md docs/en/technical.md; do
    if [ -f "$file" ]; then
        echo -e "${VERDE}✓ $file existe${NC}"
    else
        echo -e "${ROJO}❌ $file no encontrado${NC}"
    fi
done

echo -e "\n${VERDE}✨ Reorganización completada${NC}"
echo -e "${AMARILLO}💡 Recuerda mantener la consistencia de idiomas:${NC}"
echo -e "   - 🇪🇸 Español: Mensajes de usuario, logs y diagnóstico"
echo -e "   - 🇬🇧 English: Code, variables, and technical docs"
