# Use a imagem base do Python
FROM python:3.11-slim-buster

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do Poetry
COPY pyproject.toml poetry.lock ./

# Instala o Poetry
RUN pip install poetry==1.8.3

# Instala as dependências do projeto
RUN poetry config virtualenvs.create false && poetry install --no-dev --no-interaction --no-ansi

# Copia o restante dos arquivos do projeto
COPY . .

# Define a variável de ambiente PYTHONPATH
ENV PYTHONPATH=/app

# Expondo a porta que sua aplicação irá usar
EXPOSE 8000

# Comando de inicialização da aplicação
CMD ["python", "backend/app.py"]
