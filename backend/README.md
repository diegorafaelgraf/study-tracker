# Study Tracker - Backend

API REST desarrollada con NestJS para gestionar sesiones de práctica y estudio.

## Requisitos Previos

- **Docker** 
- **Docker Compose**

## Levantar entorno local para Desarrollo

### 1. Clonar el repositorio

```bash
git clone https://github.com/diegorafaelgraf/study-tracker
cd project-refactor/backend
```

### 2. Iniciar Servicios

Desde la raíz del proyecto (donde está el `docker-compose.yml`):

```bash
docker compose up --build
```

Este comando:
- Construye la imagen del backend usando `backend/Dockerfile`
- Levanta el servicio `backend` y el servicio `mongo`
- Expone el backend en `http://localhost:4000`
- Usa `MONGO_URI=mongodb://mongo:27017/study-tracker-backend-dev`

Si quieres ejecutarlo en segundo plano:

```bash
docker compose up --build -d
```

### 3. Detener Servicios

```bash
docker compose down
```

### 4. Ver logs

```bash
docker compose logs -f
```

## Levantar entorno Productivo

### 2. Iniciar Servicios

Desde la raíz del proyecto (donde está el `docker-compose.yml`):

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### 2. Detener Servicios 

```bash
docker compose -f docker-compose.prod.yml up down
```

### 4. Ver logs

```bash
docker compose -f docker-compose.prod.yml logs -f
```

## Endpoints disponibles

### Base URL
```
http://localhost:4000
```

### Health Check

#### GET `/`
- **Descripción**: Verifica que el servidor esté funcionando
- **Respuesta**:
  ```json
  "Hello World!"
  ```

---

### Temas (Topics)

#### POST `/api/topics`
- **Descripción**: Crear un nuevo tema de estudio
- **Body**:
  ```json
  {
    "name": "Escalas mayores"
  }
  ```
- **Respuesta**: `{ id, name, createdAt }`

#### GET `/api/topics`
- **Descripción**: Obtener todos los temas
- **Respuesta**: Array de temas con sus IDs y nombres

#### GET `/api/topics/by-name/:name`
- **Descripción**: Buscar un tema por su nombre
- **Parámetros**:
  - `name` (string): Nombre del tema
- **Respuesta**: Objeto del tema encontrado

#### GET `/api/topics/:id`
- **Descripción**: Obtener un tema específico por ID
- **Parámetros**:
  - `id` (number): ID del tema
- **Respuesta**: Objeto del tema

---

### Años Académicos (Years)

#### GET `/api/years`
- **Descripción**: Obtener todos los años académicos
- **Respuesta**: Array de años con sus datos

#### POST `/api/years`
- **Descripción**: Crear un nuevo año académico
- **Body**:
  ```json
  {
    "year": 2024,
    "totalDays": 365
  }
  ```
- **Respuesta**: `{ id, year, totalDays, createdAt }`

#### GET `/api/years/by-year/:year`
- **Descripción**: Obtener un año específico por número de año
- **Parámetros**:
  - `year` (string): Número del año
- **Respuesta**: Objeto del año encontrado

#### GET `/api/years/:id`
- **Descripción**: Obtener un año por ID
- **Parámetros**:
  - `id` (number): ID del año
- **Respuesta**: Objeto del año

---

### Año-Tema (Year-Topic)

Relaciona temas específicos con años académicos y establece metas de práctica.

#### POST `/api/year-topic`
- **Descripción**: Asociar un tema a un año con meta de minutos de práctica
- **Body**:
  ```json
  {
    "topicId": 1,
    "goalMinutes": 500
  }
  ```
- **Respuesta**: `{ id, topicId, goalMinutes, createdAt }`

#### GET `/api/year-topic/:id`
- **Descripción**: Obtener la asociación año-tema por ID
- **Parámetros**:
  - `id` (number): ID de la asociación
- **Respuesta**: Objeto con los datos de la asociación

---

### Sesiones de Práctica (Practice)

Registra las sesiones individuales de práctica.

#### POST `/api/practice`
- **Descripción**: Registrar una nueva sesión de práctica
- **Body**:
  ```json
  {
    "yearTopicId": 1,
    "date": "2024-04-14",
    "durationMinutes": 45
  }
  ```
- **Respuesta**: `{ id, yearTopicId, date, durationMinutes, createdAt }`

#### GET `/api/practice/:id`
- **Descripción**: Obtener una sesión de práctica por ID
- **Parámetros**:
  - `id` (number): ID de la sesión
- **Respuesta**: Objeto con los datos de la sesión

---

## Estructura del Proyecto

```
src/
├── app.controller.ts          # Controlador raíz
├── app.service.ts             # Servicio raíz
├── app.module.ts              # Módulo principal
├── main.ts                     # Punto de entrada
├── setup-app.ts               # Configuración de la app
├── common/                     # Código compartido
│   └── filters/
│       └── mongo-exception.filter.ts
├── practice/                  # Módulo de prácticas
│   ├── practice.controller.ts
│   ├── practice.service.ts
│   ├── practice.module.ts
│   ├── dto/
│   ├── schemas/
│   └── types/
├── topic/                     # Módulo de temas
│   ├── topic.controller.ts
│   ├── topic.service.ts
│   ├── topic.module.ts
│   ├── dto/
│   ├── schemas/
│   └── types/
├── year/                      # Módulo de años
│   ├── year.controller.ts
│   ├── year.service.ts
│   ├── year.module.ts
│   ├── dto/
│   ├── schemas/
│   └── types/
└── year-topic/               # Módulo de año-tema
    ├── year-topic.controller.ts
    ├── year-topic.service.ts
    ├── year-topic.module.ts
    ├── dto/
    ├── schemas/
    └── types/
```

## Parar los servicios

Para detener la base de datos:

```bash
docker-compose down
```

## Testing

### Configuración Jest

El proyecto está configurado con Jest para testing unitario y e2e. La configuración incluye:
- **Test Pattern**: `**/*.spec.ts`
- **Coverage Directory**: `./coverage`
- **Entorno**: Node.js
- **Transformer**: `ts-jest`

### Ejecutar Tests

#### Test Básico
Ejecuta una sola vez todos los tests:
```bash
npm test
```

#### Test en Modo Watch
Ejecuta los tests en modo vigilancia. Se re-ejecutan automáticamente cuando hay cambios:
```bash
npm run test:watch
```

#### Test con Coverage
Ejecuta los tests y genera un reporte de cobertura de código:
```bash
npm run test:cov
```

El reporte se guardará en el directorio `./coverage` con:
- **coverage/lcov-report/index.html** - Reporte HTML interactivo
- **coverage/lcov.info** - Formato LCOV
- **coverage/coverage-final.json** - Datos en JSON

#### Test Debug
Ejecuta los tests en modo debug para depuración con Node inspector:
```bash
npm run test:debug
```

Luego abre `chrome://inspect` en Chrome para conectarte al debugger.

#### Test E2E
Ejecuta tests end-to-end usando configuración específica:
```bash
npm run test:e2e
```

Usa `test/jest-e2e.json` para la configuración de tests E2E.

### Estructura de Tests

Los tests están organizados por módulo, espejando la estructura de `src/`:

```
test/
├── jest-e2e.json          # Configuración de tests E2E
└── *.e2e-spec.ts          # Tests end-to-end
```

Tests unitarios se encuentran junto a los archivos fuente:
```
src/
├── app.service.spec.ts
├── practice/
│   ├── practice.service.spec.ts
│   └── practice.controller.spec.ts
├── topic/
│   ├── topic.service.spec.ts
│   └── topic.controller.spec.ts
├── year/
│   ├── year.service.spec.ts
│   └── year.controller.spec.ts
└── year-topic/
    ├── year-topic.service.spec.ts
    └── year-topic.controller.spec.ts
```

### Generar Reportes de Cobertura

#### HTML Report
Después de ejecutar `npm run test:cov`, abre el reporte interactivo:
```bash
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

#### Ver Resumen de Cobertura en Terminal
```bash
npm run test:cov
```

El output mostrará:
- Porcentaje de cobertura por archivo
- Líneas no cubiertas
- Ramas condicionales no cubiertas
- Funciones no probadas

#### Filtrar Tests por Patrón
```bash
npm test -- --testPathPattern=practice  # Solo tests de practice
npm test -- --testNamePattern="should"  # Tests que coincidan con el nombre
```

#### Especificar Archivo de Test
```bash
npm test -- src/app.service.spec.ts
```

### Tips para Testing

1. **Usar test:watch para desarrollo**:
   ```bash
   npm run test:watch
   ```
   Mantén esta ventana abierta mientras desarrollas para feedback inmediato.

2. **Actualizar snapshots**:
   ```bash
   npm test -- -u
   ```

3. **Ejecutar tests en paralelo** (por defecto):
   - Jest ejecuta tests en paralelo automáticamente
   - Para ejecutar secuencialmente:
   ```bash
   npm test -- --runInBand
   ```

4. **Ver verbose output**:
   ```bash
   npm test -- --verbose
   ```

5. **Generar cobertura para un archivo específico**:
   ```bash
   npm run test:cov -- --collectCoverageFrom=src/practice/practice.service.ts
   ```

### Configuración de Cobertura

En `package.json`, la sección `jest` define:
```json
{
  "jest": {
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "coverageReporters": ["text", "lcov", "json"]
  }
}
```

Puedes personalizar umbrales mínimos de cobertura agregando:
```json
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

## Tecnologías utilizadas

- **NestJS** - Framework backend
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **TypeScript** - Lenguaje de programación
- **Jest** - Testing
- **ESLint** - Linting
- **Prettier** - Código formatting

## Contacto y Soporte

Para reportar problemas o sugerencias, por favor abre un issue en el repositorio.