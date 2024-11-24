FROM python:3.12-slim

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o pyproject.toml e o poetry.lock para a imagem
COPY pyproject.toml poetry.lock ./

# Instalar o Poetry
RUN pip install poetry

# Instalar as dependências do projeto
RUN poetry install --no-root

# Copiar o restante do código da aplicação
COPY . .

# Expôr a porta usada pela aplicação
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
