using DYPStore.Data;
using DYPStore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace DYPStore.Controllers
{
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _db;
        public ProductsController(ApplicationDbContext db) { _db = db; }

        public async Task<IActionResult> Index(string? category, string? search)
        {
            ViewBag.CurrentCategory = category;
            ViewBag.CurrentSearch = search;
            var q = _db.Products.AsQueryable();
            if (!string.IsNullOrEmpty(category) && Enum.TryParse<ProductCategory>(category, out var cat))
                q = q.Where(p => p.Category == cat);
            if (!string.IsNullOrEmpty(search))
                q = q.Where(p => p.Name.Contains(search) || p.Brand.Contains(search) || p.Description.Contains(search));
            return View(await q.OrderByDescending(p => p.CreatedAt).ToListAsync());
        }

        public async Task<IActionResult> Details(int id)
        {
            var p = await _db.Products.FindAsync(id);
            if (p == null) return NotFound();
            return View(p);
        }
    }
}
