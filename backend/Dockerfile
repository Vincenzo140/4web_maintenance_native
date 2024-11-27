FROM python:3.12-slim

# Instale dependências necessárias para o Poetry e o Python
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instale o Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos do projeto
COPY pyproject.toml poetry.lock ./

# Configure o Python no Poetry para a versão correta
RUN poetry env use python3.12

# Instale as dependências do projeto
RUN poetry install --no-root --without dev

# Copie o restante do projeto
COPY . .

# Comando para iniciar o backend
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
