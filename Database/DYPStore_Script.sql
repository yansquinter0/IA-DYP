-- ═══════════════════════════════════════════════════════════════════════════
--  DYPStore — Script SQL completo para SQL Server
--  Ejecuta este script en SQL Server Management Studio (SSMS)
--  O bien deja que Entity Framework lo cree automáticamente al correr
--  el proyecto por primera vez (ver instrucciones en README.txt)
-- ═══════════════════════════════════════════════════════════════════════════

USE master;
GO

IF DB_ID('DYPStoreDB') IS NOT NULL
    DROP DATABASE DYPStoreDB;
GO

CREATE DATABASE DYPStoreDB;
GO

USE DYPStoreDB;
GO

-- Tablas de Identity (ASP.NET Core Identity)
CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL PRIMARY KEY,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL
);

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL PRIMARY KEY,
    [FullName] nvarchar(max) NOT NULL DEFAULT '',
    [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL DEFAULT 0,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL DEFAULT 0,
    [TwoFactorEnabled] bit NOT NULL DEFAULT 0,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL DEFAULT 0,
    [AccessFailedCount] int NOT NULL DEFAULT 0
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    PRIMARY KEY ([UserId], [RoleId]),
    FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles]([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY PRIMARY KEY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers]([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    PRIMARY KEY ([LoginProvider], [ProviderKey]),
    FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers]([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers]([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY PRIMARY KEY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles]([Id]) ON DELETE CASCADE
);

-- Tabla Productos
CREATE TABLE [Products] (
    [Id] int NOT NULL IDENTITY PRIMARY KEY,
    [Name] nvarchar(200) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Brand] nvarchar(100) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [Stock] int NOT NULL DEFAULT 0,
    [Category] nvarchar(50) NOT NULL,
    [ImageUrl] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE()
);

-- Tabla Carrito
CREATE TABLE [CartItems] (
    [Id] int NOT NULL IDENTITY PRIMARY KEY,
    [UserId] nvarchar(450) NOT NULL,
    [ProductId] int NOT NULL,
    [Quantity] int NOT NULL DEFAULT 1,
    [AddedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([ProductId]) REFERENCES [Products]([Id]) ON DELETE CASCADE
);

-- Tabla Pedidos
CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY PRIMARY KEY,
    [UserId] nvarchar(450) NOT NULL,
    [Total] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL DEFAULT 'pending',
    [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers]([Id])
);

-- Tabla Ítems de Pedido
CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY PRIMARY KEY,
    [OrderId] int NOT NULL,
    [ProductId] int NOT NULL,
    [ProductName] nvarchar(max) NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [Quantity] int NOT NULL,
    FOREIGN KEY ([OrderId]) REFERENCES [Orders]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([ProductId]) REFERENCES [Products]([Id])
);

-- ═══════════════════════════════════════════════════════════════════════════
-- NOTA: Los datos iniciales (admin + 17 productos) se insertan
--       automáticamente al correr el proyecto por primera vez via
--       DbInitializer.cs. NO es necesario insertar datos manualmente.
-- ═══════════════════════════════════════════════════════════════════════════
SELECT 'DYPStoreDB creada exitosamente.' AS Resultado;
GO
