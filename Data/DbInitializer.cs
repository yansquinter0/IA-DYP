using DYPStore.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DYPStore.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var config = serviceProvider.GetRequiredService<IConfiguration>();

            await context.Database.MigrateAsync();

            foreach (var role in new[] { "Admin", "User" })
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));

            var adminEmail = config["AppSettings:AdminEmail"] ?? "admin@dypstore.com";
            var adminPassword = config["AppSettings:AdminPassword"] ?? "Admin123!";
            var adminName = config["AppSettings:AdminName"] ?? "Administrador";

            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var admin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, FullName = adminName, EmailConfirmed = true };
                var result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded) await userManager.AddToRoleAsync(admin, "Admin");
            }

            if (!await context.Products.AnyAsync())
            {
                context.Products.AddRange(new List<Product>
                {
                    new() { Name="Guantes de Boxeo Pro", Brand="Everlast", Price=89.99m, Stock=50, Category=ProductCategory.boxing, Description="Guantes profesionales de cuero genuino con relleno triple de espuma de alta densidad. Ideales para sparring y saco.", ImageUrl="https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=500&q=80" },
                    new() { Name="Casco de Boxeo Elite", Brand="Cleto Reyes", Price=65.00m, Stock=30, Category=ProductCategory.boxing, Description="Casco con máxima protección facial. Cuero genuino, acolchado triple y visor panorámico.", ImageUrl="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&q=80" },
                    new() { Name="Vendas para Boxeo", Brand="Venum", Price=12.99m, Stock=100, Category=ProductCategory.boxing, Description="Vendas elásticas de 4.5m. Protección de manos y muñecas. Lavables.", ImageUrl="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&q=80" },
                    new() { Name="Saco Heavy Bag 70lb", Brand="Title Boxing", Price=149.99m, Stock=15, Category=ProductCategory.boxing, Description="Saco relleno de trapo 100% algodón. Incluye cadena y giratorio.", ImageUrl="https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80" },
                    new() { Name="Protector Bucal Pro", Brand="Shock Doctor", Price=18.50m, Stock=80, Category=ProductCategory.boxing, Description="Protector bucal Gel-Fit. Se moldea en agua caliente.", ImageUrl="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&q=80" },
                    new() { Name="Skipping Rope Profesional", Brand="Title", Price=24.99m, Stock=60, Category=ProductCategory.boxing, Description="Cuerda de saltar de acero recubierto con mangos ergonómicos.", ImageUrl="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80" },
                    new() { Name="Nike Air Max 270", Brand="Nike", Price=120.00m, Stock=45, Category=ProductCategory.shoes, Description="Zapatilla con cámara Air Max 270. Amortiguación superior y comodidad todo el día.", ImageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
                    new() { Name="Adidas Ultraboost 23", Brand="Adidas", Price=180.00m, Stock=30, Category=ProductCategory.shoes, Description="Running con tecnología Boost. Devuelve energía en cada zancada.", ImageUrl="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80" },
                    new() { Name="Under Armour HOVR Sonic", Brand="Under Armour", Price=95.00m, Stock=50, Category=ProductCategory.shoes, Description="Running con tecnología HOVR para amortiguación sin peso.", ImageUrl="https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80" },
                    new() { Name="New Balance Fresh Foam", Brand="New Balance", Price=110.00m, Stock=35, Category=ProductCategory.shoes, Description="Foam Fresh X de última generación. Para largas distancias.", ImageUrl="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80" },
                    new() { Name="Puma Velocity Nitro 2", Brand="Puma", Price=130.00m, Stock=40, Category=ProductCategory.shoes, Description="Placa de carbono + espuma Nitro para running de competición.", ImageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
                    new() { Name="Asics Gel-Nimbus 25", Brand="Asics", Price=160.00m, Stock=25, Category=ProductCategory.shoes, Description="Gel en talón y antepié. Máxima amortiguación para corredores.", ImageUrl="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80" },
                    new() { Name="Whey Protein Gold Standard", Brand="Optimum Nutrition", Price=55.99m, Stock=80, Category=ProductCategory.supplements, Description="5 lb de proteína whey aislada. 24g de proteína por servicio.", ImageUrl="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80" },
                    new() { Name="Pre-Workout C4 Original", Brand="Cellucor", Price=35.99m, Stock=60, Category=ProductCategory.supplements, Description="Pre-entreno con 150mg de cafeína, beta-alanina y creatina.", ImageUrl="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80" },
                    new() { Name="Creatina Monohidrato 500g", Brand="BulkSupplements", Price=25.00m, Stock=100, Category=ProductCategory.supplements, Description="Creatina micronizada de grado farmacéutico. Aumenta fuerza y masa muscular.", ImageUrl="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80" },
                    new() { Name="BCAA 2:1:1 Powder", Brand="MusclePharm", Price=28.50m, Stock=70, Category=ProductCategory.supplements, Description="Aminoácidos esenciales. Acelera recuperación muscular.", ImageUrl="https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=500&q=80" },
                    new() { Name="Multivitamínico Sport", Brand="Animal Pak", Price=42.00m, Stock=55, Category=ProductCategory.supplements, Description="Pack completo de vitaminas y minerales para atletas.", ImageUrl="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80" },
                });
                await context.SaveChangesAsync();
            }
        }
    }
}
