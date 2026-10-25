# Guion de video (5 minutos) – API REST de Películas y Series

**Antes de grabar:** SQL Server abierto con `script.sql` ya ejecutado, la API corriendo con `npm start`, la colección de Postman importada, y el repositorio listo en GitHub.

---

## 1. Saludo e introducción (0:00 – 0:30)
**En pantalla:** tu cara o VS Code con el proyecto abierto.

> "Hola, soy [nombre], estudiante de Ingeniería Web II. Les presento mi API REST para la Institución Universitaria Digital de Antioquia, que sirve para administrar películas y series, como una plataforma tipo Cuevana pero con licencias legales. La hice con Node.js, Express y SQL Server."

## 2. Qué pide el caso (0:30 – 1:00)
**En pantalla:** la rúbrica y el enunciado.

> "El caso pide cinco módulos: Género, Director, Productora, Tipo y Media. La rúbrica pide que la API cree y actualice los cinco. Yo además agregué consultar y eliminar."

## 3. Base de datos (1:00 – 1:50)
**En pantalla:** SQL Server Management Studio, las 5 tablas dentro de `peliculas_db`.

> "Diseñé la base de datos en SQL Server con cinco tablas: generos, directores, productoras, tipos y media. Género, director y productora tienen estado, activo o inactivo, y las fechas de creación y actualización. La tabla media es la principal: tiene serial y URL únicos, y cuatro llaves foráneas que la conectan con género, director, productora y tipo."

**Señala con el mouse:** el campo `estado`, los campos únicos y las llaves foráneas de `media`.

## 4. Estructura del código (1:50 – 2:40)
**En pantalla:** el explorador de archivos de VS Code.

> "En `config` está la conexión a SQL Server. En `models` está cada tabla. En `controllers` está la lógica y en `routes` las direcciones que se llaman desde Postman. Todo arranca en `app.js`."

**Muestra rápido (10–15 segundos cada uno):**
1. `config/db.js` → la conexión.
2. `models/Genero.js` → un modelo de ejemplo.
3. `routes/generos.js` → GET, POST, PUT y DELETE.
4. `controllers/crudController.js` → "este archivo hace las 5 operaciones y lo reutilizan género, director, productora y tipo".

## 5. Validaciones importantes (2:40 – 3:10)
**En pantalla:** `controllers/mediaController.js`, función `validarRelaciones`.

> "El caso dice que solo se pueden elegir géneros, directores y productoras activos. Antes de guardar una película, el código revisa que existan y que estén activos. Si no, responde con error. También revisa que el serial y la URL no estén repetidos."

## 6. Demostración en Postman (3:10 – 4:30)
**En pantalla:** Postman con la colección importada, ejecutando en este orden.

| # | Petición (carpeta de la colección) | Qué decir |
|---|---|---|
| 1 | `GET /api/generos` | "Ya están los 5 géneros iniciales." |
| 2 | `POST /api/generos` (Comedia) | "Creo un género nuevo." |
| 3 | `POST /api/generos` (Western inactivo) | "Y uno inactivo para probar la regla." |
| 4 | `PUT /api/generos/1` | "Edito la descripción y cambia la fecha de actualización." |
| 5 | `POST /api/directores` | "Creo el director." |
| 6 | `POST /api/productoras` | "Creo la productora." |
| 7 | `GET /api/tipos` | "Película y Serie ya existen." |
| 8 | `POST /api/media` | "Creo una película con todos esos datos." |
| 9 | `GET /api/media` | "Aparece con género, director, productora y tipo." |
| 10 | `PUT /api/media/1` | "Edito el título." |
| 11 | `POST /api/media` con género inactivo | "La API lo rechaza, como pide el caso." |
| 12 | `DELETE /api/media/1` | "Elimino el registro." |

**Si el tiempo aprieta:** di que director, productora y tipo funcionan igual que género y pasa directo a la película.

## 7. Código en GitHub (4:30 – 4:50)
**En pantalla:** el repositorio en GitHub.

> "Todo el código está en GitHub, con un README que explica cómo instalarlo y el script SQL de la base de datos."

## 8. Cierre (4:50 – 5:00)
> "Con esto cumplí la rúbrica: una API que crea y actualiza género, director, productora, tipo y media. Gracias por su atención."

---

## Para volver a grabar
Si grabas dos veces, borra primero los datos o recrea la base de datos, porque los ids de la colección (Comedia = 6, Western = 7) suponen una base recién creada.
