# Dockerfile

# Use a imagem oficial do Python como base
FROM python:3.13-slim

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de requisitos e instale as dependências
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copie todo o código da aplicação para o contêiner
COPY . .

# Adicione o diretório do Python ao PATH
ENV PATH="./.local/bin:$PATH"

# Exponha a porta que o FastAPI usa
EXPOSE 8000

# Comando para iniciar o servidor FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]