using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DYPStore.Models
{
    public enum ProductCategory { boxing, shoes, supplements }
    public class Product
    {
        public int Id { get; set; }
        [Required(ErrorMessage="El nombre es requerido")][StringLength(200)]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage="La descripción es requerida")]
        public string Description { get; set; } = string.Empty;
        [Required(ErrorMessage="La marca es requerida")][StringLength(100)]
        public string Brand { get; set; } = string.Empty;
        [Required][Column(TypeName="decimal(18,2)")][Range(0,999999999)]
        public decimal Price { get; set; }
        [Range(0,99999)] public int Stock { get; set; }
        [Required] public ProductCategory Category { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
