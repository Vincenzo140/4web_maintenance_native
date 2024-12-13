# Obter o IP da interface ativa (substitua wlp0s20f3 pelo nome correto)
$HOST_IP = (Get-NetIPAddress -InterfaceAlias "wlp0s20f3" -AddressFamily IPv4).IPAddress

# Verificar se o IP foi obtido
if (-not $HOST_IP) {
    Write-Host "Erro: Não foi possível obter o IP da interface. Verifique o nome da interface de rede."
    exit 1
}

# Exportar o IP como variável de ambiente
$env:BACKEND_API_URL = "http://$HOST_IP:8000"
Write-Host "IP detectado: $env:BACKEND_API_URL"

# Iniciar o Docker
docker compose up --build -d

# Esperar alguns segundos para garantir que o backend está rodando
Start-Sleep -Seconds 5

# Iniciar o Expo
Set-Location -Path "./mobile"
npm install
npm start
