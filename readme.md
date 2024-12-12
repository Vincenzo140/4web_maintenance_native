.md# Sistema de Gerenciamento de Manutenção

Este é um sistema completo de gerenciamento de manutenção, construído com uma arquitetura moderna e escalável, que abrange backend (FastAPI), frontend (React com TypeScript) e mobile (React Native com Expo). O sistema permite o gerenciamento de máquinas, manutenções, peças e equipes, fornecendo uma solução integrada para otimizar as operações de manutenção.

## Arquitetura do Sistema

```mermaid
graph LR
    subgraph Frontend ["Frontend (React + TypeScript)"]
        A[React Components] --> B[API Requests]
        B --> C[Zustand State Management]
        C --> D[UI/UX - TailwindCSS, Lucide]
    end
    
    subgraph Backend ["Backend (FastAPI)"]
        E[API Endpoints] --> F[Redis Cache]
        E --> G[Database - PostgreSQL/MySQL]
        H[Authentication] --> E
        I[Business Logic] --> E
    end

    subgraph Mobile ["Mobile (React Native + Expo)"]
        J[React Native Components] --> K[API Requests]
        K --> L[State Management - Context API/Zustand]
        L --> M[Mobile Navigation - React Navigation]
    end

    Frontend -->|REST API| Backend
    Mobile -->|REST API| Backend

```

## Stacks Utilizadas

**Backend:**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Poetry](https://img.shields.io/badge/Poetry-60A5FA?style=for-the-badge&logo=poetry&logoColor=white)](https://python-poetry.org/)
[![Uvicorn](https://img.shields.io/badge/Uvicorn-2196F3?style=for-the-badge&logo=uvicorn&logoColor=white)](https://www.uvicorn.org/)

**Frontend:**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Lucide](https://img.shields.io/badge/Lucide-FF8BA7?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-FF4785?style=for-the-badge&logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)

**Mobile:**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Navigation](https://img.shields.io/badge/React_Navigation-009688?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnavigation.org/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)


## Funcionalidades

* **Gerenciamento de Máquinas:** Cadastro, atualização, exclusão e visualização de máquinas com informações detalhadas, incluindo histórico de manutenção.
* **Gerenciamento de Manutenções:** Registro de novas manutenções, atribuição de equipes, acompanhamento do status e histórico de manutenções por máquina.
* **Gerenciamento de Peças:** Controle de estoque, cadastro de novas peças, atualização de quantidades e informações de fornecedores.
* **Gerenciamento de Equipes:** Criação de equipes de manutenção, atribuição de membros e especialidades.
* **Autenticação de Usuários:** Sistema de login e cadastro de usuários com segurança.
* **Dashboard com Estatísticas:** Visão geral das principais métricas do sistema, como total de máquinas, equipes, manutenções e visitas. (Frontend)
* **Testes Unitários e de Integração:** Garantia de qualidade do código através de testes automatizados. (Backend)

## Rodando o Projeto

### Backend

1. Navegue até a pasta `backend`.
2. Instale as dependências: `poetry install`
3. Rode o servidor: `poetry run uvicorn main:app --reload`

### Frontend

1. Navegue até a pasta `frontend`.
2. Instale as dependências: `npm install`
3. Rode o projeto: `npm run dev`

### Mobile

1. Navegue até a pasta `mobile`.
2. Instale as dependências: `npm install` ou `yarn`
3. Rode o projeto: `npm start`
4. coloca seu ip publico no arquivo services/api.ts

### Docker

1. Certifique-se de ter o Docker e o Docker Compose instalados.
2. Na raiz do projeto, execute: `docker-compose up --build`

### Se tiveres linux 

1. Na raiz do projeto, execute: `chmod +x ./start.sh`
2. Então execute `./start.sh`
3. Não esqueça de colocar seu ip público na pasta `mobile/services/api.ts`
   
## Estrutura de Pastas

```
├── .gitignore
├── README.Docker.md
├── backend
│   ├── Dockerfile
│   ├── ... (código do backend)
├── compose.yaml
├── frontend
│   ├── Dockerfile
│   ├── ... (código do frontend)
├── mobile
│   ├── Dockerfile
│   ├── ... (código do mobile)
└── README.md
```

## Licença

[MIT](LICENSE)

## Contato

Vincenzo Amendola - vincenzo.amendola141@gmail.com


## Screenshots


**Backend - Commits:**

Aqui deveria ter uma imagem gerada pelo matplotlib no backend, porém não consigo acessar o repositorio para copiar a imagem.

**Frontend - Dashboard:**

![Home Screen](./docs/frontend/Screenshot%20From%202024-12-12%2015-53-38.png)
![Login Screen](./docs/frontend/Captura%20de%20tela%202024-12-04%20172632.png)
![SignUp Screen](./docs/frontend/Captura%20de%20tela%202024-12-04%20172609.png)
![Dashboard Screen](./docs/frontend/Captura%20de%20tela%202024-12-05%20172820.png)
![Machines Screen](./docs/frontend/Captura%20de%20tela%202024-12-04%20173509.png)
![Create Machines Screen](./docs/frontend/Captura%20de%20tela%202024-12-04%20173358.png)
![Maintenance Screen](./docs/frontend/Captura%20de%20tela%202024-12-04%20174402.png)
![Create Maintenance Screen](./docs/frontend/Captura%20de%20tela%202024-12-04%20174418.png)
![Parts Screen](./docs/frontend/Captura%20de%20tela%202024-12-05%20172748.png)
![Create Parts Screen](./docs/frontend/Captura%20de%20tela%202024-12-05%20172734.png)
![Teams Screen](./docs/frontend/Captura%20de%20tela%202024-12-04%20173845.png)
![Create Teams Screen](./docs/frontend/Captura%20de%20tela%202024-12-04%20173829.png)



**Mobile - Tela de Máquinas:**

Aqui deveria ter uma imagem do app mobile, porém não consigo acessar o repositorio para copiar a imagem.
