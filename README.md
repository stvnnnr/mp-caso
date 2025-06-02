# Sistema de Gestión de Casos – Ministerio Público
---

## Índice

1. [Descripción general](#descripción-general)  
2. [Requisitos previos](#requisitos-previos)  
3. [Cómo ejecutar la aplicación](#cómo-ejecutar-la-aplicación)  
   - [Backend](#backend)  
   - [Frontend](#frontend)  
   - [Docker Compose](#docker-compose)  
4. [Demostración funcional](#demostración-funcional)  
5. [Arquitectura de la aplicación](#arquitectura-de-la-aplicación)  
   - [Diagrama de componentes](#diagrama-de-componentes)  
   - [Flujo de datos](#flujo-de-datos)  
6. [Diseño de la base de datos](#diseño-de-la-base-de-datos)  
   - [Tablas y relaciones](#tablas-y-relaciones)  
   - [Stored Procedures](#stored-procedures)  
7. [Decisiones técnicas](#decisiones-técnicas)  
   - [Elección de tecnologías](#elección-de-tecnologías)  
   - [Estructura de carpetas](#estructura-de-carpetas)  
   - [Módulo de conexión a SQL Server](#módulo-de-conexión-a-sql-server)  
   - [Backend: Node.js + Express](#backend-nodejs--express)  
   - [Frontend: React + Axios + React Router](#frontend-react--axios--react-router)  
   - [Estilos y tema institucional](#estilos-y-tema-institucional)  
   - [Pruebas automatizadas](#pruebas-automatizadas)  
   - [Dockerización](#dockerización)  
8. [Guía de extensiones futuras](#guía-de-extensiones-futuras)  
9. [Contacto](#contacto)  

---

## Descripción general

El **Sistema de Gestión de Casos** es una aplicación web que permite:

- Registrar nuevos casos (con descripción, fiscalía y fiscal asignado, estado).  
- Listar y filtrar casos por estado.  
- Reasignar casos entre fiscales, respetando reglas de negocio (solo "PENDIENTE" y misma fiscalía).  
- Actualizar el estado de un caso.  
- Generar y visualizar un informe estadístico de la cantidad de casos por estado.  
- Obtener listados de "datos maestros" (fiscalías y fiscales) para poblar dropdowns en el frontend.

El backend es una **API REST** construida con Node.js y Express que expone endpoints para cada operación. El frontend es una aplicación **React** que consume dicha API y muestra interfaces de usuario responsivas. Ambos se han dockerizado para facilitar despliegues y pruebas.

---

## Requisitos previos

Para ejecutar localmente:

- **SQL Server** (2017 en adelante) con la base de datos **MP_CasosDB** creada y poblada con tablas y datos de ejemplo.  
- **Node.js** v18+ y **npm** (solo si no se usa Docker).  
- **Docker** y **Docker Compose** (si se desea levantar todo en contenedores).  
- **Git** (opcional, para clonar el repositorio).  
- **Postman** o herramienta similar para probar endpoints (opcional).

---

## Cómo ejecutar la aplicación

### Backend

1. Ingresa a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Crea y configura el archivo `.env` en `backend/.env`. Ejemplo:
   ```ini
   DB_USER=sa
   DB_PASSWORD=estaesunapruebadecontraseña
   DB_SERVER=STVN-PC
   DB_DATABASE=MP_CasosDB
   DB_PORT=1433
   DB_ENCRYPT=false
   DB_TRUST_CERT=true
   PORT=4000
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

5. Verifica que esté activo en http://localhost:4000/ (debería mostrar un mensaje de bienvenida).

### Frontend

1. En otra terminal, ve a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Ajusta, si es necesario, la URL de la API en `src/services/api.js`. Por defecto:
   ```js
   baseURL: 'http://localhost:4000/api'
   ```

4. Inicia la aplicación React:
   ```bash
   npm start
   ```

5. Abre tu navegador en http://localhost:3000. Deberías ver la página de inicio con el diseño institucional del MP.

### Docker Compose (alternativa)

Si prefieres levantar ambos servicios en contenedores:

1. Asegúrate de que tu SQL Server sea accesible desde Docker (por ejemplo, `DB_SERVER=host.docker.internal` en `backend/.env`).

2. En la raíz del proyecto (donde está `docker-compose.yml`), ejecuta:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

3. Accede a:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:4000/api

---

## Demostración funcional

A continuación se describe paso a paso la interacción típica con la aplicación, incluyendo capturas de pantalla para mayor claridad.

### Pantalla de Inicio

- Aparece un hero azul oscuro con el título "Sistema de Gestión de Casos" y subtítulo "Ministerio Público de Guatemala".
- Debajo, tres tarjetas informativas ("Casos", "Crear Caso", "Estadísticas") con breves descripciones.

![Pantalla de Inicio](/diagramas/images/1.png)

### Navegación principal

- Barra superior azul oscuro con texto blanco: "MINISTERIO PÚBLICO" a la izquierda.
- Enlaces a la derecha: Inicio / Casos / Crear Caso / Estadísticas.
- El enlace activo se subraya en blanco.

![Navegación Principal](/diagramas/images/2.png)

### Listado de Casos (GET /api/casos)

- Se carga automáticamente la lista completa de casos con un loader mientras la API responde.
- Tabla con columnas: ID, Descripción, Fiscal Asignado, Estado, Fecha de Creación, Fecha de Última Actualización, Acciones.
- Encabezado de tabla azul oscuro con texto blanco; filas alternas en gris claro.
- Dropdown para filtrar por estado: Todos / PENDIENTE / EN_PROCESO / RESUELTO.
- Al cambiar el filtro, se lanza `GET /api/casos?estado=...`.

![Listado de Casos](/diagramas/images/3.png)

### Crear Nuevo Caso (POST /api/casos)

- Formulario con campos:
   - Descripción (textarea)
   - Fiscalía (dropdown, `GET /api/fiscalias`)
   - Fiscal (dropdown, `GET /api/fiscales` y filtrado por fiscalía)
   - Estado (dropdown: PENDIENTE, EN_PROCESO, RESUELTO)
- Botón "Registrar Caso" azul oscuro.
- Al enviar, se valida localmente y se hace `POST /api/casos`.
- Si todo sale bien, se muestra mensaje de éxito y se redirige a la lista de casos.

![Crear Nuevo Caso](/diagramas/images/4.png)

### Reasignar Caso (PUT /api/casos/:id/reasignar)

- En la lista de casos, cada fila tiene botón "Reasignar" que va a `/cases/{id}/reassign`.
- Formulario con dropdowns de fiscalía y fiscal (cargados y filtrados).
- Al enviar, se hace `PUT /api/casos/{id}/reasignar`.
- Backend valida:
   - Caso en estado PENDIENTE.
   - Fiscalía actual coincide con nuevaFiscalia.
- Si falla, SP lanza error o guarda log en LogReasignaciones.
- Cliente muestra mensaje de error o éxito y redirige a la lista.

![Reasignar Caso](/diagramas/images/5.png)

### Actualizar Estado de Caso (PUT /api/casos/:id/estado)

- En lista de casos, botón "Actualizar Estado" que va a `/cases/{id}/update-status`.
- Formulario con dropdown de estados.
- Al enviar, se hace `PUT /api/casos/{id}/estado`.
- SP actualiza Estado y FechaActualizacion = GETDATE().
- Cliente muestra mensaje y redirige a lista.

![Actualizar Estado de Caso](/diagramas/images/6.png)

### Informe Estadístico (GET /api/casos/informes/estadisticas)

- En página "Estadísticas", se hace `GET /api/casos/informes/estadisticas`.
- SP devuelve `{ Estado, Cantidad }` agrupados por estado.
- Cliente muestra tabla con encabezado azul (Estado, Cantidad).

![Informe Estadístico](/diagramas/images/7.png)

---

## Arquitectura de la aplicación

### Diagrama de arquitectura

![Diagrama arqui](/diagramas/diagramarquitectura.png)


- El **Frontend** (React) corre en el navegador, consumiendo la API en `http://localhost:4000/api/...`.
- El **Backend** (Node.js + Express) expone endpoints REST y, a su vez, invoca Stored Procedures en SQL Server.
- La **base de datos** MP_CasosDB contiene las tablas Fiscalías, Fiscales, Casos y LogReasignaciones, más los SP necesarios.

### Flujo de datos

1. **Cliente → Servidor**: El usuario interactúa con la UI React, que llama a un método de `caseService` o `dataService` (Axios).

2. **Servidor (Express)**:
   - La ruta correspondiente procesa la petición y llama al service.
   - El service ejecuta un Stored Procedure en SQL Server usando `mssql`.

3. **SQL Server**:
   - El SP realiza la operación (SELECT, INSERT, UPDATE) o lanza RAISERROR.
   - Retorna un recordset o mensaje de error.

4. **Servidor → Cliente**:
   - El backend envía un JSON con datos o error (status 200, 201, 400, 500).
   - React actualiza el estado y renderiza tablas, formularios o mensajes según corresponda.

---

## Diseño de la base de datos

### Tablas y relaciones

#### Fiscalías
- **FiscalíaID** (INT, PK, IDENTITY)
- **NombreFiscalía** (VARCHAR(200), NOT NULL)

#### Fiscales
- **FiscalID** (INT, PK, IDENTITY)
- **Nombre** (VARCHAR(200), NOT NULL)
- **FiscalíaID** (INT, FK → Fiscalías(FiscalíaID), ON UPDATE CASCADE, ON DELETE NO ACTION)

#### Casos
- **CasoID** (INT, PK, IDENTITY)
- **Descripcion** (VARCHAR(500), NOT NULL)
- **FiscalAsignado** (INT, FK → Fiscales(FiscalID), ON UPDATE CASCADE, ON DELETE NO ACTION)
- **Estado** (VARCHAR(50), NOT NULL)
- **FechaCreacion** (DATETIME, NOT NULL, DEFAULT GETDATE())
- **FechaActualizacion** (DATETIME, NULL)

#### LogReasignaciones
- **LogID** (INT, PK, IDENTITY)
- **CasoID** (INT, FK → Casos(CasoID), ON UPDATE CASCADE, ON DELETE NO ACTION)
- **FiscalAnterior** (INT, FK → Fiscales(FiscalID), ON UPDATE NO ACTION, ON DELETE NO ACTION)
- **FiscalIntentado** (INT, FK → Fiscales(FiscalID), ON UPDATE NO ACTION, ON DELETE NO ACTION)
- **FechaIntento** (DATETIME, NOT NULL, DEFAULT GETDATE())
- **Motivo** (VARCHAR(300), NULL)


### Diagrama de entidad relacion

![Diagrama er](/diagramas/diagramaer.png)

### Stored Procedures

#### sp_registrar_caso
- **Parámetros**: `@descripcion`, `@fiscalAsignado`, `@estado`
- **Función**: Inserta en Casos con FechaCreacion = GETDATE().

#### sp_obtener_casos
- **Parámetro opcional**: `@estado`
- **Función**: Si @estado es NULL, devuelve todos los casos; si no, filtra por estado.

#### sp_asignar_caso
- **Parámetros**: `@casoId`, `@nuevoFiscal`, `@nuevaFiscalia`
- **Lógica**:
  - Recupera estado y fiscal actual del caso.
  - Recupera fiscalía del fiscal actual.
  - Si estado ≠ 'PENDIENTE', lanza RAISERROR.
  - Si fiscalía actual ≠ @nuevaFiscalia, inserta registro en LogReasignaciones y retorna.
  - Si pasa validaciones, actualiza FiscalAsignado.

#### sp_actualizar_estado
- **Parámetros**: `@casoId`, `@nuevoEstado`
- **Función**: Actualiza Estado y FechaActualizacion = GETDATE().

#### sp_generar_informe_estadistico
- **Función**: Agrupa por Estado y devuelve `{ Estado, Cantidad }`.

#### sp_obtener_fiscalias
- **Sin parámetros**: `SELECT FiscalíaID, NombreFiscalía FROM Fiscalías ORDER BY NombreFiscalía`.

#### sp_obtener_fiscales
- **Sin parámetros**: `SELECT FiscalID, Nombre, FiscalíaID FROM Fiscales ORDER BY Nombre`.

---

## Decisiones técnicas

### Elección de tecnologías

#### Node.js v18 + Express.js
- Permite crear API REST en JavaScript de forma rápida y ligera.
- La librería `mssql` facilita la conexión a SQL Server con pools.
- `dotenv` para variables de entorno.

#### SQL Server
- Requisito del Ministerio Público.
- Lógica centralizada en Stored Procedures.

#### React (Create React App)
- Framework para SPAs.
- `axios` para consumo de la API.
- `react-router-dom` para rutas.

#### Docker + Docker Compose
- Contenerización de frontend y backend.
- Facilita despliegue y pruebas aisladas.

#### Jest + Supertest
- Pruebas automatizadas de endpoints en el backend.
- `afterAll` cierra pool para evitar tests colgados.

### Estructura de carpetas

```
/(MP-CASO)/
├── backend/
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.js
│   │   │   ├── stored_procedures.sql
│   │   │   └── test.js
│   │   ├── controllers/
│   │   │   └── casos.controller.js
│   │   ├── routes/
│   │   │   └── casos.routes.js
│   │   ├── services/
│   │   │   └── casos.service.js
│   │   ├── tests/
│   │   │   └── casos.test.js
│   │   └── index.js
│   └── Dockerfile
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   ├── CaseList.js
│   │   │   ├── CaseForm.js
│   │   │   ├── ReassignForm.js
│   │   │   ├── UpdateStatusForm.js
│   │   │   ├── Stats.js
│   │   │   └── Loader.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   ├── ListCases.js
│   │   │   ├── CreateCase.js
│   │   │   ├── ReassignCase.js
│   │   │   ├── UpdateCaseStatus.js
│   │   │   └── Statistics.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── caseService.js
│   │   │   └── dataService.js
│   │   └── nginx.conf
│   └── Dockerfile
│
└── docker-compose.yml
```

### Módulo de conexión a SQL Server

En `src/db/connection.js` del backend se definieron:

- `dotenv.config({ path: '../../.env' })` para cargar variables de entorno.
- `dbConfig` toma valores de `process.env` o usa fallback.
- `getPool()` crea/reutiliza pool de conexiones con `mssql.connect(dbConfig)`.
- `closePool()` cierra el pool para evitar conexiones colgadas.

### Backend: Node.js + Express

#### src/index.js:
- Carga dotenv, configura CORS, express.json().
- Monta rutas en `/api`.
- Handler 404 para rutas no encontradas.
- Inicia servidor en `process.env.PORT` (4000).

#### casos.routes.js define rutas REST:
```
POST   /api/casos
GET    /api/casos
PUT    /api/casos/:id/reasignar
PUT    /api/casos/:id/estado
GET    /api/casos/informes/estadisticas
GET    /api/fiscalias
GET    /api/fiscales
```

- Controladores validan y llaman a servicios.
- Servicios llaman a Stored Procedures via `pool.request().execute(...)`.
- **Pruebas**: Jest + Supertest validan endpoints y cierran pool al finalizar.

### Frontend: React + Axios + React Router

- `src/index.js` envuelve `<App />` en `<BrowserRouter>`.
- `App.js` monta la Navbar y define rutas:
  ```
  /home
  /cases
  /cases/create
  /cases/:id/reassign
  /cases/:id/update-status
  /statistics
  ```
- Estilos globales en `App.css` e `index.css` usan variables CSS institucionales.

#### Navbar:
- Marca "MINISTERIO PÚBLICO" y enlaces a la derecha.
- Estilos en `Navbar.css`.

#### Componentes:
- **Home**: hero azul oscuro y tarjetas blancas interactivas.
- **CaseList**: tabla con encabezados azules y filas alternas grises.
- **Formularios**: CaseForm, ReassignForm, UpdateStatusForm.
- **Stats**: tabla de estadísticas.
- **Loader**: componente para "Cargando…".

#### Servicios:
- `api.js` (Axios con baseURL).
- `caseService.js` (métodos CRUD para casos).
- `dataService.js` (métodos para fiscalías/fiscales).

### Estilos y tema institucional

- **Tipografía**: 'Segoe UI', sans-serif.
- **Colores**:
  - Azul oscuro: `#004368`
  - Azul claro: `#006BB3`
  - Texto principal: `#212121`
  - Fondo general: `#F5F5F5`
  - Fondo contenedores: `#FFFFFF`

### Pruebas automatizadas

#### Backend:
- `npm test` corre Jest con `--detectOpenHandles --forceExit`.
- Pruebas en `src/tests/casos.test.js` y `src/tests/datos.test.js`.
- `afterAll` cierra pool para liberar recursos.

### Dockerización

#### Backend Dockerfile:
- `node:18-alpine`, instala dependencias, copia código, expone 4000, ejecuta `npm start`.
- Usa `backend/.env`.

#### Frontend Dockerfile:
- **Etapa build** con `node:18-alpine`, crea build.
- **Etapa final** con `nginx:stable-alpine`, copia build y usa `nginx.conf` para rewrite.
- Expone puerto 80.

#### docker-compose.yml:
```yaml
version: "3.8"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: mp-backend
    env_file:
      - ./backend/.env
    ports:
      - "4000:4000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: mp-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

## Guía de extensiones futuras

- Autenticación JWT
- Búsqueda y paginación en lista de casos
- Vista de detalle de caso (`GET /api/casos/:id`)
- Gráficos de tendencias (Recharts o Chart.js)
- Internacionalización (react-intl)
- CI/CD en la nube (GitHub Actions + Azure/App Engine)

---

## Contacto

- **Desarrollador**: Wilber Steven Zúñiga Ruano
- **Email**: stevenruano735@gmail.com
- **GitHub**: https://github.com/stvnnnr/mp-caso.git

---

### Nota final:

Proyecto completo:
- **Backend**: Node.js + Express + SQL Server
- **Frontend**: React + Axios + React Router
- **Docker**: Frontend + Backend
- **Estilo institucional**: Similar a mp.gob.gt
- **Pruebas**: Jest + Supertest