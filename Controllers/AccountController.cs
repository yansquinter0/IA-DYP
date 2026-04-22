using DYPStore.Models;
using DYPStore.Models.ViewModels;
using DYPStore.Services; 
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DYPStore.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;

        public AccountController(UserManager<ApplicationUser> um, SignInManager<ApplicationUser> sm, IEmailSender emailSender) 
        { 
            _userManager = um; 
            _signInManager = sm; 
            _emailSender = emailSender;
        }

        // --- LOGIN ---
        [HttpGet] 
        public IActionResult Login(string? returnUrl = null)
        {
            if (User.Identity?.IsAuthenticated == true) return RedirectToAction("Index", "Home");
            return View(new LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            try
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);

                if (result.Succeeded)
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);
                    if (user != null && await _userManager.IsInRoleAsync(user, "Admin"))
                        return RedirectToAction("Index", "Dashboard", new { area = "Admin" });

                    if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
                        return Redirect(model.ReturnUrl);

                    return RedirectToAction("Index", "Home");
                }

                ModelState.AddModelError("", "Correo o contraseña incorrectos.");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "El servicio no está disponible en este momento. Intenta de nuevo en unos segundos.");
            }

            return View(model);
        }

        // --- REGISTER ---
        [HttpGet] 
        public IActionResult Register()
        {
            if (User.Identity?.IsAuthenticated == true) return RedirectToAction("Index", "Home");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            try
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email, FullName = model.FullName, EmailConfirmed = true };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "User");
                    await _signInManager.SignInAsync(user, false);
                    return RedirectToAction("Index", "Home");
                }

                foreach (var e in result.Errors) ModelState.AddModelError("", e.Description);
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "El servicio no está disponible en este momento. Intenta de nuevo en unos segundos.");
            }

            return View(model);
        }

        // --- RECUPERAR CONTRASEÑA ---
        [HttpGet]
        public IActionResult ForgotPassword() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            try 
            {
                if (!ModelState.IsValid) return View(model);
                
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user != null)
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var callbackUrl = Url.Action("ResetPassword", "Account", new { token, email = user.Email }, protocol: Request.Scheme);
                    
                    string emailBody = $@"
                        <div style=""background-color: #0f0f0f; padding: 40px 15px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;"">
                            <div style=""max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #333333; box-shadow: 0 15px 35px rgba(0,0,0,0.5);"">
                                
                                <div style=""background: linear-gradient(135deg, #e60023 0%, #a80017 100%); padding: 30px 20px; text-align: center;"">
                                    <h1 style=""margin: 0; color: #ffffff; font-size: 26px; letter-spacing: 3px; font-weight: 800;"">DYPSTORE</h1>
                                </div>

                                <div style=""padding: 40px 30px;"">
                                    <h2 style=""margin-top: 0; color: #ffffff; font-size: 22px; font-weight: 600;"">Recuperación de Contraseña</h2>
                                    
                                    <p style=""color: #cccccc; font-size: 16px; line-height: 1.6;"">
                                        Hola <strong style=""color: #ffffff;"">{user.FullName}</strong>,
                                    </p>
                                    
                                    <p style=""color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 35px;"">
                                        Hemos recibido una solicitud para cambiar tu contraseña en tu cuenta de <strong style=""color: #ffffff;"">DYPStore</strong>. Haz clic en el botón de abajo para elegir una nueva contraseña:
                                    </p>
                                    
                                    <div style=""text-align: center; margin: 40px 0;"">
                                        <a href='{callbackUrl}' style=""background-color: #e60023; color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;"">Restablecer Mi Contraseña</a>
                                    </div>
                                    
                                    <p style=""color: #888888; font-size: 14px; line-height: 1.5; margin-bottom: 25px; border-top: 1px solid #333333; padding-top: 25px;"">
                                        Si no hiciste esta solicitud, puedes ignorar este mensaje tranquilamente. Tu cuenta está segura.
                                    </p>
                                    
                                    <div style=""background-color: #111111; padding: 15px; border-radius: 8px; overflow-wrap: break-word; word-break: break-all;"">
                                        <p style=""color: #777777; font-size: 12px; margin: 0 0 5px 0;"">Enlace directo (si el botón no funciona):</p>
                                        <a href='{callbackUrl}' style=""color: #e60023; font-size: 12px; text-decoration: none;"">{callbackUrl}</a>
                                    </div>
                                </div>
                                
                                <div style=""background-color: #111111; padding: 20px; text-align: center; border-top: 1px solid #222222;"">
                                    <p style=""color: #555555; font-size: 12px; margin: 0;"">
                                        &copy; {System.DateTime.Now.Year} DYPSTORE. Todos los derechos reservados.
                                    </p>
                                </div>
                            </div>
                        </div>";

                    await _emailSender.SendEmailAsync(model.Email, "Recuperar Contraseña - DYPStore", emailBody);
                }
                
                return RedirectToAction("ForgotPasswordConfirmation");
            }
            catch (System.Exception ex)
            {
                return Content($"ERROR CRÍTICO: {ex.Message}\n\nStackTrace:\n{ex.StackTrace}", "text/plain");
            }
        }

        public IActionResult ForgotPasswordConfirmation() => View();

        [HttpGet]
        public IActionResult ResetPassword(string token, string email)
        {
            if (token == null || email == null) return RedirectToAction("Login");
            return View(new ResetPasswordViewModel { Token = token, Email = email });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid) return View(model);
            
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return RedirectToAction("ResetPasswordConfirmation");
            
            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            if (result.Succeeded) return RedirectToAction("ResetPasswordConfirmation");
            
            foreach (var error in result.Errors) ModelState.AddModelError("", error.Description);
            return View(model);
        }

        public IActionResult ResetPasswordConfirmation() => View();

        // --- LOGOUT & ACCESO DENEGADO ---
        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout() 
        { 
            await _signInManager.SignOutAsync(); 
            return RedirectToAction("Index", "Home"); 
        }

        public IActionResult AccessDenied() => View();

        // --- SUPABASE SYNC ---
        [HttpPost]
        public async Task<IActionResult> SupabaseLoginSync([FromBody] SupabaseTokenModel model)
        {
            if (string.IsNullOrEmpty(model?.AccessToken)) return BadRequest("Token faltante");

            using var httpClient = new System.Net.Http.HttpClient();
            // Validar token contra los servidores de Supabase de manera segura
            httpClient.DefaultRequestHeaders.Add("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0c3hpdXVyc3l2aXF6dWF5enZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTAyNTYsImV4cCI6MjA4ODk4NjI1Nn0.8r2kRgGB4rRKmHD93yNZ6gTr8szERmuERDHGRxJd4Lk");
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", model.AccessToken);

            var response = await httpClient.GetAsync("https://gtsxiuursyviqzuayzvm.supabase.co/auth/v1/user");
            if (!response.IsSuccessStatusCode)
            {
                return Unauthorized("Token inválido");
            }

            var content = await response.Content.ReadAsStringAsync();
            var supabaseUser = System.Text.Json.JsonDocument.Parse(content).RootElement;
            
            var email = supabaseUser.GetProperty("email").GetString();
            if (string.IsNullOrEmpty(email)) return Unauthorized("Email no encontrado en el token.");

            var name = "Usuario Google";
            if (supabaseUser.TryGetProperty("user_metadata", out var meta) && meta.TryGetProperty("full_name", out var nameProp))
            {
                name = nameProp.GetString() ?? name;
            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                // Crear al usuario sin contraseña porque se logueó con Google
                user = new ApplicationUser { UserName = email, Email = email, FullName = name, EmailConfirmed = true };
                var result = await _userManager.CreateAsync(user);
                
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "User");
                }
                else
                {
                    return BadRequest("Error interno creando el usuario local");
                }
            }

            // Iniciar la sesión formal en ASP.NET Core Identity (Crea la Cookie)
            await _signInManager.SignInAsync(user, isPersistent: true);
            
            return Ok();
        }
    }

    public class SupabaseTokenModel
    {
        public string? AccessToken { get; set; }
    }
}