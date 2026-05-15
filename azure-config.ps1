# Script para configurar variables de entorno en Azure App Service
# Reemplaza TU_APP_SERVICE_NAME con el nombre real de tu App Service

# Variables de conexión a BD (reemplaza con tus valores reales)
az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting ConnectionStrings__PrimarySupabase="Host=tu-host-supabase;Database=postgres;Username=tu-username;Password=tu-password;SSL Mode=Require;Trust Server Certificate=true"

az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting ConnectionStrings__SecondaryNeon="CADENA_DE_BACKUP_NEON"

# Configuración de Email
az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting EmailSettings__SmtpServer="smtp.gmail.com"

az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting EmailSettings__SmtpPort="587"

az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting EmailSettings__SenderEmail="tu-email@gmail.com"

az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting EmailSettings__SenderPassword="tu-app-password"

# Configuración de Admin
az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting AppSettings__AdminEmail="admin@dypstore.com"

az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting AppSettings__AdminPassword="Admin123!"

az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting AppSettings__AdminName="Administrador DYPStore"

# Configuración general
az webapp config appsettings set --name TU_APP_SERVICE_NAME --resource-group TU_RESOURCE_GROUP `
  --setting ASPNETCORE_ENVIRONMENT="Production"