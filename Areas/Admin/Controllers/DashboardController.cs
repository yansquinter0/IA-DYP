using DYPStore.Data;
using DYPStore.Models;
using DYPStore.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace DYPStore.Areas.Admin.Controllers
{
    [Area("Admin")][Authorize(Roles = "Admin")]
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _um;
        public DashboardController(ApplicationDbContext db, UserManager<ApplicationUser> um) { _db = db; _um = um; }

        public async Task<IActionResult> Index()
        {
            ViewBag.TotalProducts = await _db.Products.CountAsync();
            ViewBag.TotalOrders = await _db.Orders.CountAsync();
            ViewBag.TotalUsers = _um.Users.Count();
            ViewBag.TotalRevenue = await _db.Orders.Where(o => o.Status == OrderStatus.completed).SumAsync(o => (decimal?)o.Total) ?? 0;
            return View();
        }

        // PRODUCTS
        public async Task<IActionResult> Products() => View(await _db.Products.OrderByDescending(p => p.CreatedAt).ToListAsync());

        public IActionResult CreateProduct() => View(new ProductViewModel());

        [HttpPost][ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateProduct(ProductViewModel model)
        {
            if (!ModelState.IsValid) return View(model);
            _db.Products.Add(new Product { Name=model.Name, Description=model.Description, Brand=model.Brand, Price=model.Price, Stock=model.Stock, Category=model.Category, ImageUrl=model.ImageUrl });
            await _db.SaveChangesAsync();
            TempData["Success"] = "Producto creado exitosamente.";
            return RedirectToAction("Products");
        }

        public async Task<IActionResult> EditProduct(int id)
        {
            var p = await _db.Products.FindAsync(id);
            if (p == null) return NotFound();
            return View(new ProductViewModel { Id=p.Id, Name=p.Name, Description=p.Description, Brand=p.Brand, Price=p.Price, Stock=p.Stock, Category=p.Category, ImageUrl=p.ImageUrl });
        }

        [HttpPost][ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProduct(int id, ProductViewModel model)
        {
            if (!ModelState.IsValid) return View(model);
            var p = await _db.Products.FindAsync(id);
            if (p == null) return NotFound();
            p.Name=model.Name; p.Description=model.Description; p.Brand=model.Brand; p.Price=model.Price; p.Stock=model.Stock; p.Category=model.Category; p.ImageUrl=model.ImageUrl;
            await _db.SaveChangesAsync();
            TempData["Success"] = "Producto actualizado.";
            return RedirectToAction("Products");
        }

        [HttpPost][ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var p = await _db.Products.FindAsync(id);
            if (p != null) { _db.Products.Remove(p); await _db.SaveChangesAsync(); TempData["Success"] = "Producto eliminado."; }
            return RedirectToAction("Products");
        }

        // USERS
        public async Task<IActionResult> Users()
        {
            var users = await _um.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
            var roles = new Dictionary<string, IList<string>>();
            foreach (var u in users) roles[u.Id] = await _um.GetRolesAsync(u);
            ViewBag.UserRoles = roles;
            return View(users);
        }

        [HttpPost][ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleAdmin(string userId)
        {
            var user = await _um.FindByIdAsync(userId);
            if (user == null) return NotFound();
            if (userId == _um.GetUserId(User)) { TempData["Error"] = "No puedes cambiar tu propio rol."; return RedirectToAction("Users"); }
            if (await _um.IsInRoleAsync(user, "Admin")) { await _um.RemoveFromRoleAsync(user, "Admin"); await _um.AddToRoleAsync(user, "User"); TempData["Success"] = $"Se quitó rol Admin a {user.FullName}."; }
            else { await _um.RemoveFromRoleAsync(user, "User"); await _um.AddToRoleAsync(user, "Admin"); TempData["Success"] = $"{user.FullName} ahora es Administrador."; }
            return RedirectToAction("Users");
        }

        [HttpPost][ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            if (userId == _um.GetUserId(User)) { TempData["Error"] = "No puedes eliminarte a ti mismo."; return RedirectToAction("Users"); }
            var user = await _um.FindByIdAsync(userId);
            if (user != null) { await _um.DeleteAsync(user); TempData["Success"] = "Usuario eliminado."; }
            return RedirectToAction("Users");
        }

        // ORDERS
        public async Task<IActionResult> Orders() => View(await _db.Orders.Include(o => o.User).Include(o => o.Items).OrderByDescending(o => o.CreatedAt).ToListAsync());

        [HttpPost][ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, OrderStatus status)
        {
            var order = await _db.Orders.FindAsync(orderId);
            if (order != null) { order.Status = status; await _db.SaveChangesAsync(); TempData["Success"] = "Estado del pedido actualizado."; }
            return RedirectToAction("Orders");
        }
    }
}
