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