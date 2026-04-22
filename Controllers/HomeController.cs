using DYPStore.Data;
using DYPStore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DYPStore.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ApplicationDbContext db, ILogger<HomeController> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var products = await _db.Products
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(4)
                    .ToListAsync();
                return View(products);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("DB no disponible: {Message}", ex.Message);
                return View(new List<Product>());
            }
        }

        public IActionResult Error() => View();
        public IActionResult AccessDenied() => View();
    }
}
