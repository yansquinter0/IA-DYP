using DYPStore.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace DYPStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("El mensaje no puede estar vacío.");
            }

            string msgLower = request.Message.ToLower();
            string responseMessage = string.Empty;
            string? redirectUrl = null;

            // 1. Verificar si pide información de Admin
            if (msgLower.Contains("stock") || msgLower.Contains("inventario") || msgLower.Contains("cuántos quedan") || msgLower.Contains("cuantos quedan"))
            {
                if (User.Identity != null && User.Identity.IsAuthenticated && User.IsInRole("Admin"))
                {
                    var words = msgLower.Split(new[] { ' ', ',', '.', '?' }, StringSplitOptions.RemoveEmptyEntries)
                                        .Where(w => w.Length > 3 && w != "stock" && w != "inventario" && w != "quiero" && w != "saber" && w != "cuantos" && w != "quedan")
                                        .ToList();
                    
                    if (words.Any())
                    {
                        var allProducts = await _context.Products.ToListAsync();
                        var matchingProducts = allProducts.Where(p => 
                            words.Any(w => p.Name.ToLower().Contains(w) || p.Brand.ToLower().Contains(w))
                        ).Take(3).ToList();

                        if (matchingProducts.Any())
                        {
                            responseMessage = "📊 **Reporte de Stock (Modo Admin):**\n\n";
                            foreach (var p in matchingProducts)
                            {
                                responseMessage += $"- **{p.Name}**: {p.Stock} unidades en bodega.\n";
                            }
                        }
                        else
                        {
                            responseMessage = "No encontré ese producto específico. Revisa el Panel de Control para ver el inventario completo.";
                        }
                    }
                    else
                    {
                        // Mostrar los que tienen menos stock
                        var lowStock = await _context.Products.OrderBy(p => p.Stock).Take(3).ToListAsync();
                        responseMessage = "📊 **Hola Admin, estos son los productos con menor stock actualmente:**\n\n";
                        foreach (var p in lowStock)
                        {
                            responseMessage += $"- **{p.Name}**: {p.Stock} unidades.\n";
                        }
                    }
                }
                else
                {
                    responseMessage = "⚠️ Perdón, tienes que tener los permisos de administrador para poder ingresar a esta información.";
                }
            }
            else if (msgLower.Contains("hola") || msgLower.Contains("saludos"))
            {
                responseMessage = "¡Hola! Soy DYP IA 🤖. ¿En qué te puedo ayudar hoy con respecto a tus compras o entrenamiento?";
            }
            else if (msgLower.Contains("precio") || msgLower.Contains("costo") || msgLower.Contains("cuanto"))
            {
                responseMessage = "Nuestros precios varían según el producto. Te redirijo a la Tienda para que veas todas nuestras ofertas...";
                redirectUrl = "/Products";
            }
            // Prioridad a Categorías: Si mencionan una categoría o tipo general, llevarlos a la categoría completa
            else if (msgLower.Contains("boxeo") || msgLower.Contains("guante") || msgLower.Contains("venda") || msgLower.Contains("saco") || msgLower.Contains("box"))
            {
                responseMessage = "¡Excelente elección! Te redirijo a toda nuestra sección de Boxeo 🥊 (incluyendo guantes y accesorios)...";
                redirectUrl = "/Products?category=boxing";
            }
            else if (msgLower.Contains("suplemento") || msgLower.Contains("proteina") || msgLower.Contains("creatina") || msgLower.Contains("vitamina"))
            {
                responseMessage = "¡Perfecto para tu rendimiento! Te redirijo a la categoría de Suplementos 💊...";
                redirectUrl = "/Products?category=supplements";
            }
            else if (msgLower.Contains("zapato") || msgLower.Contains("tenis") || msgLower.Contains("calzado") || msgLower.Contains("bota") || msgLower.Contains("zapatilla"))
            {
                responseMessage = "Tenemos excelente calzado deportivo para ti. Te redirijo a la sección de Tenis Deportivos 👟...";
                redirectUrl = "/Products?category=shoes";
            }
            else
            {
                // Búsqueda específica de producto por nombre o marca si no fue una categoría general
                var words = msgLower.Split(new[] { ' ', ',', '.', '?' }, StringSplitOptions.RemoveEmptyEntries)
                                    .Where(w => w.Length > 3 && w != "quiero" && w != "busco" && w != "tienes" && w != "algún" && w != "algun" && w != "como")
                                    .ToList();

                if (words.Any())
                {
                    var allProducts = await _context.Products.ToListAsync();
                    
                    var matchingProducts = allProducts.Where(p => 
                        words.Any(w => p.Name.ToLower().Contains(w) || 
                                       p.Description.ToLower().Contains(w) || 
                                       p.Brand.ToLower().Contains(w))
                    ).Take(3).ToList();

                    if (matchingProducts.Any())
                    {
                        var mainProduct = matchingProducts.First();
                        if (matchingProducts.Count == 1)
                        {
                            responseMessage = $"¡Claro! Te redirijo automáticamente a **{mainProduct.Name}**...";
                        }
                        else
                        {
                            responseMessage = $"¡Encontré varias opciones! Te redirijo a la más relevante: **{mainProduct.Name}**...";
                        }
                        redirectUrl = $"/Products/Details/{mainProduct.Id}";
                    }
                    else 
                    {
                        responseMessage = "Entiendo. ¡Estoy aquí para guiarte en tu navegación por DYPStore! Puedes preguntarme por categorías como Boxeo, Suplementos o Calzado deportivo.";
                    }
                }
                else
                {
                    responseMessage = "Entiendo. ¡Estoy aquí para guiarte en tu navegación por DYPStore! Puedes preguntarme por categorías como Boxeo, Suplementos o Calzado deportivo.";
                }
            }

            return Ok(new { message = responseMessage, redirectUrl = redirectUrl });
        }
    }

    public class ChatRequest
    {
        public string? ChatId { get; set; }
        public string? Message { get; set; }
        public string? Route { get; set; }
    }
}
