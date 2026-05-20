# 🛠️ Sistema de Gerenciamento de Chamados Técnicos

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green)
![Java](https://img.shields.io/badge/Java-Spring_Boot-blue)
![React](https://img.shields.io/badge/React-Vite-61DAFB)

## 📖 Sobre o Projeto

Este sistema foi idealizado e desenvolvido como uma **solução real para um problema corporativo na Novetech Soluções Tecnológicas**. 

O objetivo principal da aplicação é modernizar, centralizar e otimizar o fluxo de atendimento do setor de infraestrutura e suporte da empresa. Anteriormente, o controle e rastreamento de requisições poderiam se perder ou carecer de métricas claras. Com este sistema, técnicos e gestores possuem uma ferramenta dedicada para abrir, gerenciar, atualizar e relatar chamados técnicos com eficiência e agilidade, garantindo um melhor tempo de resposta para as unidades e municípios atendidos.

## 🚀 Funcionalidades

O sistema foi arquitetado para abranger todo o ciclo de vida de um chamado de suporte:

- **Autenticação e Segurança:** Login seguro utilizando JWT (JSON Web Token) e controle de acesso baseado em perfis (Roles) via Spring Security.
- **Gestão de Chamados:** Criação de novos chamados, categorização, atribuição a técnicos e acompanhamento de status (Aberto, Em Andamento, Concluído).
- **Dashboard Interativo:** Painel de controle para visualização rápida de métricas e chamados pendentes.
- **Cadastro de Entidades:** Gerenciamento completo de Técnicos, Unidades, Municípios e Usuários do sistema.
- **Relatórios:** Geração de relatórios operacionais para auxiliar na tomada de decisão e análise de desempenho da equipe.

## 💻 Tecnologias Utilizadas

O projeto foi dividido em duas frentes principais (Frontend e Backend), utilizando tecnologias modernas e eficientes:

### Backend (API Rest)
- **Java**
- **Spring Boot** (Web, Data JPA, Security)
- **JSON Web Token (JWT)** para autenticação
- **Banco de Dados** (Mapeamento Relacional de Entidades)
- **Maven** (Gerenciamento de dependências)

### Frontend (Interface de Usuário)
- **React** - **Vite** (Build tool rápido)
- **Tailwind CSS** (Estilização de componentes)
- **React Router** (Navegação SPA)

## 📂 Estrutura do Projeto

O repositório está organizado nos seguintes diretórios principais:

- `/backend`: Contém toda a lógica da API Spring Boot, entidades de domínio, repositórios, serviços, controllers de segurança e regras de negócio.
- `/frontend`: Contém a interface do usuário em React, componentes, páginas de visualização e integração com a API via serviços Axios.

