# API REST – Películas y Series

Proyecto de **Ingeniería Web II**. API REST hecha con **Node.js + Express + Sequelize** y base de datos **SQL Server**, para administrar las películas y series de la plataforma. Incluye un **cliente web** (React + Vite) que consume la API.

La API tiene cinco módulos: **Género, Director, Productora, Tipo y Media** (películas y series). Cada módulo permite crear, editar, consultar y eliminar.

El repositorio tiene dos partes:

- **API**: en la raíz del repositorio.
- **Cliente web**: en la carpeta `cliente-peliculas/`.

## Requisitos

- Node.js 18 o superior
- SQL Server (con SQL Server Management Studio) con el protocolo TCP/IP activo y autenticación mixta (usuario y contraseña)
- Postman (opcional, para probar la API)

## 1. Encender la API (servidor)

Desde la raíz del repositorio:

1. **Instalar dependencias**

   ```bash
   npm install
   ```
2. **Crear la base de datos**: abrir `database/script.sql` en SQL Server Management Studio y ejecutarlo completo. Crea la base `peliculas_db`, las 5 tablas y los datos iniciales (géneros: acción, aventura, ciencia ficción, drama y terror; tipos: película y serie).
3. **Configurar la conexión**: copiar `.env.example` como `.env` y poner mi usuario y contraseña de SQL Server.

   ```bash
   copy .env.example .env      # Windows
   # cp .env.example .env      # Linux / macOS
   ```
4. **Iniciar la API**

   ```bash
   npm start
   ```

   Si todo sale bien se ve:

   ```
   Conexión a SQL Server correcta
   Servidor corriendo en http://localhost:3000
   ```

   Para detenerla: `Ctrl + C`.

## 2. Encender el cliente web

En **otra terminal**, con la API ya corriendo:

```bash
cd cliente-peliculas
npm install
npm run dev
```

Abrir en el navegador: **http://localhost:5173/**

El cliente se conecta a la API en `http://localhost:3000/api` (definido en `cliente-peliculas/src/services/api.js`). Si cambia el puerto de la API, hay que actualizar esa URL.

### Resumen rápido

| Qué        | Carpeta                | Comando         | URL                   |
| ----------- | ---------------------- | --------------- | --------------------- |
| API         | raíz del repositorio  | `npm start`   | http://localhost:3000 |
| Cliente web | `cliente-peliculas/` | `npm run dev` | http://localhost:5173 |

Siempre se enciende primero la API y después el cliente.

## 3. Probar en Postman

Importar la colección **API Películas y Series** que está en `postman/collections/` y ejecutar las peticiones en orden, con la API encendida. La carpeta *Validaciones* contiene peticiones que deben devolver error.

## Estructura del proyecto

```
api-peliculas/
├── app.js                 # Arranque del servidor y rutas
├── config/                # Conexión a SQL Server y datos iniciales
├── models/                # Una tabla por archivo + relaciones (index.js)
├── controllers/           # Lógica de cada operación
├── routes/                # Rutas (URL + método HTTP)
├── database/script.sql    # Script de la base de datos
├── postman/               # Colección para probar la API
└── cliente-peliculas/     # Cliente web (React + Vite)
```

## Endpoints

Todos los módulos tienen las mismas 5 operaciones:

| Método | Ruta                  | Acción       |
| ------- | --------------------- | ------------- |
| GET     | `/api/<modulo>`     | Listar todos  |
| GET     | `/api/<modulo>/:id` | Consultar uno |
| POST    | `/api/<modulo>`     | Crear         |
| PUT     | `/api/<modulo>/:id` | Editar        |
| DELETE  | `/api/<modulo>/:id` | Eliminar      |

Módulos: `generos`, `directores`, `productoras`, `tipos` y `media`.

### Campos de cada módulo

| Módulo    | Campos que se envían                                                                                                                         | Campos automáticos                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Género    | `nombre`, `estado` (Activo/Inactivo), `descripcion`                                                                                     | `id`, `fechaCreacion`, `fechaActualizacion` |
| Director   | `nombres`, `estado`                                                                                                                       | igual                                             |
| Productora | `nombre`, `estado`, `slogan`, `descripcion`                                                                                           | igual                                             |
| Tipo       | `nombre`, `descripcion`                                                                                                                   | igual                                             |
| Media      | `serial`, `titulo`, `sinopsis`, `url`, `imagenPortada`, `anioEstreno`, `generoId`, `directorId`, `productoraId`, `tipoId` | igual                                             |

Si no se envía `estado`, queda en **Activo**.

### Ejemplo: crear una película

`POST /api/media`

```json
{
  "serial": "PEL-001",
  "titulo": "Interestelar",
  "sinopsis": "Un grupo de astronautas viaja a través de un agujero de gusano.",
  "url": "https://www.ejemplo.com/peliculas/interestelar",
  "imagenPortada": "https://www.ejemplo.com/img/interestelar.jpg",
  "anioEstreno": 2014,
  "generoId": 3,
  "directorId": 1,
  "productoraId": 1,
  "tipoId": 1
}
```

> Los valores de `generoId`, `directorId`, `productoraId` y `tipoId` deben ser ids que existan y estén activos. Para ver los reales, consultar `GET /api/generos`, `/api/directores`, `/api/productoras` y
