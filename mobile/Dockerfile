FROM node:18

# Definir o diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências e instalá-las
COPY package*.json ./
RUN npm install

# Copiar o restante do código
COPY . .

# Expor as portas usadas pelo Expo
EXPOSE 19000 19001 19002

# Comando para iniciar o Expo
CMD ["npm", "start"]
