using System.ComponentModel.DataAnnotations.Schema;
namespace DYPStore.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        [Column(TypeName="decimal(18,2)")] public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public Order Order { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
