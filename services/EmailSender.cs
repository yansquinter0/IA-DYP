using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace DYPStore.Services {
    public class EmailSender : IEmailSender {
        private readonly IConfiguration _config;

        public EmailSender(IConfiguration config) {
            _config = config;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage) {
            var emailSettings = _config.GetSection("EmailSettings");
            var senderEmail = emailSettings["SenderEmail"];
            var senderPassword = emailSettings["SenderPassword"];
            var senderName = emailSettings["SenderName"];
            var smtpServer = emailSettings["SmtpServer"];
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");

            // Si aún no has configurado tu correo de Gmail, se imprimirá en consola en lugar de dar error
            if(string.IsNullOrEmpty(senderEmail) || senderEmail == "TU_CORREO_GMAIL@gmail.com") 
            {
                Console.WriteLine($"[SIMULADO] Email simulado para: {email}\n[ASUNTO]: {subject}\n[CONTENIDO]: {htmlMessage}\n");
                return;
            }

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail, senderName),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            using var smtpClient = new SmtpClient(smtpServer)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = true,
            };

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}