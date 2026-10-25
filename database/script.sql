/* =====================================================
   Base de datos: peliculas_db  (SQL Server)
   Ejecutar completo en SQL Server Management Studio
   ===================================================== */

IF DB_ID('peliculas_db') IS NULL
    CREATE DATABASE peliculas_db;
GO

USE peliculas_db;
GO

/* ---------- Modulo Genero ---------- */
IF OBJECT_ID('dbo.generos', 'U') IS NULL
CREATE TABLE dbo.generos (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    nombre              NVARCHAR(100) NOT NULL UNIQUE,
    estado              NVARCHAR(10)  NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    descripcion         NVARCHAR(500) NULL,
    fechaCreacion       DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    fechaActualizacion  DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

/* ---------- Modulo Director ---------- */
IF OBJECT_ID('dbo.directores', 'U') IS NULL
CREATE TABLE dbo.directores (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    nombres             NVARCHAR(150) NOT NULL,
    estado              NVARCHAR(10)  NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    fechaCreacion       DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    fechaActualizacion  DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

/* ---------- Modulo Productora ---------- */
IF OBJECT_ID('dbo.productoras', 'U') IS NULL
CREATE TABLE dbo.productoras (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    nombre              NVARCHAR(100) NOT NULL UNIQUE,
    estado              NVARCHAR(10)  NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    slogan              NVARCHAR(200) NULL,
    descripcion         NVARCHAR(500) NULL,
    fechaCreacion       DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    fechaActualizacion  DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

/* ---------- Modulo Tipo ---------- */
IF OBJECT_ID('dbo.tipos', 'U') IS NULL
CREATE TABLE dbo.tipos (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    nombre              NVARCHAR(100) NOT NULL UNIQUE,
    descripcion         NVARCHAR(500) NULL,
    fechaCreacion       DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    fechaActualizacion  DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

/* ---------- Modulo Media (peliculas y series) ---------- */
IF OBJECT_ID('dbo.media', 'U') IS NULL
CREATE TABLE dbo.media (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    serial              NVARCHAR(50)  NOT NULL UNIQUE,
    titulo              NVARCHAR(200) NOT NULL,
    sinopsis            NVARCHAR(MAX) NULL,
    url                 NVARCHAR(400) NOT NULL UNIQUE,
    imagenPortada       NVARCHAR(400) NULL,
    anioEstreno         INT NULL,
    generoId            INT NOT NULL REFERENCES dbo.generos(id),
    directorId          INT NOT NULL REFERENCES dbo.directores(id),
    productoraId        INT NOT NULL REFERENCES dbo.productoras(id),
    tipoId              INT NOT NULL REFERENCES dbo.tipos(id),
    fechaCreacion       DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    fechaActualizacion  DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

/* ---------- Datos iniciales pedidos en el enunciado ---------- */
IF NOT EXISTS (SELECT 1 FROM dbo.generos)
BEGIN
    INSERT INTO dbo.generos (nombre) VALUES (N'Acción');
    INSERT INTO dbo.generos (nombre) VALUES (N'Aventura');
    INSERT INTO dbo.generos (nombre) VALUES (N'Ciencia ficción');
    INSERT INTO dbo.generos (nombre) VALUES (N'Drama');
    INSERT INTO dbo.generos (nombre) VALUES (N'Terror');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.tipos)
BEGIN
    INSERT INTO dbo.tipos (nombre) VALUES (N'Película');
    INSERT INTO dbo.tipos (nombre) VALUES (N'Serie');
END
GO
