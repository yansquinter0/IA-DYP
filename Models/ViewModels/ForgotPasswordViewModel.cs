using System.ComponentModel.DataAnnotations;

namespace DYPStore.Models.ViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessage = "El correo es obligatorio")]
        [EmailAddress(ErrorMessage = "Ingresa un correo válido")]
        public string Email { get; set; } = string.Empty;
    }
}