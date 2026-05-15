using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DYPStore.Models
{
    public class ChatLog
    {
        public int Id { get; set; }

        // Quién hizo la consulta
        public string? UserId { get; set; }

        [StringLength(256)]
        public string UserEmail { get; set; } = string.Empty;

        [StringLength(20)]
        public string UserRole { get; set; } = "User"; // "Admin" | "User" | "Anonymous"

        // Mensaje del usuario
        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;

        // Intención detectada
        [StringLength(60)]
        public string Intent { get; set; } = string.Empty;

        // Si la acción fue exitosa
        public bool IsSuccess { get; set; } = true;

        // Si fue una acción destructiva (actualizar precio, stock, eliminar)
        public bool IsWriteAction { get; set; } = false;

        // IP del cliente (para auditoría)
        [StringLength(60)]
        public string? IpAddress { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navegación opcional
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
    }
}
