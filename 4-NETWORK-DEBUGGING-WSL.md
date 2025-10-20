# Guia de Debugging de Rede: Conectando React Native ao Backend WSL

Este documento detalha o processo de diagnóstico e solução de problemas de rede encontrados ao tentar conectar um aplicativo React Native (rodando em um celular na rede Wi-Fi) a uma API Node.js (rodando dentro do ambiente WSL2 no Windows).

## O Problema: `[AxiosError: Network Error]`

O sintoma inicial era um `Network Error` no aplicativo React Native toda vez que ele tentava fazer uma chamada para a API. Este é um erro genérico que indica que o aplicativo não conseguiu sequer chegar ao servidor de destino.

A causa raiz é a complexa arquitetura de rede do WSL2.

## A Arquitetura: As Duas Redes

Para entender o problema, é crucial saber que seu computador estava operando com duas redes distintas:

1.  **A Rede Wi-Fi (Externa):**
    *   **IP:** `192.168.0.3`
    *   **Participantes:** Seu computador Windows, seu roteador e seu celular.
    *   **Função:** É a rede do "mundo real" que permite que seus dispositivos se comuniquem.

2.  **A Rede Virtual do WSL (Interna):**
    *   **IP:** `172.18.122.224`
    *   **Participantes:** Apenas seu sistema Windows e seu subsistema Linux (WSL).
    *   **Função:** É uma "ponte" privada e virtual para que o Windows e o Linux conversem entre si. **Seu celular não tem acesso a esta rede.**

O desafio era fazer com que uma requisição do seu celular, vinda da rede `192.168.0.3`, atravessasse o Windows e chegasse corretamente ao servidor Node.js, que vivia na rede `172.18.122.224`.

## O Processo de Depuração Sistemática

Para isolar o culpado, seguimos um checklist rigoroso.

### Teste 1: A API está funcional?
*   **Ação:** Acessamos `http://localhost:3001` de dentro do Windows.
*   **Resultado:** `Cannot GET /`.
*   **Aprendizado:** Este foi um **sinal de sucesso**. Significava que a conexão foi estabelecida e o servidor Express respondeu, embora não tivéssemos uma rota para `/`. Isso provou que a API em si estava funcionando perfeitamente.

### Teste 2: A API está acessível pela rede Wi-Fi?
*   **Ação:** Acessamos `http://192.168.0.3:3001/accounts` do navegador do Windows.
*   **Resultado:** `ERR_CONNECTION_REFUSED`.
*   **Aprendizado:** Este foi o **diagnóstico chave**. A conexão não estava sendo bloqueada (o que geraria um timeout), mas sim **ativamente recusada**. Isso indicava que o próprio servidor Node.js, por padrão, só aceitava conexões de `localhost`.

### Teste 3: O Servidor está configurado para ouvir a rede?
*   **Ação:** Alteramos a inicialização do servidor no `index.js` da API.
*   **Código Antigo:** `app.listen(PORT, () => ...)`
*   **Código Novo:** `app.listen(PORT, '0.0.0.0', () => ...)`
*   **Aprendizado:** O host `'0.0.0.0'` instrui o servidor a "ouvir" em todas as interfaces de rede disponíveis, não apenas em `localhost`. Esta era a configuração correta para o servidor.

### Teste 4: O Linux confirma a configuração?
*   **Ação:** Rodamos `sudo netstat -ltnp | grep 3001` dentro do WSL.
*   **Resultado:** `tcp 0 0 0.0.0.0:3001 ... LISTEN ...`
*   **Aprendizado:** Este foi o **teste definitivo**. Ele provou, sem sombra de dúvida, que o nosso backend Node.js estava configurado corretamente e pronto para aceitar conexões externas. Isso isolou o problema como sendo 100% na camada de rede do Windows / WSL.

### Teste 5: O Firewall é o culpado?
*   **Ação:** Desativamos temporariamente o Firewall do Windows.
*   **Resultado:** O erro `ERR_CONNECTION_REFUSED` persistiu.
*   **Aprendizado:** Isso eliminou o suspeito mais comum e nos forçou a olhar para a própria mecânica de rede do WSL2.

## A Solução Final: Redirecionamento de Porta Manual (`Port Forwarding`)

A conclusão foi que o mecanismo de encaminhamento de porta automático do WSL2, que deveria espelhar as portas do Linux para o Windows, não estava funcionando para conexões externas (vindas da rede Wi-Fi).

A solução foi criar uma regra de rede manual e explícita.

1.  **Encontrar o IP do WSL:**
    ```bash
    wsl hostname -I
    # ou
    ip addr show eth0
    ```
    *   Resultado: `172.18.122.224`

2.  **Criar a Regra no Windows (PowerShell como Administrador):**
    *   Comando:
      ```powershell
      netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=172.18.122.224
      ```
    *   **Tradução:** Este comando diz ao Windows: "Qualquer tráfego que chegar na porta `3001` de qualquer um dos seus IPs (`listenaddress=0.0.0.0`), por favor, redirecione-o para a porta `3001` da máquina `172.18.122.224` (o WSL)".

Esta regra criou a "ponte" que faltava, finalmente permitindo que o aplicativo no celular se conectasse à API.

### Principais Lições

*   **WSL tem sua própria rede virtual.** Entender a diferença entre o IP da sua máquina na Wi-Fi (`192.168.x.x`) e o IP do WSL (`172.x.x.x`) é fundamental.
*   `ERR_CONNECTION_REFUSED` geralmente significa um problema de configuração no **servidor**, não um bloqueio de rede.
*   Um servidor Node.js precisa ouvir em `'0.0.0.0'` para ser acessível externamente.
*   Ferramentas como `netstat` são essenciais para verificar o estado real de um processo de rede.
*   `netsh interface portproxy` é uma ferramenta poderosa para resolver problemas complexos de rede com WSL, Docker ou máquinas virtuais.

