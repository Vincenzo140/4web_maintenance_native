@echo off
:: Obter o IP da interface ativa (substitua wlp0s20f3 pelo nome correto)
for /f "tokens=2 delims=:" %%I in ('netsh interface ipv4 show addresses "wlp0s20f3" ^| findstr "IP Address"') do (
    set HOST_IP=%%I
)

:: Remover espaços extras
set HOST_IP=%HOST_IP:~1%

:: Verificar se o IP foi obtido
if "%HOST_IP%"=="" (
    echo Erro: Não foi possível obter o IP da interface. Verifique o nome da interface de rede.
    exit /b 1
)

:: Exportar o IP como variável de ambiente
set BACKEND_API_URL=http://%HOST_IP%:8000
echo IP detectado: %BACKEND_API_URL%

:: Iniciar o Docker
docker compose up --build -d

:: Esperar alguns segundos para garantir que o backend está rodando
timeout /t 5

:: Iniciar o Expo
cd mobile
npm install
npm start
