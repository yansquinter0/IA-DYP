using DYPStore.Data;
using DYPStore.Models;
using DYPStore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DYPStore.Controllers
{
    [Route("api/chatbot")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly ChatbotService _chatbot;
        private readonly ApplicationDbContext _db;
        private readonly ILogger<ChatbotController> _logger;

        public ChatbotController(ChatbotService chatbot, ApplicationDbContext db, ILogger<ChatbotController> logger)
        {
            _chatbot = chatbot;
            _db = db;
            _logger = logger;
        }

        [HttpPost("message")]
        [Authorize]
        public async Task<IActionResult> Message([FromBody] ChatMessageRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Message) || request.Message.Length > 500)
                return BadRequest(new { error = "Mensaje inválido." });

            var isAdmin = User.IsInRole("Admin");
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userEmail = User.Identity?.Name ?? "";
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

            _logger.LogInformation("CHATBOT: User={User} IsAdmin={IsAdmin} Msg={Msg}", userEmail, isAdmin, request.Message);

            // Detect intent first (for logging)
            var intentResult = _chatbot.DetectIntent(request.Message);
            var response = await _chatbot.ProcessAsync(request.Message, isAdmin);

            // Write actions: stock updates, price updates, deletes
            var writeIntents = new[]
            {
                ChatIntent.AdminUpdateStock, ChatIntent.AdminUpdatePrice, ChatIntent.AdminDeleteProduct,
                ChatIntent.AdminCreateProduct
            };
            bool isWriteAction = writeIntents.Contains(intentResult.Intent);

            // Persist log
            await SaveLogAsync(userId, userEmail, isAdmin ? "Admin" : "User",
                request.Message, intentResult.Intent.ToString(), !response.IsError, isWriteAction, ip);

            return Ok(new { html = response.Html, isError = response.IsError });
        }

        // Endpoint público para usuarios no autenticados (solo consultas básicas)
        [HttpPost("public")]
        public async Task<IActionResult> PublicMessage([FromBody] ChatMessageRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Message) || request.Message.Length > 500)
                return BadRequest(new { error = "Mensaje inválido." });

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var intentResult = _chatbot.DetectIntent(request.Message);
            var response = await _chatbot.ProcessAsync(request.Message, isAdmin: false);

            await SaveLogAsync(null, "Anónimo", "Anonymous",
                request.Message, intentResult.Intent.ToString(), !response.IsError, false, ip);

            return Ok(new { html = response.Html, isError = response.IsError });
        }

        private async Task SaveLogAsync(string? userId, string email, string role,
            string message, string intent, bool isSuccess, bool isWriteAction, string? ip)
        {
            try
            {
                _db.ChatLogs.Add(new ChatLog
                {
                    UserId = userId,
                    UserEmail = email,
                    UserRole = role,
                    Message = message,
                    Intent = intent,
                    IsSuccess = isSuccess,
                    IsWriteAction = isWriteAction,
                    IpAddress = ip,
                    CreatedAt = DateTime.UtcNow
                });
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log no debe romper la respuesta al usuario
                _logger.LogError(ex, "Error guardando ChatLog");
            }
        }
    }

    public class ChatMessageRequest
    {
        public string Message { get; set; } = string.Empty;
    }
}
