using DYPStore.Data;
using DYPStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace DYPStore.Controllers
{
    [Authorize]
    public class OrdersController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _um;
        public OrdersController(ApplicationDbContext db, UserManager<ApplicationUser> um) { _db = db; _um = um; }
        public async Task<IActionResult> Index()
        {
            var uid = _um.GetUserId(User)!;
            var orders = await _db.Orders.Include(o => o.Items).Where(o => o.UserId == uid).OrderByDescending(o => o.CreatedAt).ToListAsync();
            return View(orders);
        }
        public async Task<IActionResult> Details(int id)
        {
            var uid = _um.GetUserId(User)!;
            var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id && o.UserId == uid);
            if (order == null) return NotFound();
            return View(order);
        }
    }
}
