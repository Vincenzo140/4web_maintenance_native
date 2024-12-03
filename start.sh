#!/bin/bash

# Captura o IP do host
HOST_IP=$(ip route get 1 | awk '{print $7; exit}')

# Gera o arquivo .env com o IP capturado
echo "Gerando arquivo .env com BACKEND_API_URL..."
echo "BACKEND_API_URL=http://${HOST_IP}:8000" > .env

# Exibe o conteúdo do arquivo .env para confirmação
echo "Arquivo .env gerado:"
cat .env

# Inicia o docker-compose
echo "Iniciando os containers com docker-compose..."
docker compose up --build
