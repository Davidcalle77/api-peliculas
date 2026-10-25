# API REST – Películas y Series

Proyecto de **Ingeniería Web II**. API REST hecha con **Node.js + Express + Sequelize** y base de datos **SQL Server**, para administrar las películas y series de la plataforma de la Institución Universitaria Digital de Antioquia.

La API tiene cinco módulos: **Género, Director, Productora, Tipo y Media** (películas y series). Cada módulo permite crear, editar, consultar y eliminar.

## Requisitos
- Node.js 18 o superior
- SQL Server (con SQL Server Management Studio) con el protocolo TCP/IP activo y autenticación mixta (usuario y contraseña)
- Postman

## Instalación paso a paso

1. **Instalar dependencias**
   ```bash
   npm install
   ```
2. **Crear la base de datos**: abrir `database/script.sql` en SQL Server Management Studio y ejecutarlo completo. Crea la base `peliculas_db`, las 5 tablas y los datos iniciales (géneros: acción, aventura, ciencia ficción, drama y terror; tipos: película y serie).
3. **Configurar la conexión**: copiar `.env.example` como `.env` y poner tu usuario y contraseña de SQL Server.
4. **Iniciar la API**
   ```bash
   npm start
   ```
   Si todo sale bien se ve: `Conexión a SQL Server correcta` y `Servidor corriendo en http://localhost:3000`.
5. **Probar en Postman**: importar `postman/API-Peliculas.postman_collection.json` y ejecutar las peticiones en orden.

## Estructura del proyecto
```
api-peliculas/
├── app.js                 # Arranque del servidor y rutas
├── config/                # Conexión a SQL Server y datos iniciales
├── models/                # Una tabla por archivo + relaciones (index.js)
├── controllers/           # Lógica de cada operación
├── routes/                # Rutas (URL + método HTTP)
├── database/script.sql    # Script de la base de datos
└── postman/               # Colección para probar la API
```

## Endpoints

Todos los módulos tienen las mismas 5 operaciones:

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/<modulo>` | Listar todos |
| GET | `/api/<modulo>/:id` | Consultar uno |
| POST | `/api/<modulo>` | Crear |
| PUT | `/api/<modulo>/:id` | Editar |
| DELETE | `/api/<modulo>/:id` | Eliminar |

Módulos: `generos`, `directores`, `productoras`, `tipos` y `media`.

### Campos de cada módulo

| Módulo | Campos que se envían | Campos automáticos |
|---|---|---|
| Género | `nombre`, `estado` (Activo/Inactivo), `descripcion` | `id`, `fechaCreacion`, `fechaActualizacion` |
| Director | `nombres`, `estado` | igual |
| Productora | `nombre`, `estado`, `slogan`, `descripcion` | igual |
| Tipo | `nombre`, `descripcion` | igual |
| Media | `serial`, `titulo`, `sinopsis`, `url`, `imagenPortada`, `anioEstreno`, `generoId`, `directorId`, `productoraId`, `tipoId` | igual |

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

## Reglas del caso de estudio que cumple la API
- Una producción tiene **un solo** género, director, productora y tipo.
- Al crear o editar una media solo se aceptan **géneros, directores y productoras activos**; si alguno está inactivo o no existe, la API responde error 400.
- El **serial** y la **URL** no se pueden repetir.
- No se puede eliminar un género, director, productora o tipo que ya esté usado por una media (error 409).
- Las fechas de creación y actualización las maneja la API automáticamente.

## Subir el proyecto a GitHub
```bash
git init
git add .
git commit -m "API REST de películas y series"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/api-peliculas.git
git push -u origin main
```
El archivo `.env` (con tu contraseña) **no se sube** porque está en `.gitignore`.

## Posibles problemas
- **No conecta a SQL Server:** revisar en *SQL Server Configuration Manager* que TCP/IP esté habilitado y que el servicio esté corriendo. Si usas SQL Express con instancia con nombre, descomenta `DB_INSTANCE=SQLEXPRESS` en el `.env`.
- **Login failed for user:** verificar usuario y contraseña del `.env` y que el servidor acepte autenticación mixta.
