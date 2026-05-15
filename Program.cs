using DYPStore.Data;
using DYPStore.Models;
using DYPStore.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Base de Datos (Failover con DatabaseSteward)
builder.Services.AddSingleton<DatabaseSteward>();
builder.Services.AddDbContext<ApplicationDbContext>((sp, options) => {
    var steward = sp.GetRequiredService<DatabaseSteward>();
    options.UseNpgsql(steward.GetConnectionString());
});

// 2. Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// 3. Servicios
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddScoped<ChatbotService>();

builder.Services.AddControllersWithViews();
builder.Services.AddSession();

var app = builder.Build();

// Middleware para inyectar el estado de Failover para el Frontend
app.Use(async (context, next) =>
{
    var steward = context.RequestServices.GetRequiredService<DatabaseSteward>();
    context.Items["IsSecondaryDb"] = steward.IsUsingSecondaryDb;
    await next();
});

// Inicializar DB: crear roles, admin y productos de ejemplo
using (var scope = app.Services.CreateScope())
{
    await DYPStore.Data.DbInitializer.InitializeAsync(scope.ServiceProvider);
}

if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseSession();

app.MapControllers(); // attribute-routed controllers (FaceIdController, ChatbotController, etc.)

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
