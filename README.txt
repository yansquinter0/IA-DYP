╔══════════════════════════════════════════════════════════════════════════════╗
║                    DYPStore — Tienda Virtual Deportiva                      ║
║                  ASP.NET Core 8 MVC + Entity Framework + SQL Server         ║
╚══════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════
 INSTRUCCIONES PARA ABRIR EN VISUAL STUDIO COMMUNITY
═══════════════════════════════════════════════════════════════════════════════

REQUISITOS PREVIOS:
  ✓ Visual Studio Community 2022 (gratuito en visualstudio.microsoft.com)
  ✓ Workload: "ASP.NET and web development" (instalar en VS Installer)
  ✓ SQL Server Express 2022 (gratuito en microsoft.com/sql-server)
    → También sirve SQL Server LocalDB (se instala con Visual Studio)

PASO 1 — ABRIR EL PROYECTO
  1. Descomprime el archivo ZIP en una carpeta (p. ej. C:\Proyectos\DYPStore)
  2. Abre Visual Studio Community 2022
  3. Click en "Open a project or solution"
  4. Navega a la carpeta DYPStore y abre el archivo: DYPStore.csproj

PASO 2 — RESTAURAR PAQUETES NUGET (automático)
  Visual Studio descargará automáticamente los paquetes NuGet al abrir.
  Si no lo hace: menú Tools → NuGet Package Manager → Manage NuGet Packages
  → Click en "Restore"

PASO 3 — CONFIGURAR LA BASE DE DATOS
  Opción A — LocalDB (más fácil, ya incluida en VS):
    → La cadena de conexión en appsettings.json ya apunta a LocalDB.
      No necesitas hacer nada adicional.

  Opción B — SQL Server Express:
    → Abre appsettings.json y cambia la cadena de conexión:
      "DefaultConnection": "Server=.\\SQLEXPRESS;Database=DYPStoreDB;
       Trusted_Connection=True;MultipleActiveResultSets=true"

PASO 4 — CREAR Y MIGRAR LA BASE DE DATOS
  Opción A — Automática (recomendada):
    → El proyecto crea la BD automáticamente al correr por primera vez.
      Simplemente presiona F5 y espera.

  Opción B — Manual con Package Manager Console:
    1. Menú: Tools → NuGet Package Manager → Package Manager Console
    2. Ejecuta: Add-Migration InitialCreate
    3. Ejecuta: Update-Database

  Opción C — Script SQL manual:
    → Ejecuta el archivo Database/DYPStore_Script.sql en SQL Server
       Management Studio (SSMS) o en Azure Data Studio.

PASO 5 — EJECUTAR EL PROYECTO
  → Presiona F5 (o el botón verde "Play" con HTTPS)
  → El navegador abrirá automáticamente la tienda

═══════════════════════════════════════════════════════════════════════════════
 CREDENCIALES DE ADMINISTRADOR (creadas automáticamente al iniciar)
═══════════════════════════════════════════════════════════════════════════════
  Email:     admin@dypstore.com
  Password:  Admin123!

  El panel de administración está en: /Admin/Dashboard

═══════════════════════════════════════════════════════════════════════════════
 ESTRUCTURA DEL PROYECTO
═══════════════════════════════════════════════════════════════════════════════
  DYPStore/
  ├── DYPStore.csproj              → Archivo del proyecto (.NET 8)
  ├── Program.cs                   → Punto de entrada y configuración DI
  ├── appsettings.json             → Cadena de conexión y configuración
  │
  ├── Models/                      → Modelos de datos
  │   ├── ApplicationUser.cs       → Usuario (extende Identity)
  │   ├── Product.cs               → Producto con categorías (enum)
  │   ├── CartItem.cs              → Ítem del carrito
  │   ├── Order.cs                 → Pedido
  │   ├── OrderItem.cs             → Ítem de pedido
  │   └── ViewModels/              → ViewModels para formularios
  │       ├── LoginViewModel.cs
  │       ├── RegisterViewModel.cs
  │       ├── ProductViewModel.cs
  │       └── CartViewModel.cs
  │
  ├── Data/                        → Capa de datos
  │   ├── ApplicationDbContext.cs  → DbContext de Entity Framework
  │   └── DbInitializer.cs        → Seed: admin + 17 productos
  │
  ├── Controllers/                 → Controladores MVC
  │   ├── HomeController.cs        → Página principal
  │   ├── ProductsController.cs    → Catálogo con filtros
  │   ├── CartController.cs        → Carrito de compras
  │   ├── OrdersController.cs      → Historial de pedidos
  │   └── AccountController.cs    → Login / Registro
  │
  ├── Areas/Admin/                 → Área de administración
  │   └── Controllers/
  │       └── DashboardController.cs → CRUD productos, usuarios, pedidos
  │
  ├── Views/                       → Vistas Razor (HTML + C#)
  │   ├── Shared/_Layout.cshtml    → Layout principal con navbar/footer
  │   ├── Home/Index.cshtml        → Hero + categorías + productos destacados
  │   ├── Products/Index.cshtml    → Catálogo con filtros responsive
  │   ├── Products/Details.cshtml  → Detalle de producto con selector qty
  │   ├── Cart/Index.cshtml        → Carrito con resumen y checkout
  │   ├── Orders/Index.cshtml      → Historial de pedidos del usuario
  │   └── Account/                 → Login y Registro
  │
  ├── Areas/Admin/Views/           → Vistas del panel admin
  │   ├── Shared/_AdminLayout.cshtml → Layout con sidebar de navegación
  │   └── Dashboard/               → Index, Products, Users, Orders + forms
  │
  ├── wwwroot/                     → Archivos estáticos
  │   ├── css/site.css             → Estilos dark theme deportivo
  │   └── js/site.js               → JavaScript básico
  │
  └── Database/
      └── DYPStore_Script.sql      → Script SQL completo (alternativa a EF)

═══════════════════════════════════════════════════════════════════════════════
 FUNCIONALIDADES INCLUIDAS
═══════════════════════════════════════════════════════════════════════════════
  ✓ Registro de usuarios con validaciones completas
  ✓ Login con "Recordarme" y redirección por rol
  ✓ Roles: Admin y Usuario (ASP.NET Identity)
  ✓ Catálogo de 17 productos en 3 categorías
  ✓ Búsqueda y filtros por categoría
  ✓ Detalle de producto con selector de cantidad
  ✓ Carrito de compras (agregar, modificar, eliminar)
  ✓ Creación de pedidos (checkout)
  ✓ Historial de pedidos del usuario
  ✓ Panel Admin: CRUD completo de productos
  ✓ Panel Admin: gestión de usuarios y roles
  ✓ Panel Admin: gestión de pedidos con cambio de estado
  ✓ Diseño dark theme deportivo 100% responsive
  ✓ Bootstrap 5 + Bootstrap Icons

