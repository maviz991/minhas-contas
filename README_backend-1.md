# Guia de Setup do Backend - Projeto Minhas Contas

Este documento serve como um guia passo a passo para configurar o ambiente de desenvolvimento do backend para o projeto "Minhas Contas".

O objetivo é criar uma API robusta, segura e fácil de manter para gerenciar dados financeiros.

## Stack Tecnológico

*   **Ambiente de Execução:** Node.js
*   **Framework da API:** Express.js
*   **Banco de Dados:** PostgreSQL
*   **ORM (Object-Relational Mapper):** Prisma
*   **Containerização:** Docker (via Docker Compose)
*   **Terminal de Desenvolvimento:** WSL (Debian)

---

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas e configuradas:

1.  **WSL (Windows Subsystem for Linux)** com uma distribuição Debian (ou Ubuntu).
2.  **Node.js** e **npm** instalados dentro do ambiente WSL.
3.  **Docker Desktop** instalado no Windows e com a integração do WSL habilitada.
4.  **Visual Studio Code** com a extensão **WSL** instalada.

---

## Passo 1: Inicialização do Projeto Node.js

O primeiro passo é criar a estrutura básica do nosso projeto Node.js.

```bash
# Crie o diretório do projeto e navegue para dentro dele
mkdir minhas-contas-api
cd minhas-contas-api

# Inicie um projeto Node.js, o -y aceita todas as configurações padrão
npm init -y

# Instale dependecias para rodar o projeto
npm install express cors dotenv
npm install prisma pg --save-dev 
npx prisma init --datasource-provider postgresql
```

## Passo 2: Configuração do Banco de Dados com Docker

Para garantir um ambiente de banco de dados consistente e isolado, usamos o Docker.

1.  **Crie o arquivo de configuração do Docker:**
    Crie um arquivo chamado `docker-compose.yml` na raiz do projeto com o seguinte conteúdo:

    ```yaml
    version: '3.8'
    services:
      db:
        image: postgres:14
        restart: always
        environment:
          - POSTGRES_USER=admin
          - POSTGRES_PASSWORD=admin
          - POSTGRES_DB=minhascontas
        ports:
          - '5432:5432'
        volumes:
          - postgres_data:/var/lib/postgresql/data
    
    volumes:
      postgres_data:
    ```
    > **O que este arquivo faz?**
    > *   `image: postgres:14`: Baixa a imagem oficial do PostgreSQL na versão 14.
    > *   `environment`: Define as credenciais e o nome do banco de dados inicial. **Essas são as credenciais que usaremos na nossa API.**
    > *   `ports: - '5432:5432'`: Mapeia a porta 5432 do container para a porta 5432 da sua máquina local, permitindo que a API se conecte.
    > *   `volumes`: Garante que os dados do banco persistam mesmo que o container seja reiniciado.

2.  **Inicie o container do banco de dados:**
    Execute o seguinte comando no terminal WSL. O `-d` (detached) faz com que ele rode em segundo plano.

    ```bash
    docker-compose up -d
    ```

## Passo 3: Configuração do Prisma ORM

O Prisma será nossa ponte de comunicação entre o código Node.js e o banco de dados PostgreSQL.

1.  **Instale as dependências necessárias:**
    Vamos instalar o Express (para o servidor), o Prisma e o driver do PostgreSQL.

    ```bash
    # Dependências de produção
    npm install express cors dotenv @prisma/client

    # Dependências de desenvolvimento
    npm install prisma pg --save-dev
    ```

2.  **Inicialize o Prisma no projeto:**
    Este comando cria a estrutura básica do Prisma, incluindo a pasta `prisma` e o arquivo `.env`.

    ```bash
    npx prisma init --datasource-provider postgresql
    ```

3.  **Configure a Conexão com o Banco de Dados:**
    Este é um passo crucial. Precisamos informar ao Prisma como se conectar ao nosso banco de dados Docker.

    *   Abra o arquivo `.env` que foi criado na raiz do projeto.
    *   **Substitua** a URL de conexão padrão pela URL que corresponde às credenciais do nosso `docker-compose.yml`.

    ```env
    # A URL DEVE ser esta para conectar ao nosso container Docker
    DATABASE_URL="postgresql://admin:admin@localhost:5432/minhascontas?schema=minhascontas"
    ```
    > **Atenção:** Um erro comum aqui é deixar a URL padrão (`johndoe:randompassword...`), o que causa o erro de autenticação `P1000`.

## Passo 4: Modelagem dos Dados no Schema do Prisma

Agora, vamos definir a estrutura das nossas tabelas (modelos) no arquivo de schema do Prisma.

1.  **Edite o arquivo `prisma/schema.prisma`:**
    Substitua todo o conteúdo do arquivo pelo nosso modelo de dados.

    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Account {
      id        String   @id @default(cuid())
      name      String   @unique
      balance   Float    @default(0)
      createdAt DateTime @default(now())

      transactions Transaction[]
    }

    model Category {
      id   String @id @default(cuid())
      name String @unique

      transactions Transaction[]
    }

    model Transaction {
      id          String   @id @default(cuid())
      description String
      amount      Float
      date        DateTime @default(now())
      type        String
      createdAt   DateTime @default(now())

      account    Account  @relation(fields: [accountId], references: [id])
      accountId  String
      category   Category @relation(fields: [categoryId], references: [id])
      categoryId String
    }
    ```

## Passo 5: Executando a Migração do Banco de Dados

Com o schema definido, vamos aplicar essa estrutura ao nosso banco de dados.

1.  **Execute o comando de migração:**
    Este comando compara o `schema.prisma` com o estado atual do banco de dados e gera os arquivos SQL necessários para sincronizá-los.

    ```bash
    npx prisma migrate dev
    ```

2.  **Dê um nome para a migração:**
    O Prisma solicitará um nome para esta primeira migração. Um nome descritivo é `init`. Digite `init` e pressione Enter.

    Após a execução, suas tabelas (`Account`, `Category`, `Transaction`) estarão criadas no banco de dados PostgreSQL.

## Passo 6: Verificando o Banco de Dados com Prisma Studio

O Prisma oferece uma interface visual para interagir com o banco de dados, perfeita para testes e depuração.

1.  **Inicie o Prisma Studio:**

    ```bash
    npx prisma studio
    ```

2.  **Acesse no navegador:**
    Abra `http://localhost:5555` no seu navegador. Você verá seus modelos e poderá adicionar, editar ou remover dados visualmente.

---

### Próximos Passos

Com a fundação do banco de dados completa e verificada, o próximo passo é construir os **endpoints da API** usando Express.js para permitir que o frontend (nosso app React Native) possa consumir e manipular esses dados.