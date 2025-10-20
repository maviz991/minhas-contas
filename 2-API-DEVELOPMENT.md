Com certeza. Criar essa documentação é uma excelente forma de consolidar o conhecimento. Este segundo arquivo Markdown, que você pode chamar de `API-DEVELOPMENT.md`, foca no processo de construção e teste da API em si.

---

# Guia de Desenvolvimento da API - Minhas Contas

Este documento é a continuação do `README.md` (Guia de Setup) e detalha o processo de construção, teste e depuração dos endpoints da API do projeto "Minhas Contas".

## Tópicos

1.  Estrutura do Servidor com Express.js
2.  Construção dos Endpoints de `Transaction`
3.  Teste e Validação com Postman
4.  Troubleshooting: Erros Comuns e Soluções

---

## 1. Estrutura do Servidor com Express.js

O coração da nossa API é o arquivo `index.js`, que é responsável por criar o servidor, configurar os middlewares e definir as rotas.

**Arquivo: `index.js`**

```javascript
// 1. Importações
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// 2. Inicializações
const app = express();
const prisma = new PrismaClient();

// 3. Middlewares
app.use(express.json()); // ESSENCIAL para a API entender corpos de requisição em JSON
app.use(cors());         // Permite que o nosso futuro app se comunique com esta API

// 4. Rotas (Endpoints)
// ... (serão definidas aqui)

// 5. Inicialização do Servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
```

> **Nota sobre `type: "module"`:**
> Para usar a sintaxe de `import`, adicionamos a seguinte linha ao `package.json`, transformando nosso projeto em um ES Module:
> ```json
> "type": "module",
> ```

---

## 2. Construção dos Endpoints de `Transaction`

Começamos implementando as operações essenciais (CRUD - Create, Read) para o nosso modelo principal, `Transaction`.

### Endpoint `GET /transactions`

*   **Objetivo:** Listar todas as transações existentes no banco de dados.
*   **Método HTTP:** `GET`

**Código (`index.js`):**
```javascript
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      // O 'include' é um recurso poderoso do Prisma.
      // Ele automaticamente busca os dados relacionados de Account e Category.
      include: {
        account: true,
        category: true,
      },
    });
    res.json(transactions);
  } catch (error) {
    // Se algo der errado, capturamos o erro e enviamos uma resposta 500.
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Não foi possível buscar as transações.' });
  }
});
```

### Endpoint `POST /transactions`

*   **Objetivo:** Criar uma nova transação. Os dados são enviados no corpo (Body) da requisição.
*   **Método HTTP:** `POST`

**Código (`index.js`):**
```javascript
app.post('/transactions', async (req, res) => {
  try {
    // Desestruturamos os dados que vêm do corpo da requisição (req.body)
    const { description, amount, type, accountId, categoryId } = req.body;

    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        accountId,
        categoryId,
      },
    });

    // Retornamos um status 201 (Created) e o objeto recém-criado.
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Não foi possível criar a transação.' });
  }
});
```

---

## 3. Teste e Validação com Postman

Uma API só está pronta quando é testada. Usamos o Postman para simular um cliente (nosso futuro app) e validar os endpoints.

**Fluxo de Teste:**

1.  **Preparar o Banco (Seed de Dados):**
    *   Como uma `Transaction` depende de uma `Account` e uma `Category` (chaves estrangeiras), não podemos criar uma transação do zero.
    *   Usamos o **Prisma Studio** (`npx prisma studio`) para criar manualmente:
        *   Um registro em `Account` (ex: "Carteira").
        *   Um registro em `Category` (ex: "Alimentação").
    *   **Copiamos os `id`s** gerados para usar no teste do `POST`.

2.  **Testar o `GET` (Estado Inicial):**
    *   **Requisição:** `GET http://localhost:3001/transactions`
    *   **Resultado Esperado:** Um array vazio (`[]`) e status `200 OK`.

3.  **Testar o `POST`:**
    *   **Requisição:** `POST http://localhost:3001/transactions`
    *   **Configuração:**
        *   Ir para a aba **Body**.
        *   Selecionar **raw** e o tipo **JSON**.
    *   **Corpo (Body) da Requisição:**
        ```json
        {
          "description": "Almoço no restaurante",
          "amount": 35.50,
          "type": "DESPESA",
          "accountId": "ID_COPIADO_DA_CONTA",
          "categoryId": "ID_COPIADO_DA_CATEGORIA"
        }
        ```
    *   **Resultado Esperado:** O objeto da transação criada e status `201 Created` (ou `200 OK`).

4.  **Testar o `GET` (Verificação Final):**
    *   Repetimos a requisição `GET http://localhost:3001/transactions`.
    *   **Resultado Esperado:** Um array contendo o objeto da transação que acabamos de criar.

---

## 4. Troubleshooting: Erros Comuns e Soluções

Durante o desenvolvimento, encontramos e resolvemos os seguintes erros:

1.  **Erro do Prisma Engine (`binaryTargets`):**
    *   **Sintoma:** `PrismaClientInitializationError: ...could not locate the Query Engine for runtime "debian-openssl-3.0.x"`
    *   **Causa:** O Prisma foi gerado no Windows (`npx prisma migrate`), mas o servidor rodou no WSL/Debian (`node index.js`). O "motor" para Linux não existia.
    *   **Solução:** Adicionar os alvos de compilação no `prisma/schema.prisma` e regenerar o cliente.
        ```prisma
        generator client {
          provider      = "prisma-client-js"
          binaryTargets = ["native", "debian-openssl-3.0.x"]
        }
        ```
        E então rodar: `npx prisma generate`

2.  **Erro de Corpo da Requisição (`req.body` undefined):**
    *   **Sintoma:** `TypeError: Cannot destructure property 'description' of 'req.body' as it is undefined.`
    *   **Causa:** O Express, por padrão, não processa o corpo de requisições JSON.
    *   **Solução:** Adicionar o middleware `express.json()` no `index.js` **antes** da definição das rotas.
        ```javascript
        app.use(express.json());
        ```

3.  **Erro de Servidor Interno (`500 Internal Server Error`):**
    *   **Sintoma:** O Postman recebe a resposta `{ "error": "Não foi possível criar a transação." }`.
    *   **Causa:** Geralmente um erro no banco de dados, mais comumente uma violação de chave estrangeira (os `id`s de conta/categoria enviados não existem no banco).
    *   **Solução:** Verificar o log de erro no terminal do Node.js para a mensagem específica do Prisma e corrigir os dados enviados (neste caso, os `id`s no corpo do Postman).