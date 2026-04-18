# 🚗 Aluguel de Carros

> Sistema web para gerenciamento de pedidos de aluguel de automóveis, integrando clientes, empresa e banco em um fluxo de aprovação de crédito.

---

## 🚧 Status do Projeto

![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-17-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Micronaut](https://img.shields.io/badge/Micronaut-4.6.3-007ec6?style=for-the-badge&logo=micronaut&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2.1-007ec6?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-007ec6?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-007ec6?style=for-the-badge&logo=docker&logoColor=white)

---

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Diagramas](#-diagramas)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
  - [Instalação de Dependências](#-instalação-de-dependências)
  - [Inicialização do Banco de Dados](#-inicialização-do-banco-de-dados-postgresql)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

O **Aluguel de Carros** é um sistema web full-stack desenvolvido como projeto acadêmico. Ele gerencia o ciclo completo de um pedido de aluguel de automóvel, envolvendo três perfis de usuário: **cliente**, **agente da empresa** e **agente do banco**.

O cliente solicita o aluguel, a empresa avalia e ajusta as condições contratuais, e o banco analisa a viabilidade de crédito — tudo em um único fluxo rastreável com controle de status em tempo real.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação com JWT:** Cadastro e login para clientes e agentes (empresa/banco).
- 📋 **Pedidos de Aluguel:** Clientes criam, modificam e cancelam pedidos de aluguel de automóveis.
- 🚗 **Catálogo de Automóveis:** Lista de veículos disponíveis para locação.
- ✅ **Avaliação pela Empresa:** Agentes da empresa aprovam, recusam ou ajustam pedidos.
- 💳 **Análise de Crédito:** Agentes do banco avaliam a viabilidade financeira e concedem crédito.
- 📊 **Acompanhamento de Status:** Clientes consultam o status atual de seus pedidos em tempo real.
- 👤 **Gerenciamento de Clientes:** Cadastro e visualização de dados dos clientes.
- 🗂️ **Contratos:** Geração e gestão de contratos de aluguel vinculados aos pedidos aprovados.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

* **Framework:** Next.js 16.2.1
* **Biblioteca UI:** React 19
* **Linguagem:** TypeScript 5
* **Estilização:** Tailwind CSS v4 + shadcn/ui
* **Formulários:** React Hook Form + Zod
* **HTTP Client:** Axios
* **Notificações:** Sonner

### 🖥️ Back-end

* **Linguagem:** Java 17
* **Framework:** Micronaut 4.6.3 (runtime Netty)
* **Banco de Dados:** PostgreSQL 16
* **ORM:** Micronaut Data JPA (Hibernate)
* **Autenticação:** JWT (Micronaut Security)
* **Hash de Senhas:** BCrypt
* **Build:** Maven (via Maven Wrapper)
* **Utilitários:** Lombok, Logback

### ⚙️ Infraestrutura

* **Containerização:** Docker + Docker Compose
* **Banco (Docker):** PostgreSQL 16 Alpine

---

## 🏗 Arquitetura

O sistema segue uma arquitetura **cliente-servidor** com separação clara entre front-end e back-end:

- **Front-end (Next.js):** Aplicação SPA com roteamento por páginas. Componentes organizados por domínio (`clientes/`, `pedidos/`, `automoveis/`, etc.). Comunicação com a API via Axios, com contexto de autenticação global.
- **Back-end (Micronaut):** API REST com contexto `/api`, autenticação stateless via JWT. Camadas: `controller` → `service` → `repository` → `model`. DTOs para serialização e `exception` para tratamento centralizado de erros.
- **Banco de dados:** PostgreSQL gerenciado via Docker Compose. Schema criado automaticamente pelo Hibernate (`hbm2ddl.auto: update`).

**Entidades principais:** `Cliente`, `Agente`, `Automovel`, `Pedido`, `Contrato`, `ContratoCredito`, `Rendimento`.

**Perfis de acesso:**

| Perfil | Tipo de Agente |
|--------|----------------|
| Cliente | — |
| Agente Empresa | `EMPRESA` |
| Agente Banco | `BANCO` |

---

## � Diagramas

### Casos de Uso
![Casos de Uso](docs/Casos%20de%20Uso.png)

### Diagrama de Classes
![Diagrama de Classes](docs/Diagrama%20de%20Classes.png)

### Diagrama de Pacotes
![Diagrama de Pacotes](docs/Diagrama%20de%20pacotes.png)

### Diagrama de Componentes
![Diagrama de Componentes](docs/Diagrama%20de%20componentes.png)

### Diagrama de Implantação
![Diagrama de Implantação](docs/Diagrama%20de%20implantação.png)

---

## �🔧 Instalação e Execução

### Pré-requisitos

* **Java JDK 17** ou superior
* **Node.js** v18 ou superior + npm
* **Docker** (para o banco de dados PostgreSQL)

---

### 🔑 Variáveis de Ambiente

#### Back-end

As variáveis são lidas do ambiente ou usam os valores padrão definidos em `application.yml`:

| Variável | Descrição | Padrão |
| :--- | :--- | :--- |
| `PORT` | Porta do servidor Micronaut | `8080` |
| `DB_URL` | URL JDBC do PostgreSQL | `jdbc:postgresql://localhost:5432/aluguel_carros` |
| `DB_USERNAME` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `postgres` |
| `JWT_SECRET` | Chave secreta para tokens JWT (mínimo 256 bits) | valor padrão inseguro — **altere em produção** |

#### Front-end

Crie um arquivo **`.env.local`** dentro da pasta `/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

### 📦 Instalação de Dependências

1. **Clone o repositório:**

```bash
git clone <URL_DO_REPOSITÓRIO>
cd aluguel-carros
```

2. **Front-end (Next.js):**

```bash
cd frontend
npm install
cd ..
```

3. **Back-end (Micronaut/Maven):**

```bash
cd backend
./mvnw clean install
cd ..
```

---

### 💾 Inicialização do Banco de Dados (PostgreSQL)

Suba o container do PostgreSQL com Docker Compose:

```bash
docker-compose up -d
```

O banco `aluguel_carros` será criado automaticamente. O schema é gerenciado pelo Hibernate na inicialização do back-end.

---

### ⚡ Como Executar a Aplicação

Execute em **dois terminais separados**:

**Terminal 1 — Back-end:**

```bash
cd backend
./mvnw mn:run
```

A API estará disponível em **http://localhost:8080/api**.

**Terminal 2 — Front-end:**

```bash
cd frontend
npm run dev
```

O front-end estará disponível em **http://localhost:3000**.

---

## 📂 Estrutura de Pastas

```
aluguel-carros/
├── docker-compose.yml           # 🐳 Sobe o PostgreSQL em container
├── docs/
│   ├── Casos de Uso.png             # 📊 Diagrama de casos de uso
│   ├── Diagrama de Classes.png      # 🧬 Diagrama de classes
│   ├── Diagrama de pacotes.png      # 📦 Diagrama de pacotes
│   ├── Diagrama de componentes.png  # 🧩 Diagrama de componentes
│   ├── Diagrama de implantação.png  # 🚀 Diagrama de implantação
│   └── Historias.txt                # 📋 Histórias de usuário do sistema
│
├── frontend/                    # 📁 Aplicação Next.js
│   ├── src/
│   │   ├── app/                 # 📄 Páginas (login, register, dashboard)
│   │   ├── components/          # 🧱 Componentes por domínio (clientes, pedidos, etc.)
│   │   ├── contexts/            # 🔄 Contexto de autenticação
│   │   ├── services/            # 🔌 Serviços HTTP (Axios)
│   │   ├── types/               # 🏷️ Tipos TypeScript
│   │   └── lib/                 # 🛠️ Utilitários e formatadores
│   └── package.json
│
└── backend/                     # 📁 API Micronaut
    ├── pom.xml
    └── src/main/java/com/aluguelcarros/
        ├── controller/          # 🎮 Endpoints REST
        ├── service/             # ⚙️ Regras de negócio
        ├── repository/          # 🗄️ Repositórios JPA
        ├── model/               # 🧬 Entidades JPA
        ├── dto/                 # ✉️ Data Transfer Objects
        ├── config/              # 🔧 Configurações (CORS, segurança)
        └── exception/           # 💥 Tratamento de exceções
```

---

## 🔗 Documentações utilizadas

* 📖 [Documentação Oficial do **Micronaut**](https://docs.micronaut.io/latest/guide/)
* 📖 [Micronaut Security JWT](https://micronaut-projects.github.io/micronaut-security/latest/guide/)
* 📖 [Micronaut Data JPA](https://micronaut-projects.github.io/micronaut-data/latest/guide/)
* 📖 [Documentação Oficial do **Next.js**](https://nextjs.org/docs)
* 📖 [**shadcn/ui** — Componentes](https://ui.shadcn.com/)
* 📖 [**React Hook Form**](https://react-hook-form.com/)
* 📖 [**Zod** — Validação de esquemas](https://zod.dev/)
* 📖 [Documentação de Referência do **Docker**](https://docs.docker.com/)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub |
|---------|-----------------|
| Rafael Neumann | [@rafaelnunesneumann](https://github.com/rafaelnunesneumann) |

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**.

---
