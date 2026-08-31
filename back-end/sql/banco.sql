CREATE DATABASE connect_food;

SELECT user, host FROM mysql.user;

CREATE USER 'api'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON connect_food.* TO 'api'@'%';
FLUSH PRIVILEGES;

CREATE TABLE usuarios (
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

CREATE TABLE restricoes_alimentares (
    id_restricao INT AUTO_INCREMENT PRIMARY KEY,
    nome_restricao VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuario_restricao (
    id_usuario INT NOT NULL,
    id_restricao INT NOT NULL,
    PRIMARY KEY (id_usuario, id_restricao),
    CONSTRAINT fk_usuario_restricao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_restricao_restricao FOREIGN KEY (id_restricao) REFERENCES restricoes_alimentares(id_restricao) ON DELETE CASCADE
);

CREATE TABLE cardapios (
    id_cardapio INT AUTO_INCREMENT PRIMARY KEY,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    tipo ENUM('PADRAO', 'ADAPTADO') NOT NULL DEFAULT 'PADRAO',
    observacoes VARCHAR(255),
    status BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cardapio_restricao (
    id_cardapio INT NOT NULL,
    id_restricao INT NOT NULL,
    PRIMARY KEY (id_cardapio, id_restricao),
    CONSTRAINT fk_cardapio_restricao_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE,
    CONSTRAINT fk_cardapio_restricao_restricao FOREIGN KEY (id_restricao) REFERENCES restricoes_alimentares(id_restricao) ON DELETE CASCADE
);

CREATE TABLE refeicoes (
    id_refeicao INT AUTO_INCREMENT PRIMARY KEY,
    id_cardapio INT NOT NULL,
    tipo_refeicao ENUM('CAFE_DA_MANHA', 'ALMOCO', 'CAFE_DA_TARDE') NOT NULL,
    data_refeicao DATE NOT NULL,
    CONSTRAINT fk_refeicao_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE
);

CREATE TABLE alimentos (
    id_alimento INT AUTO_INCREMENT PRIMARY KEY,
    nome_alimento VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    calorias DECIMAL(8,2)
);

CREATE TABLE refeicao_alimento (
    id_refeicao INT NOT NULL,
    id_alimento INT NOT NULL,
    quantidade VARCHAR(50),
    PRIMARY KEY (id_refeicao, id_alimento),
    CONSTRAINT fk_refeicao_alimento_refeicao FOREIGN KEY (id_refeicao) REFERENCES refeicoes(id_refeicao) ON DELETE CASCADE,
    CONSTRAINT fk_refeicao_alimento_alimento FOREIGN KEY (id_alimento) REFERENCES alimentos(id_alimento) ON DELETE CASCADE
);

CREATE TABLE avaliacoes (
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

CREATE TABLE comentarios (
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

CREATE TABLE recuperacao_senha (
    id_recuperacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    codigo VARCHAR(255) NOT NULL,
    data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    utilizado BOOLEAN DEFAULT FALSE,
    data_utilizacao DATETIME NULL,
    CONSTRAINT fk_recuperacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE log_acoes (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    acao VARCHAR(255) NOT NULL,
    data_acao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);