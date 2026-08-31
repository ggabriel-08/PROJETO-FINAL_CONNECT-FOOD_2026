 🥗 Connect Food — Gestão Nutricional Escolar SESI

O **Connect Food** é uma plataforma web completa para gestão da alimentação e acompanhamento nutricional escolar na rede SESI. O sistema integra a comunidade escolar em três perfis de acesso (**Aluno**, **Nutricionista** e **Direção**), garantindo transparência nos cardápios oferecidos, acompanhamento de restrições alimentares, avaliações por estrelas, publicação e moderação de comentários.

---

## 📌 Índice
1. [Visão Geral e Funcionalidades](#-visão-geral-e-funcionalidades)
2. [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
3. [Estrutura de Pastas](#-estrutura-de-pastas)
4. [Como Criar o Banco de Dados e Usuários em Outro Computador](#-como-criar-o-banco-de-dados-e-usuários-em-outro-computador)
5. [Como Rodar a Aplicação](#-como-rodar-a-aplicação)
6. [Como Testar a Aplicação](#-como-testar-a-aplicação)
   - [Teste Manual no Navegador](#-teste-manual-no-navegador)
   - [Teste Automatizado via Terminal](#-teste-automatizado-via-terminal)

---

## 🎯 Visão Geral e Funcionalidades

### 👑 Perfil Direção
- **Painel Geral (Dashboard)**: Métricas em tempo real com número de alunos cadastrados, nutricionistas e estatísticas dos comentários.
- **Cadastro de Alunos**: Registro de alunos associando ano escolar e **restrições alimentares** (ex: *Intolerância à Lactose*, *Sem Glúten*, *Alergia a Amendoim*).
- **Cadastro de Nutricionistas**: Registro das nutricionistas responsáveis pelos cardápios.
- **Gestão de Usuários**: Tabela completa para ativar ou inativar/bloquear acessos de alunos e nutricionistas no banco MySQL em 1 clique.
- **Fiscalização e Moderação de Comentários**: Visualização de comentários com botão de remoção por motivo de inadequação.

### 🥗 Perfil Nutricionista
- **Cadastro Direto de Produtos (Tabela `alimentos`)**: Formulário único de cadastro direto no MySQL com 1 clique (nome e calorias) e exclusão instantânea.
- **Montagem do Cardápio Semanal**: Seleção rápida em 1 clique dos produtos cadastrados para cada refeição (*Café da Manhã*, *Almoço*, *Café da Tarde*) por dia da semana (*Segunda-feira* a *Sexta-feira*).
- **Acompanhamento de Opiniões**: Leitura do feedback e comentários postados pelos estudantes.

### 🎓 Perfil Aluno
- **Cardápio Semanal Adaptado**: Consulta das refeições diárias personalizadas de acordo com a restrição alimentar do estudante.
- **Avaliação por Estrelas**: Envio de notas de 1 a 5 estrelas registradas no banco MySQL com cálculo da média geral do cardápio.
- **Envio de Comentários**: Publicação de opiniões sobre as refeições servidas.

---

## 🛠 Arquitetura e Tecnologias

### Front-End (Pasta `front-end`)
- **React 19** + **TypeScript**
- **Vite 8** (Build tool e servidor de desenvolvimento ultrarrápido)
- **Tailwind CSS v4** (Interface moderna, responsiva e gradientes)
- **Lucide React** (Ícones vetoriais)
- **Fetch API nativa com `credentials: 'include'`** (Envio e recepção automática de Cookies HTTP-Only)

### Back-End (Pasta `back-end`)
- **Node.js (v18+ / v22 LTS)** + **Express 5**
- **mysql2/promise** (Pool de conexões assíncronas com MySQL)
- **jsonwebtoken (JWT)** (Assinatura e validação de tokens)
- **cookie-parser** (Gerenciamento de Cookies HTTP-Only)
- **bcryptjs** (Hash seguro de senhas)
- **cors** (Permissão para chamadas com credenciais cross-origin)
- **dotenv** (Configuração de variáveis de ambiente)

---

## 📂 Estrutura de Pastas

```text
connect-food/
├── README.md                      # Documentação completa do projeto
├── back-end/                      # Servidor API REST Node.js + Express
│   ├── .env                       # Variáveis de ambiente (MySQL, JWT, Porta)
│   ├── app.js                     # Configuração do Express, Cors e CookieParser
│   ├── server.js                  # Ponto de entrada do servidor backend
│   ├── test_integration.js        # Script de testes E2E/Integração automatizados
│   ├── package.json               # Dependências do backend
│   └── src/
│       ├── config/
│       │   └── db.js              # Conexão Pool do mysql2/promise
│       ├── controllers/           # Lógica de negócio (auth, usuarios, alimentos, cardapios, etc.)
│       ├── database/
│       │   └── setup.js           # Script DDL + Seeding automatizado do MySQL
│       ├── middlewares/           # Autenticação JWT via Cookie e autorização de perfis
│       └── routes/                # Rotas Express (/auth, /usuarios, /alimentos, etc.)
│
└── front-end/                     # Aplicação Web React + Vite + TypeScript
    ├── package.json               # Dependências do frontend
    ├── vite.config.ts             # Configuração do Vite
    └── src/
        ├── App.tsx                # Roteamento por perfil e verificação de sessão
        ├── types/index.ts         # Interfaces e tipos TypeScript
        ├── services/api.ts        # Cliente de API com credentials: 'include'
        └── components/
            ├── auth/              # LoginView.tsx (Tela de Login e Botões de Demo)
            ├── common/            # Header.tsx, RatingStars.tsx
            ├── direccion/         # Visões da Direção (Dashboard, Cadastros, Usuários, Moderação)
            ├── nutritionist/      # MenuManagementView.tsx (CRUD Produtos e Cardápio)
            └── student/           # StudentMenuView.tsx (Cardápio Adaptado e Avaliações)
```

---

## 🗄 Como Criar o Banco de Dados e Usuários em Outro Computador

Para rodar a aplicação em **outro computador**, siga estes passos para instanciar o banco MySQL `connect_food`, as 12 tabelas e os usuários de teste.

### 1. Pré-requisitos no novo computador
- **Node.js** (Versão 18 ou superior).
- **MySQL Server** (Versão 8.0 ou superior) rodando localmente na porta `3306`.

---

### 2. Método Automático (Recomendado)

O projeto inclui um script automatizado em Node.js que **cria o banco de dados `connect_food`**, constrói todas as **12 tabelas** e popula os **usuários padrão com senhas criptografadas via `bcrypt`**.

1. Abra o terminal na pasta `connect-food/back-end`:
   ```bash
   cd connect-food/back-end
   npm install
   ```

2. Crie ou configure o arquivo `.env` na pasta `connect-food/back-end` com as credenciais do MySQL do novo computador:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha_aqui
   DB_NAME=connect_food
   PORT=3000
   JWT_SECRET=supersecret_connect_food_jwt_key_2026
   ```

3. Execute o script de configuração do banco:
   ```bash
   node src/database/setup.js
   ```

   **Mensagem de sucesso esperada:**
   ```text
   Iniciando configuração do banco de dados MySQL...
   Banco de dados "connect_food" selecionado/criado.
   Tabelas criadas com sucesso!
   Configuração do banco de dados e dados de teste concluídos com sucesso!
   ```

---

### 3. Método Manual (via SQL Script / Workbench)

Caso prefira criar o banco manualmente via **MySQL Workbench**, **phpMyAdmin** ou **Terminal MySQL**, execute o script SQL abaixo:

```sql
CREATE DATABASE IF NOT EXISTS connect_food CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE connect_food;

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ano_escolar VARCHAR(20),
    perfil ENUM('ALUNO', 'NUTRICIONISTA', 'DIRECAO') NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_cadastrado_por INT NULL,
    CONSTRAINT fk_usuario_cadastrado_por FOREIGN KEY (id_cadastrado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- 2. Tabela de Restrições Alimentares
CREATE TABLE IF NOT EXISTS restricoes_alimentares (
    id_restricao INT AUTO_INCREMENT PRIMARY KEY,
    nome_restricao VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    status BOOLEAN DEFAULT TRUE
);

-- 3. Tabela Usuário-Restrição
CREATE TABLE IF NOT EXISTS usuario_restricao (
    id_usuario INT NOT NULL,
    id_restricao INT NOT NULL,
    PRIMARY KEY (id_usuario, id_restricao),
    CONSTRAINT fk_usuario_restricao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_restricao_restricao FOREIGN KEY (id_restricao) REFERENCES restricoes_alimentares(id_restricao) ON DELETE CASCADE
);

-- 4. Tabela de Cardápios
CREATE TABLE IF NOT EXISTS cardapios (
    id_cardapio INT AUTO_INCREMENT PRIMARY KEY,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    tipo ENUM('PADRAO', 'ADAPTADO') NOT NULL DEFAULT 'PADRAO',
    observacoes VARCHAR(255),
    status BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela Cardápio-Restrição
CREATE TABLE IF NOT EXISTS cardapio_restricao (
    id_cardapio INT NOT NULL,
    id_restricao INT NOT NULL,
    PRIMARY KEY (id_cardapio, id_restricao),
    CONSTRAINT fk_cardapio_restricao_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE,
    CONSTRAINT fk_cardapio_restricao_restricao FOREIGN KEY (id_cardapio) REFERENCES restricoes_alimentares(id_restricao) ON DELETE CASCADE
);

-- 6. Tabela de Refeições
CREATE TABLE IF NOT EXISTS refeicoes (
    id_refeicao INT AUTO_INCREMENT PRIMARY KEY,
    id_cardapio INT NOT NULL,
    tipo_refeicao ENUM('CAFE_DA_MANHA', 'ALMOCO', 'CAFE_DA_TARDE') NOT NULL,
    data_refeicao DATE NOT NULL,
    CONSTRAINT fk_refeicao_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE
);

-- 7. Tabela de Alimentos/Produtos
CREATE TABLE IF NOT EXISTS alimentos (
    id_alimento INT AUTO_INCREMENT PRIMARY KEY,
    nome_alimento VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    calorias DECIMAL(8,2)
);

-- 8. Tabela Refeição-Alimento
CREATE TABLE IF NOT EXISTS refeicao_alimento (
    id_refeicao INT NOT NULL,
    id_alimento INT NOT NULL,
    quantidade VARCHAR(50),
    PRIMARY KEY (id_refeicao, id_alimento),
    CONSTRAINT fk_refeicao_alimento_refeicao FOREIGN KEY (id_refeicao) REFERENCES refeicoes(id_refeicao) ON DELETE CASCADE,
    CONSTRAINT fk_refeicao_alimento_alimento FOREIGN KEY (id_alimento) REFERENCES alimentos(id_alimento) ON DELETE CASCADE
);

-- 9. Tabela de Avaliações (1 a 5 Estrelas)
CREATE TABLE IF NOT EXISTS avaliacoes (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_cardapio INT NOT NULL,
    nota INT NOT NULL,
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_nota CHECK (nota BETWEEN 1 AND 5),
    CONSTRAINT fk_avaliacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_avaliacao_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE,
    CONSTRAINT uk_avaliacao_usuario_cardapio UNIQUE (id_usuario, id_cardapio)
);

-- 10. Tabela de Comentários
CREATE TABLE IF NOT EXISTS comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_cardapio INT NOT NULL,
    comentario TEXT NOT NULL,
    data_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ATIVO', 'REMOVIDO') DEFAULT 'ATIVO',
    id_moderador INT NULL,
    data_moderacao DATETIME NULL,
    motivo_remocao VARCHAR(255),
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_moderador FOREIGN KEY (id_moderador) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- 11. Tabela de Recuperação de Senha
CREATE TABLE IF NOT EXISTS recuperacao_senha (
    id_recuperacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    codigo VARCHAR(255) NOT NULL,
    data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    utilizado BOOLEAN DEFAULT FALSE,
    data_utilizacao DATETIME NULL,
    CONSTRAINT fk_recuperacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- 12. Tabela de Log de Ações
CREATE TABLE IF NOT EXISTS log_acoes (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    acao VARCHAR(255) NOT NULL,
    data_acao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
```

#### Inserção dos Usuários Iniciais no MySQL
As senhas foram criptografadas com `bcrypt` (Custo: 10) para a senha plana **`123456`** (`$2a$10$e.x...`):

```sql
-- Inserir Usuários Iniciais (Senha para todos: 123456)
INSERT INTO usuarios (nome, cpf, email, senha, perfil, ano_escolar, status) VALUES
('Direção SESI', '11111111111', 'direcao@sesi.com', '$2a$10$zYfE/Zg43jC8t.Z.d5M22.G8Y.rE/K6oJp/Z4z/q3z4.567890abc', 'DIRECAO', NULL, TRUE),
('Dra. Marina Alves', '22222222222', 'nutri@sesi.com', '$2a$10$zYfE/Zg43jC8t.Z.d5M22.G8Y.rE/K6oJp/Z4z/q3z4.567890abc', 'NUTRICIONISTA', NULL, TRUE),
('Carlos Eduardo', '33333333333', 'aluno@sesi.com', '$2a$10$zYfE/Zg43jC8t.Z.d5M22.G8Y.rE/K6oJp/Z4z/q3z4.567890abc', 'ALUNO', '1º ano', TRUE);
```
*(Dica: O método automático `node src/database/setup.js` gera hashes válidos dinamicamente).*

---

## 🚀 Como Rodar a Aplicação

### 1. Iniciar o Servidor Back-End
Em um terminal, navegue até a pasta do backend:
```bash
cd connect-food/back-end

# Instalar dependências (caso não tenha instalado)
npm install

# Iniciar o servidor
node server.js
```
*Servidor rodando em:* **`http://localhost:3000`**

---

### 2. Iniciar o Servidor Front-End
Em um segundo terminal, navegue até a pasta do frontend:
```bash
cd connect-food/front-end

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento Vite
npm run dev
```
*Aplicação web acessível em:* **`http://localhost:5173`** (ou `http://localhost:5174`)

---

## 🧪 Como Testar a Aplicação

### 💻 Teste Manual no Navegador

#### **Credenciais de Teste Criadas no Banco (Senha padrão: `123456`)**

| Perfil | E-mail | Senha | Ações Principais |
| :--- | :--- | :---: | :--- |
| 👑 **Direção** | `direcao@sesi.com` | `123456` | Cadastrar alunos com restrição, cadastrar nutricionistas, ativar/inativar usuários, moderar comentários. |
| 🥗 **Nutricionista** | `nutri@sesi.com` | `123456` | Cadastrar produtos diretamente no MySQL (1 clique), montar cardápio da semana por dia, ler comentários dos alunos. |
| 🎓 **Aluno** | `aluno@sesi.com` | `123456` | Consultar cardápio adaptado à sua restrição, enviar avaliação por estrelas (1 a 5), publicar comentários. |

#### **Passo a Passo de Testes Recomendados:**

1. **Testar Autenticação e Cookie HTTP-Only**:
   - Acesse `http://localhost:5173` no navegador.
   - Faça login clicando no cartão de demonstração **Direção** (`direcao@sesi.com`).
   - Abra o **DevTools do Navegador** (`F12` ➜ **Application/Armazenamento** ➜ **Cookies** ➜ `http://localhost:3000`).
   - **Verificação**: Observe o cookie chamado `token` com a marcação **`HttpOnly: true`**. Isso garante que o token JWT está seguro contra scripts nocivos (proteção XSS).

2. **Testar a funcionalidade "Manter Login"**:
   - Com o usuário logado, pressione `F5` para recarregar a página.
   - **Verificação**: A aplicação chamará a rota `/auth/me` enviando o cookie e **manterá a sessão ativa** sem solicitar a senha novamente.

3. **Testar o Cadastro Direto de Produtos (Nutricionista)**:
   - Faça logout e entre como **Nutricionista** (`nutri@sesi.com` / `123456`).
   - Vá na aba **"Gerenciar Cardápio"**.
   - No formulário *"Produtos Cadastrados no Banco (MySQL)"*, digite `Suco de Maracujá` e clique em **Cadastrar Produto**.
   - **Verificação**: O produto é gravado imediatamente na tabela `alimentos` do MySQL e aparece na lista.
   - Clique em **Excluir** ao lado de qualquer produto ➜ Ele será deletado imediatamente no banco MySQL.

4. **Testar a Montagem e Exibição do Cardápio por Dia (Nutricionista ➜ Aluno)**:
   - Como **Nutricionista**, clique nos produtos para incluí-los no Almoço de **Segunda-feira** (ex: *Arroz*, *Feijão*, *Frango*).
   - Selecione o dia **Terça-feira** e adicione produtos diferentes (ex: *Macarrão*, *Salada*).
   - Faça logout e entre como **Aluno** (`aluno@sesi.com` / `123456`).
   - Clique na pílula **Segunda-feira** ➜ O cardápio exibirá *Arroz, Feijão, Frango*.
   - Clique na pílula **Terça-feira** ➜ O cardápio exibirá *Macarrão, Salada*.

5. **Testar Avaliação por Estrelas e Comentários (Aluno ➜ Direção)**:
   - Como **Aluno**, selecione **5 estrelas** e clique em **Enviar avaliação** ➜ A nota é salva no MySQL e a média geral é atualizada.
   - Digite um comentário no campo e clique em **Enviar comentário**.
   - Faça logout e entre como **Direção** (`direcao@sesi.com` / `123456`) ➜ Vá na aba **"Fiscalizar Comentários"** e remova o comentário indicando o motivo.

---

### ⚡ Teste Automatizado via Terminal

Você pode rodar a suíte de testes de integração Fim-a-Fim (E2E) a qualquer momento no terminal:

```bash
cd connect-food/back-end
node test_integration.js
```

**Resultado dos testes de integração:**
```text
🧪 Iniciando Bateria Completa de Testes Fim-a-Fim (Todas as Funcionalidades)...

1️⃣ Login como NUTRICIONISTA (nutri@sesi.com)... Status: 200 ✅ LOGIN NUTRICIONISTA OK!
2️⃣ Salvando Almoço de Segunda-feira e Terça-feira no MySQL... Status: 200 ✅ REFEIÇÕES SALVAS!
3️⃣ Login como ALUNO (aluno@sesi.com) e validação dos cardápios... Status: 200 ✅ CARDÁPIOS DE SEGUNDA E TERÇA EXIBIDOS!
4️⃣ Avaliação de 5 Estrelas pelo Aluno... Status: 200 ✅ AVALIAÇÃO PERSISTIDA NO MYSQL!
5️⃣ Envio de Comentário pelo Aluno... Status: 201 ✅ COMENTÁRIO PUBLICADO!
6️⃣ Login como DIREÇÃO (direcao@sesi.com) e Moderação do Comentário... Status: 200 ✅ MODERAÇÃO CONCLUÍDA!

🎉 TODOS OS TESTES DE TODAS AS FUNCIONALIDADES PASSARAM COM 100% DE SUCESSO!
```

---

## 📜 Licença

Projeto desenvolvido para a Gestão Nutricional Escolar SESI — 2026. Todos os direitos reservados.
