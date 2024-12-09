# Obter o IP da interface ativa (ajuste wlp0s20f3 se necessário)
HOST_IP=$(ip -4 addr show wlp0s20f3 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

# Verificar se o IP foi obtido
if [ -z "$HOST_IP" ]; then
    echo "Erro: Não foi possível obter o IP da interface. Verifique o nome da interface de rede."
    exit 1
fi

# Exportar o IP como variável de ambiente
export BACKEND_API_URL="http://$HOST_IP:8000"


docker compose up --build -d
# Exibir mensagem para depuração
echo "IP detectado: $BACKEND_API_URL"


# Esperar alguns segundos para garantir que o backend está rodando
sleep 5

# Iniciar o Expo

cd ./mobile
npm i 
npm start
