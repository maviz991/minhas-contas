Claro! Ótima ideia. Manter a documentação atualizada é uma disciplina que economiza muito tempo no futuro. É a marca de um projeto bem cuidado.

Vamos atualizar nosso arquivo `API-DEVELOPMENT.md` para incluir a lógica de negócio e a refatoração do código que você implementou.

Abaixo está o conteúdo atualizado. Você pode simplesmente copiar e colar, substituindo a versão antiga do arquivo.

---

# Guia de Desenvolvimento da API - Minhas Contas (v2)

Este documento é a continuação do `README.md` (Guia de Setup) e detalha o processo de construção, teste e depuração dos endpoints da API do projeto "Minhas Contas".

## Tópicos

1.  Estrutura do Servidor com Express.js
2.  Construção dos Endpoints de `Transaction`
3.  **Construção dos Endpoints de `Account` e `Category`** *(Novo)*
4.  **Implementando Lógica de Negócio: Atualização de Saldo** *(Novo)*
5.  **Refatoração: Estruturando Rotas** *(Novo)*
6.  Teste e Validação com Postman
7.  Troubleshooting: Erros Comuns e Soluções

---

## 1. Estrutura do Servidor com Express.js
*(Esta seção permanece a mesma)*

O coração da nossa API é o arquivo `index.js`, que é responsável por criar o servidor, configurar os middlewares e definir as rotas.

---

## 2. Construção dos Endpoints de `Transaction`
*(Esta seção permanece a mesma, mas seu código será movido na refatoração)*

---

## 3. Construção dos Endpoints de `Account` e `Category`

Para tornar o aplicativo completo, criamos os endpoints necessários para que o cliente possa criar e listar contas (ex: "Carteira", "Conta Corrente") e categorias (ex: "Alimentação", "Transporte").

### Endpoints para `Account`

*   **`GET /accounts`**: Lista todas as contas existentes.
*   **`POST /accounts`**: Cria uma nova conta. Requer um `name` no corpo da requisição e opcionalmente um `balance` inicial.

### Endpoints para `Category`

*   **`GET /categories`**: Lista todas as categorias existentes.
*   **`POST /categories`**: Cria uma nova categoria. Requer um `name` no corpo da requisição.

---

## 4. Implementando Lógica de Negócio: Atualização de Saldo

Um requisito fundamental do nosso aplicativo é que o saldo de uma conta (`Account.balance`) seja atualizado automaticamente sempre que uma nova transação for criada.

*   Uma transação do tipo **`DESPESA`** deve **diminuir** o saldo.
*   Uma transação do tipo **`RECEITA`** deve **aumentar** o saldo.

Para garantir que a criação da transação e a atualização do saldo aconteçam de forma segura e atômica (ou ambas têm sucesso, ou nenhuma delas é aplicada), utilizamos a funcionalidade **`$transaction`** do Prisma.

**Lógica Implementada na Rota `POST /transactions`:**

```javascript
const result = await prisma.$transaction(async (tx) => {
  // 1. Cria a nova transação
  const newTransaction = await tx.transaction.create({ /* ... dados ... */ });

  // 2. Calcula a mudança no saldo com base no tipo da transação
  const amountValue = parseFloat(amount);
  const balanceChange = type === 'DESPESA' ? -amountValue : amountValue;

  // 3. Atualiza o saldo da conta associada usando 'increment'
  const updatedAccount = await tx.account.update({
    where: { id: accountId },
    data: {
      balance: {
        increment: balanceChange,
      },
    },
  });

  return { newTransaction, updatedAccount };
});
```

---

## 5. Refatoração: Estruturando Rotas

À medida que a API cresceu, o arquivo `index.js` começou a ficar muito grande. Para manter o código organizado e seguindo o princípio da **separação de responsabilidades**, refatoramos a estrutura do projeto.

1.  **Criação da Pasta `routes`:** Todas as lógicas de rota foram movidas para arquivos dentro desta pasta.
    *   `routes/transactions.routes.js`
    *   `routes/accounts.routes.js`
    *   `routes/categories.routes.js`

2.  **Uso do `express.Router`:**
    Dentro de cada arquivo de rota, utilizamos o `express.Router` para criar um "mini-app" isolado para cada recurso.
    *   **Exemplo (`transactions.routes.js`):**
        ```javascript
        import { Router } from 'express';
        const router = Router();

        router.get('/', (req, res) => { /* ... */ });
        router.post('/', (req, res) => { /* ... */ });

        export default router;
        ```

3.  **Simplificação do `index.js`:**
    O arquivo principal (`index.js`) agora atua como um "gerente de tráfego", apenas importando os roteadores e os conectando aos seus respectivos prefixos de URL.

    *   **Exemplo (`index.js`):**
        ```javascript
        import express from 'express';
        import transactionsRouter from './routes/transactions.routes.js';
        import accountsRouter from './routes/accounts.routes.js';
        import categoriesRouter from './routes/categories.routes.js';

        const app = express();
        // ... middlewares ...

        // Conectando os roteadores
        app.use('/transactions', transactionsRouter);
        app.use('/accounts', accountsRouter);
        app.use('/categories', categoriesRouter);

        // ... inicialização do servidor ...
        ```
    Esta nova estrutura torna o projeto muito mais fácil de navegar, depurar e expandir no futuro.

---
## 6. Teste e Validação com Postman
*(Esta seção permanece relevante para todos os novos endpoints)*

---
## 7. Troubleshooting: Erros Comuns e Soluções
*(Esta seção permanece a mesma)*