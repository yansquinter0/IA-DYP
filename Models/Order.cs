using System.ComponentModel.DataAnnotations.Schema;
namespace DYPStore.Models
{
    public enum OrderStatus { pending, processing, completed, cancelled }
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        [Column(TypeName="decimal(18,2)")] public decimal Total { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ApplicationUser User { get; set; } = null!;
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
