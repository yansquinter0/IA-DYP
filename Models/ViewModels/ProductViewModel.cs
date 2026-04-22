using System.ComponentModel.DataAnnotations;
namespace DYPStore.Models.ViewModels
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage="Nombre requerido")][Display(Name="Nombre")]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage="Descripción requerida")][Display(Name="Descripción")]
        public string Description { get; set; } = string.Empty;
        [Required(ErrorMessage="Marca requerida")][Display(Name="Marca")]
        public string Brand { get; set; } = string.Empty;
        [Required][Range(0.01,999999999,ErrorMessage="Precio inválido")][Display(Name="Precio")]
        public decimal Price { get; set; }
        [Required][Range(0,99999,ErrorMessage="Stock inválido")][Display(Name="Stock")]
        public int Stock { get; set; }
        [Required][Display(Name="Categoría")]
        public ProductCategory Category { get; set; }
        [Display(Name="URL de imagen")]
        public string? ImageUrl { get; set; }
    }
}
