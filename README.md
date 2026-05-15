# DYPStore - Documentación Completa del Proyecto

## 📋 Resumen Ejecutivo

DYPStore es una aplicación web de e-commerce completa construida con ASP.NET Core MVC, diseñada para la venta de productos deportivos. Incluye funcionalidades avanzadas como autenticación facial, chatbot de IA, panel de administración completo, sistema de carrito de compras, gestión de pedidos y PWA (Progressive Web App).

**Tecnologías principales:**
- **Backend:** ASP.NET Core 8.0, C#
- **Base de datos:** PostgreSQL (con failover a Supabase/Neon)
- **Frontend:** Razor Views, Bootstrap, JavaScript
- **Autenticación:** ASP.NET Identity con Face ID personalizado
- **IA:** Chatbot integrado con OpenAI API
- **PWA:** Service Worker, Manifest, Iconos

---

## 📂 Ubicación de Archivos Clave

Para facilitar la navegación y demostración del código, aquí están las ubicaciones exactas de los archivos más importantes:

### Configuración Principal
- **Program.cs**: `DYPStore/Program.cs` - Punto de entrada y configuración de servicios
- **appsettings.json**: `DYPStore/appsettings.json` - Configuraciones de BD, email, etc.
- **appsettings.Development.json**: `DYPStore/appsettings.Development.json` - Configuraciones de desarrollo

### Base de Datos y Modelos
- **ApplicationDbContext**: `DYPStore/Data/ApplicationDbContext.cs` - Contexto EF Core
- **DbInitializer**: `DYPStore/Data/DbInitializer.cs` - Inicialización de BD y datos semilla
- **Modelos**: `DYPStore/Models/` (todos los .cs files)
  - ApplicationUser: `DYPStore/Models/ApplicationUser.cs`
  - Product: `DYPStore/Models/Product.cs`
  - CartItem: `DYPStore/Models/CartItem.cs`
  - Order/OrderItem: `DYPStore/Models/Order.cs` y `OrderItem.cs`
  - ChatLog: `DYPStore/Models/ChatLog.cs`
  - FaceEnrollment: `DYPStore/Models/FaceEnrollment.cs`

### Controladores
- **HomeController**: `DYPStore/Controllers/HomeController.cs`
- **ProductsController**: `DYPStore/Controllers/ProductsController.cs`
- **CartController**: `DYPStore/Controllers/CartController.cs`
- **OrdersController**: `DYPStore/Controllers/OrdersController.cs`
- **AccountController**: `DYPStore/Controllers/AccountController.cs`
- **FaceIdController**: `DYPStore/Controllers/FaceIdController.cs`
- **ChatbotController**: `DYPStore/Controllers/ChatbotController.cs`
- **DashboardController (Admin)**: `DYPStore/Areas/Admin/Controllers/DashboardController.cs`

### Servicios
- **ChatbotService**: `DYPStore/services/ChatbotService.cs`
- **EmailSender**: `DYPStore/services/EmailSender.cs`
- **IEmailSender**: `DYPStore/services/IEmailSender.cs`
- **DatabaseSteward**: `DYPStore/services/DatabaseSteward.cs`

### Vistas
- **Layout Principal**: `DYPStore/Views/Shared/_Layout.cshtml`
- **Home/Index**: `DYPStore/Views/Home/Index.cshtml`
- **Account/**: `DYPStore/Views/Account/` (Login.cshtml, Register.cshtml, FaceLogin.cshtml, FaceEnroll.cshtml, etc.)
- **Products/**: `DYPStore/Views/Products/Index.cshtml`, `Details.cshtml`
- **Cart/Index**: `DYPStore/Views/Cart/Index.cshtml`
- **Orders/Index**: `DYPStore/Views/Orders/Index.cshtml`
- **Admin/**: `DYPStore/Views/Admin/` (Dashboard, Products, etc.)
- **Shared/**: `DYPStore/Views/Shared/_Layout.cshtml`, `_ValidationScriptsPartial.cshtml`, `Error.cshtml`

### Archivos Estáticos
- **CSS**: `DYPStore/wwwroot/css/site.css`
- **JavaScript**: `DYPStore/wwwroot/js/site.js`
- **PWA Manifest**: `DYPStore/wwwroot/manifest.json`
- **Service Worker**: `DYPStore/wwwroot/sw.js`
- **Iconos PWA**: `DYPStore/wwwroot/icons/` (icon-192.png, icon-512.png)

### Migraciones
- **Carpeta Migraciones**: `DYPStore/Migrations/` (todos los archivos .cs)
- **Script SQL**: `DYPStore/Database/DYPStore_Script.sql`

### Otros
- **Proyecto (.csproj)**: `DYPStore/DYPStore.csproj`
- **Error Log**: `DYPStore/error_log.txt`
- **Instrucciones UX**: `DYPStore/INSTRUCCIONES_UX.txt`
- **README**: `DYPStore/README.md` (este archivo)

---

## 🏗️ Arquitectura del Proyecto

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
DYPStore/
├── Areas/                          # Áreas MVC (Admin)
│   └── Admin/
│       ├── Controllers/            # Controladores de admin
│       └── Views/                  # Vistas de admin
├── Controllers/                    # Controladores principales
├── Data/                           # Contexto de BD y inicialización
├── Migrations/                     # Migraciones EF Core
├── Models/                         # Modelos de datos
├── Views/                          # Vistas Razor
├── wwwroot/                        # Archivos estáticos
│   ├── css/                        # Estilos CSS
│   ├── js/                         # JavaScript del cliente
│   ├── icons/                      # Iconos PWA
│   └── manifest.json               # Manifiesto PWA
├── services/                       # Servicios de negocio
└── appsettings.json                # Configuraciones
```

---

## ⚙️ Configuración y Setup

### 1. Configuración de Base de Datos

**Archivos involucrados:**
- **appsettings.json**: `DYPStore/appsettings.json` - Cadenas de conexión
- **DatabaseSteward.cs**: `DYPStore/services/DatabaseSteward.cs` - Lógica de failover

**Archivo:** `appsettings.json`

```json
{
  "ConnectionStrings": {
    "PrimarySupabase": "Host=...;Database=postgres;Username=...;Password=...",
    "SecondaryNeon": "CADENA_DE_BACKUP"
  },
  "Logging": { ... },
  "AppSettings": {
    "AdminEmail": "admin@dypstore.com",
    "AdminPassword": "Admin123!",
    "AdminName": "Administrador DYPStore"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "dypstore677@gmail.com",
    "SenderPassword": "PASSWORD_APP"
  }
}
```

**Servicio DatabaseSteward** (`services/DatabaseSteward.cs`):
- Gestiona failover automático entre Supabase (primario) y Neon (secundario)
- Timeout de 2.5s para detectar fallos
- Valida cadenas de conexión antes de usarlas

### 2. Inicialización de la Aplicación

**Archivo:** `Program.cs` (`DYPStore/Program.cs`)

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Base de datos con failover
builder.Services.AddSingleton<DatabaseSteward>();
builder.Services.AddDbContext<ApplicationDbContext>((sp, options) => {
    var steward = sp.GetRequiredService<DatabaseSteward>();
    options.UseNpgsql(steward.GetConnectionString());
});

// 2. Identity con configuración relajada
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    // ... más configuraciones
});

// 3. Servicios personalizados
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddScoped<ChatbotService>();

// 4. MVC y middleware
builder.Services.AddControllersWithViews();
builder.Services.AddSession();

// Inicialización de BD y roles
using (var scope = app.Services.CreateScope()) {
    await DbInitializer.InitializeAsync(scope.ServiceProvider);
}
```

### 3. Inicialización de Base de Datos

**Archivo:** `Data/DbInitializer.cs` (`DYPStore/Data/DbInitializer.cs`)

- Crea roles: "Admin", "User"
- Crea usuario admin por defecto
- Inserta productos de ejemplo
- Ejecuta migraciones automáticamente

---

## 🗄️ Modelo de Datos

### Contexto Principal

**Archivo:** `Data/ApplicationDbContext.cs`

```csharp
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Product> Products { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<ChatLog> ChatLogs { get; set; }
    public DbSet<FaceEnrollment> FaceEnrollments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Configuraciones de relaciones y índices
    }
}
```

### Modelos Principales

#### ApplicationUser (`Models/ApplicationUser.cs`)
**Ubicación:** `DYPStore/Models/ApplicationUser.cs`
- Extiende `IdentityUser`
- Campo adicional: `FullName`

#### Product (`Models/Product.cs`)
**Ubicación:** `DYPStore/Models/Product.cs`
```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Brand { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public ProductCategory Category { get; set; } // Enum: boxing, shoes, supplements
    public string Description { get; set; }
    public string ImageUrl { get; set; }
}
```

#### CartItem (`Models/CartItem.cs`)
**Ubicación:** `DYPStore/Models/CartItem.cs`
- Relación uno-a-muchos con User
- Cantidad y referencia a Product

#### Order & OrderItem (`Models/Order.cs`, `Models/OrderItem.cs`)
**Ubicaciones:** 
- `DYPStore/Models/Order.cs`
- `DYPStore/Models/OrderItem.cs`
- Estados de orden: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`
- OrderItem vincula productos con cantidades específicas

#### ChatLog (`Models/ChatLog.cs`)
**Ubicación:** `DYPStore/Models/ChatLog.cs`
- Registra conversaciones del chatbot
- Vinculado opcionalmente a usuario

#### FaceEnrollment (`Models/FaceEnrollment.cs`)
**Ubicación:** `DYPStore/Models/FaceEnrollment.cs`
```csharp
public class FaceEnrollment
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public string DescriptorJson { get; set; } // Vector facial de 128 floats
    public int FrameCount { get; set; } // Calidad del registro
    public string? UserAgent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ApplicationUser? User { get; set; }
}
```

---

## 🎮 Controladores y Lógica de Negocio

### Controladores Principales

#### HomeController (`Controllers/HomeController.cs`)
**Ubicación:** `DYPStore/Controllers/HomeController.cs`
- Página de inicio con productos destacados
- Manejo de errores y acceso denegado

#### ProductsController (`Controllers/ProductsController.cs`)
**Ubicación:** `DYPStore/Controllers/ProductsController.cs`
- Lista productos con filtros por categoría
- Vista de detalle de producto
- Integración con carrito

#### CartController (`Controllers/CartController.cs`)
**Ubicación:** `DYPStore/Controllers/CartController.cs`
- Gestión del carrito de compras
- Agregar/quitar productos
- Checkout básico

#### OrdersController (`Controllers/OrdersController.cs`)
**Ubicación:** `DYPStore/Controllers/OrdersController.cs`
- Historial de pedidos del usuario
- Detalles de orden específica

#### AccountController (`Controllers/AccountController.cs`)
**Ubicación:** `DYPStore/Controllers/AccountController.cs`
- Login/logout/register estándar
- Reset password con email
- Integración con Face ID

#### FaceIdController (`Controllers/FaceIdController.cs`)
**Ubicación:** `DYPStore/Controllers/FaceIdController.cs`
- **GET /Account/FaceLogin**: Página de login facial
- **GET /Account/FaceEnroll**: Página de registro facial (requiere auth)
- **POST /api/faceid/enroll**: Registra descriptor facial
- **POST /api/faceid/verify**: Verifica rostro y autentica
- **DELETE /api/faceid/unenroll**: Elimina registro facial
- **GET /api/faceid/status**: Estado del registro facial

#### ChatbotController (`Controllers/ChatbotController.cs`)
**Ubicación:** `DYPStore/Controllers/ChatbotController.cs`
- **POST /api/chatbot/ask**: Procesa preguntas del usuario
- Integra con OpenAI API
- Registra conversaciones en ChatLog

### Área de Administración

**Archivo:** `Areas/Admin/Controllers/DashboardController.cs` (`DYPStore/Areas/Admin/Controllers/DashboardController.cs`)

- **Index**: Dashboard con estadísticas
- **Products**: CRUD completo de productos
- **Orders**: Gestión de pedidos
- **Users**: Gestión de usuarios
- **ChatLogs**: Historial de conversaciones del chatbot

---

## 🎨 Vistas y Frontend

### Layout Principal

**Archivo:** `Views/Shared/_Layout.cshtml` (`DYPStore/Views/Shared/_Layout.cshtml`)

- Bootstrap 5 para responsive design
- Navegación con autenticación
- Carrito en header
- PWA-ready

### Vistas de Cuenta

**Ubicaciones:**
- **Login/Register**: `DYPStore/Views/Account/` (Login.cshtml, Register.cshtml, etc.)
- **FaceLogin**: `DYPStore/Views/Account/FaceLogin.cshtml` - Interfaz para reconocimiento facial
- **FaceEnroll**: `DYPStore/Views/Account/FaceEnroll.cshtml` - Registro de biometría con webcam
- **ForgotPassword**: `DYPStore/Views/Account/ForgotPassword.cshtml`
- **ResetPassword**: `DYPStore/Views/Account/ResetPassword.cshtml`

### Vistas de Producto

**Ubicaciones:**
- **Index**: `DYPStore/Views/Products/Index.cshtml` - Grid de productos con filtros
- **Details**: `DYPStore/Views/Products/Details.cshtml` - Información detallada + agregar al carrito

### Vistas de Carrito y Pedidos

**Ubicaciones:**
- **Cart/Index**: `DYPStore/Views/Cart/Index.cshtml` - Gestión del carrito
- **Orders/Index**: `DYPStore/Views/Orders/Index.cshtml` - Historial de pedidos

### Área Admin

**Ubicaciones:** `DYPStore/Views/Admin/` 
- Dashboard: `Index.cshtml`
- Products: `Products/Index.cshtml`, `Products/Create.cshtml`, etc.
- Orders: `Orders/Index.cshtml`
- Users: `Users/Index.cshtml`
- ChatLogs: `ChatLogs/Index.cshtml`

### Vistas Compartidas

**Ubicaciones:** `DYPStore/Views/Shared/`
- `_Layout.cshtml` - Layout principal
- `_ValidationScriptsPartial.cshtml` - Scripts de validación
- `Error.cshtml` - Página de errores
- `_ViewImports.cshtml` - Imports de Razor
- `_ViewStart.cshtml` - Configuración de vistas

---

## 🤖 Servicios de IA y Utilidades

### ChatbotService (`services/ChatbotService.cs`)

**Ubicación:** `DYPStore/services/ChatbotService.cs`

```csharp
public class ChatbotService
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _um;
    private readonly ILogger<ChatbotService> _logger;

    public async Task<string> AskQuestion(string question, string? userId = null)
    {
        // Llama a OpenAI API
        // Registra en ChatLog
        // Retorna respuesta
    }
}
```

- Integra con OpenAI GPT para respuestas inteligentes
- Contexto de productos disponibles
- Logging de conversaciones

### EmailSender (`services/EmailSender.cs`)

**Ubicación:** `DYPStore/services/EmailSender.cs`

- Implementa `IEmailSender` de ASP.NET Identity
- Envía emails de reset password
- Configurado con Gmail SMTP

### IEmailSender Interface

**Ubicación:** `DYPStore/services/IEmailSender.cs`

### DatabaseSteward (`services/DatabaseSteward.cs`)

**Ubicación:** `DYPStore/services/DatabaseSteward.cs`

- Gestiona failover automático entre Supabase (primario) y Neon (secundario)
- Timeout de 2.5s para detectar fallos
- Valida cadenas de conexión antes de usarlas

---

## 🔒 Sistema de Autenticación Facial

### Arquitectura

1. **Registro (Enroll)**:
   - Cliente captura múltiples frames con face-api.js
   - Calcula descriptor promedio (128 floats)
   - Envía a `/api/faceid/enroll`

2. **Verificación (Verify)**:
   - Captura frame único
   - Calcula distancia euclidiana con descriptor almacenado
   - Threshold: 0.42 (balanceado)

3. **Seguridad**:
   - Un registro por usuario (índice único)
   - Vinculado a UserId con CASCADE delete
   - UserAgent para auditoría

### Componentes del Sistema Face ID

#### Backend - FaceIdController
**Ubicación:** `DYPStore/Controllers/FaceIdController.cs`
- Endpoints API para enroll, verify, status, unenroll
- Lógica de distancia euclidiana
- Integración con UserManager y ApplicationDbContext

#### Modelo de Datos - FaceEnrollment
**Ubicación:** `DYPStore/Models/FaceEnrollment.cs`
- Almacena descriptor facial (JSON de 128 floats)
- Vinculado a ApplicationUser
- Campos de auditoría (CreatedAt, UpdatedAt, UserAgent)

#### Frontend - Vistas
**Ubicaciones:**
- **FaceLogin**: `DYPStore/Views/Account/FaceLogin.cshtml` - Página de login facial
- **FaceEnroll**: `DYPStore/Views/Account/FaceEnroll.cshtml` - Página de registro facial

#### JavaScript Cliente
**Ubicación:** `DYPStore/wwwroot/js/site.js`
- Inicializa face-api.js con modelos TinyFaceDetector + FaceRecognitionNet
- Webcam access con getUserMedia
- Canvas rendering para preview
- API calls con fetch

### Flujo de Autenticación Facial

1. **Registro**:
   - Usuario accede a `/Account/FaceEnroll` (requiere login)
   - JavaScript captura 10+ frames con webcam
   - Calcula descriptor promedio
   - POST a `/api/faceid/enroll` → Guarda en FaceEnrollments

2. **Login**:
   - Usuario accede a `/Account/FaceLogin`
   - Captura un frame
   - POST a `/api/faceid/verify` → Compara con BD
   - Si distancia < 0.42 → Autentica usuario

---

## 📱 Progressive Web App (PWA)

### Archivos PWA

**Ubicaciones:**
- **Manifest**: `DYPStore/wwwroot/manifest.json` - Metadatos de la app
- **Service Worker**: `DYPStore/wwwroot/sw.js` - Funcionalidad offline
- **Iconos**: `DYPStore/wwwroot/icons/` 
  - `icon-192.png` (192x192)
  - `icon-512.png` (512x512)

### Características

- Installable desde navegador
- Funciona offline (productos en cache)
- Notificaciones push (preparado)
- Splash screen personalizado

---

## 🗃️ Migraciones de Base de Datos

### Ubicación de Migraciones

**Carpeta:** `DYPStore/Migrations/`

### Migraciones Principales

1. **InitialPostgres**: `20260319055554_InitialPostgres.cs` - Esquema base con Identity
2. **ActualizacionModelosCuentas**: `20260320073232_ActualizacionModelosCuentas.cs` - Ajustes en modelos de usuario
3. **UpdateAuthModels**: `20260320073958_UpdateAuthModels.cs` - Más ajustes de autenticación
4. **FixContext**: `20260320075158_FixContext.cs` - Correcciones en contexto
5. **AddChatLog**: `20260514000000_AddChatLog.cs` - Tabla para historial de chat
6. **AddFaceEnrollment**: `20260514000001_AddFaceEnrollment.cs` - Tabla para biometría facial

### Script SQL

**Ubicación:** `DYPStore/Database/DYPStore_Script.sql`

### Comando de Migración

```bash
dotnet ef migrations add NombreMigracion
dotnet ef database update
```

---

## 🚀 Despliegue y Ejecución

### Requisitos

- .NET 8.0 SDK
- PostgreSQL (Supabase o Neon)
- Node.js (opcional para build frontend)

### Pasos de Ejecución

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/DwnMosquera/DYPStore.git
   cd DYPStore
   ```

2. **Configurar conexión BD**
   - Editar `appsettings.json` con credenciales reales

3. **Restaurar dependencias**
   ```bash
   dotnet restore
   ```

4. **Aplicar migraciones**
   ```bash
   dotnet ef database update
   ```

5. **Ejecutar aplicación**
   ```bash
   dotnet run
   ```

6. **Acceder**
   - Frontend: `https://localhost:5001`
   - Admin: `https://localhost:5001/Admin/Dashboard`

### Variables de Entorno

Para producción, usar variables de entorno:
- `ConnectionStrings__PrimarySupabase`
- `ConnectionStrings__SecondaryNeon`
- `AppSettings__AdminEmail`, etc.

---

## 📁 Archivos Adicionales Importantes

### Configuración y Logs
- **Proyecto (.csproj)**: `DYPStore/DYPStore.csproj` - Dependencias y configuración del proyecto
- **Error Log**: `DYPStore/error_log.txt` - Registro de errores de la aplicación
- **Instrucciones UX**: `DYPStore/INSTRUCCIONES_UX.txt` - Guía de experiencia de usuario

### Archivos Estáticos Detallados
- **CSS Principal**: `DYPStore/wwwroot/css/site.css` - Estilos personalizados
- **JavaScript Principal**: `DYPStore/wwwroot/js/site.js` - Lógica cliente (Face ID, etc.)

### Área Admin Completa
- **Controlador Admin**: `DYPStore/Areas/Admin/Controllers/DashboardController.cs`
- **Vistas Admin**: `DYPStore/Areas/Admin/Views/` (Dashboard, Products, Orders, etc.)
- **_ViewImports Admin**: `DYPStore/Areas/Admin/Views/_ViewImports.cshtml`
- **_ViewStart Admin**: `DYPStore/Areas/Admin/Views/_ViewStart.cshtml`

---

## 🔧 Solución de Problemas

## 🔧 Solución de Problemas

### Error "relation FaceEnrollments does not exist"

- **Causa**: Tabla faltante en BD
- **Solución**: Ejecutar migraciones o crear tabla manualmente

### Error de Conexión BD

- **Causa**: Cadena inválida o servidor caído
- **Solución**: Verificar `DatabaseSteward` y configuraciones

### Face ID no funciona

- **Causa**: Modelos face-api.js no cargados
- **Solución**: Verificar `wwwroot/js/site.js` y permisos de cámara

---

## 📈 Métricas y Monitoreo

### Dashboard Admin

- Total productos, pedidos, usuarios
- Ingresos mensuales
- Conversaciones de chatbot
- Registros de Face ID

### Logging

- Serilog configurado para diferentes niveles
- Logs de autenticación facial
- Logs de conversaciones IA

---

## 🔮 Futuras Mejoras

- [ ] Integración con pasarelas de pago (Stripe, PayPal)
- [ ] Sistema de reseñas de productos
- [ ] Notificaciones push
- [ ] API REST completa
- [ ] Contenedorización con Docker
- [ ] CI/CD con GitHub Actions

---

## 👥 Equipo y Contribución

**Desarrollador Principal:** DwnMosquera

**Stack Tecnológico:**
- Backend: ASP.NET Core MVC
- Frontend: Razor + Bootstrap + Vanilla JS
- BD: PostgreSQL con EF Core
- IA: OpenAI GPT
- PWA: Service Worker API

Para contribuir:
1. Fork el repositorio
2. Crear rama feature
3. Pull request con descripción detallada

---

## 📞 Contacto

- **Email:** dypstore677@gmail.com
- **GitHub:** https://github.com/DwnMosquera/DYPStore
- **Demo:** https://dypstore-demo.vercel.app (si aplica)

---

*Documentación generada el 14 de mayo de 2026 para presentación del proyecto DYPStore.*