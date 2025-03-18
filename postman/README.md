# Guía de Postman - Sistema Bancario

## Convenciones de Idioma

### Español
Se utiliza en:
- Esta documentación y guías de uso
- Mensajes de error en las respuestas
- Descripciones de los endpoints
- Mensajes de validación

### English (Inglés)
Se utiliza en:
- Nombres de campos en peticiones (taxId, legalBusinessName)
- Nombres de endpoints (enterprises, auth)
- Nombres de variables (apiUrl, token)
- Respuestas técnicas de la API

## Configuración Inicial

### 1. Importar Colección
1. Abrir Postman
2. Click en "Import"
3. Seleccionar los archivos:
   - `Sistema-Bancario.postman_collection.json`
   - `Sistema-Bancario.postman_environment.json`

### 2. Configurar Variables de Entorno
1. Click en el ícono de ⚙️ (Manage Environments)
2. Seleccionar "Sistema Bancario - Ambiente Dev"
3. Actualizar los siguientes valores:
   - `userEmail`: Tu correo electrónico
   - `userPassword`: Tu contraseña (debe cumplir con los requisitos de Cognito)
     - Mínimo 8 caracteres
     - Al menos una mayúscula
     - Al menos una minúscula
     - Al menos un número
     - Al menos un símbolo

## Endpoints Disponibles

### Autenticación

#### 1. Registrar Usuario
- **Método**: POST
- **Endpoint**: {{cognitoUrl}}/sign-up?client_id={{clientId}}
- **Cuerpo de la Petición**:
  ```json
  {
    "AuthFlow": "ADMIN_NO_SRP_AUTH",
    "ClientId": "{{clientId}}",
    "AuthParameters": {
      "USERNAME": "{{userEmail}}",
      "PASSWORD": "{{userPassword}}"
    }
  }
  ```
- **Notas Importantes**:
  - El correo debe ser válido
  - La contraseña debe cumplir los requisitos de seguridad
  - Recibirás un código de confirmación por correo

#### 2. Iniciar Sesión
- **Método**: POST
- **Endpoint**: {{cognitoUrl}}/oauth2/token
- **Cuerpo de la Petición**:
  ```json
  {
    "AuthFlow": "USER_PASSWORD_AUTH",
    "ClientId": "{{clientId}}",
    "AuthParameters": {
      "USERNAME": "{{userEmail}}",
      "PASSWORD": "{{userPassword}}"
    }
  }
  ```
- **Nota**: El token se guardará automáticamente en las variables de entorno

### Empresas

#### 1. Crear Empresa
- **Método**: POST
- **Endpoint**: {{apiUrl}}/enterprises
- **Ejemplo de cuerpo**:
  ```json
  {
    "taxId": "PE12345678901",
    "legalBusinessName": "Mi Empresa SRL",
    "enterpriseType": "SRL",
    "contactEmail": "contacto@miempresa.com",
    "contactPhone": "+51999888777"
  }
  ```

#### 2. Listar Empresas
- **Método**: GET
- **Endpoint**: {{apiUrl}}/enterprises
- **Descripción**: Obtiene todas las empresas registradas

#### 3. Ver Empresa
- **Método**: GET
- **Endpoint**: {{apiUrl}}/enterprises/{{enterpriseId}}
- **Nota**: Reemplazar {{enterpriseId}} con el ID real

#### 4. Actualizar Empresa
- **Método**: PUT
- **Endpoint**: {{apiUrl}}/enterprises/{{enterpriseId}}
- **Ejemplo de cuerpo**:
  ```json
  {
    "legalBusinessName": "Mi Empresa Actualizada SRL",
    "contactPhone": "+51999888666"
  }
  ```

#### 5. Eliminar Empresa
- **Método**: DELETE
- **Endpoint**: {{apiUrl}}/enterprises/{{enterpriseId}}

## Pruebas Paso a Paso

1. **Registrar Usuario**
   ```
   1. Usar el endpoint "Registrar Usuario"
   2. Verificar el correo electrónico
   3. Confirmar la cuenta
   ```

2. **Obtener Token**
   ```
   1. Usar el endpoint "Iniciar Sesión"
   2. El token se guardará automáticamente
   ```

3. **Crear Empresa**
   ```
   1. Usar el endpoint "Crear Empresa"
   2. Guardar el ID recibido en la variable enterpriseId
   ```

4. **Operaciones con la Empresa**
   ```
   1. Listar empresas para ver todas
   2. Ver detalles usando el ID
   3. Actualizar información
   4. Eliminar si es necesario
   ```

## Solución de Problemas

### Error de Autenticación
```
✅ Solución: Verificar que el token es válido iniciando sesión nuevamente
```

### Error al Crear Empresa
```
✅ Verificar formato del RUC (debe ser PE + 11 dígitos)
✅ Asegurarse que el email tiene formato válido
```

### Error 404 al Ver Empresa
```
✅ Confirmar que el ID de empresa es correcto
✅ Verificar que la empresa no ha sido eliminada
```

## Notas Importantes

1. **Tokens**
   - Los tokens expiran cada 1 hora
   - Usar "Iniciar Sesión" para obtener uno nuevo

2. **Variables de Entorno**
   - No compartir credenciales
   - Mantener actualizadas las URLs

3. **Buenas Prácticas**
   - Probar en orden los endpoints
   - Guardar IDs importantes
   - Verificar respuestas de error

> **Nota**: Aunque esta guía está en español para facilitar su uso, todos los nombres de campos en las peticiones (taxId, legalBusinessName, etc.) están en inglés siguiendo las convenciones del proyecto.

## Solución de Problemas Comunes

### Error "Required String parameter 'client_id' is not present"
```
✅ Solución: Verificar que estás usando la URL correcta con el parámetro client_id
Ejemplo: {{cognitoUrl}}/sign-up?client_id={{clientId}}
```

### Error "Invalid username or password"
```
✅ Verificar que la contraseña cumple con los requisitos:
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un símbolo
```

### Error "User not confirmed"
```
✅ Revisar el correo electrónico y confirmar la cuenta con el código recibido
```
