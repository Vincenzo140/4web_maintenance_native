# Etapa de build
FROM node:21-slim as builder

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY ./ /app/

ARG FRONTEND_ENV=production
ARG VITE_BACKEND_API_URL
ARG VITE_PWD_SIGNUP_ENABLED
ARG VITE_GA_TRACKING_ID

ENV VITE_APP_ENV=${FRONTEND_ENV}

# RUN npm run test:unit  # Descomente esta linha se quiser rodar testes
RUN npm run build

# Etapa de produção
FROM nginx:1.23.1

# Remove configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/*

# Remove os assets padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos e a configuração do Nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d
