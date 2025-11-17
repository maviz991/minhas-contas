# Guia de Setup e Pontos Principais - Frontend React Native

## Stack Principal

*   **Framework:** React Native
*   **Plataforma:** Expo (SDK 51+)
*   **Roteamento:** Expo Router v3 (baseado em arquivos)
*   **Linguagem:** TypeScript
*   **Cliente HTTP:** Axios

## Pré-requisitos

1.  Node.js (LTS)
2.  Git
3.  VS Code
4.  Celular com o app "Expo Go" instalado
5.  Backend rodando e configurado conforme o guia da API.

## 1. Setup do Projeto

```bash
# Clone o repositório
git clone <URL_DO_SEU_REPOSITORIO>

# Navegue para a pasta do app
cd minhas-contas-app

# Instale as dependências
npm install
```

## 2. Configuração de Rede (Crítico)

A comunicação entre o App (rodando no Windows/Wi-Fi) e a API (rodando no WSL2) exige uma configuração de rede específica. Siga **todos** os passos.

1.  **Garanta que o backend está rodando no WSL** e que o servidor Express está escutando em `0.0.0.0`.
    ```javascript
    // index.js (backend)
    app.listen(PORT, '0.0.0.0', ...);
    ```

2.  **Obtenha os Endereços de IP:**
    *   **IP do WSL:** No terminal WSL, rode `wsl hostname -I`. Ex: `172.18.122.224`.
    *   **IP do Host (Windows):** No PowerShell, rode `ipconfig` e encontre o "Endereço IPv4" da sua conexão Wi-Fi. Ex: `192.168.0.3`.

3.  **Aplique as Regras de Rede no PowerShell (Admin):**
    *   **Firewall:** Crie a regra para permitir tráfego na porta da API.
      ```powershell
      New-NetFirewallRule -DisplayName "WSL Port 3001" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3001
      ```
    *   **Port Proxy:** Crie a regra para redirecionar o tráfego do Host para o WSL.
      ```powershell
      netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=SEU_IP_DO_WSL_AQUI
      ```

4.  **Configure o Serviço da API no Frontend:**
    *   No arquivo `services/api.js`, use o **IP do Host (Windows)**. O app no celular vai se conectar a este IP.

    **Arquivo: `services/api.js`**
    ```javascript
    import axios from 'axios';

    // Use o IP do Windows (ipconfig)
    const API_URL = 'http://SEU_IP_DO_WINDOWS:3001';

    const api = axios.create({
      baseURL: API_URL,
    });

    export default api;
    ```

## 3. Rodando o Projeto

1.  No terminal PowerShell, na raiz do projeto (`minhas-contas-app`), inicie o servidor de desenvolvimento do Expo:
    ```powershell
    npm start
    ```
2.  Abra o app Expo Go no seu celular e escaneie o QR Code que aparecer no terminal.

## 4. Estrutura do Projeto (Expo Router)

O roteamento é baseado na estrutura de arquivos e pastas dentro do diretório `app`.

*   `app/`: Diretório raiz das rotas.
*   `app/(tabs)/`: Define um grupo de rotas que compartilharão um layout (neste caso, uma barra de abas). O nome do diretório com parênteses, `(tabs)`, não faz parte da URL.
*   `app/(tabs)/index.tsx`: É a tela da **primeira aba**. Corresponde à rota `/`.
*   `app/(tabs)/explore.tsx`: É a tela da **segunda aba**. Corresponde à rota `/explore`.
*   `app/(tabs)/_layout.tsx`: **Arquivo de layout**. Configura o contêiner do grupo de rotas. Neste caso, ele define a `Tabs` (barra de navegação inferior), seus ícones e nomes.
*   `services/`: Centraliza a comunicação com a API. O arquivo `api.js` é o ponto único de configuração do Axios.