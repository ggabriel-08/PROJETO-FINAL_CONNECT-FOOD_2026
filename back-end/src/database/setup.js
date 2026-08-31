import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  console.log('Iniciando configuração do banco de dados MySQL...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS connect_food CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  await connection.query('USE connect_food;');
  console.log('Banco de dados "connect_food" selecionado/criado.');

  const createTablesQueries = [
    `CREATE TABLE IF NOT EXISTS usuarios (
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
    );`,

    `CREATE TABLE IF NOT EXISTS restricoes_alimentares (
      id_restricao INT AUTO_INCREMENT PRIMARY KEY,
      nome_restricao VARCHAR(100) NOT NULL,
      descricao VARCHAR(255),
      status BOOLEAN DEFAULT TRUE
    );`,

    `CREATE TABLE IF NOT EXISTS usuario_restricao (
      id_usuario INT NOT NULL,
      id_restricao INT NOT NULL,
      PRIMARY KEY (id_usuario, id_restricao),
      CONSTRAINT fk_usuario_restricao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
      CONSTRAINT fk_usuario_restricao_restricao FOREIGN KEY (id_restricao) REFERENCES restricoes_alimentares(id_restricao) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS cardapios (
      id_cardapio INT AUTO_INCREMENT PRIMARY KEY,
      data_inicio DATE NOT NULL,
      data_fim DATE NOT NULL,
      tipo ENUM('PADRAO', 'ADAPTADO') NOT NULL DEFAULT 'PADRAO',
      observacoes VARCHAR(255),
      status BOOLEAN DEFAULT TRUE,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS cardapio_restricao (
      id_cardapio INT NOT NULL,
      id_restricao INT NOT NULL,
      PRIMARY KEY (id_cardapio, id_restricao),
      CONSTRAINT fk_cardapio_restricao_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE,
      CONSTRAINT fk_cardapio_restricao_restricao FOREIGN KEY (id_restricao) REFERENCES restricoes_alimentares(id_restricao) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS refeicoes (
      id_refeicao INT AUTO_INCREMENT PRIMARY KEY,
      id_cardapio INT NOT NULL,
      tipo_refeicao ENUM('CAFE_DA_MANHA', 'ALMOCO', 'CAFE_DA_TARDE') NOT NULL,
      data_refeicao DATE NOT NULL,
      CONSTRAINT fk_refeicao_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS alimentos (
      id_alimento INT AUTO_INCREMENT PRIMARY KEY,
      nome_alimento VARCHAR(100) NOT NULL,
      descricao VARCHAR(255),
      calorias DECIMAL(8,2)
    );`,

    `CREATE TABLE IF NOT EXISTS refeicao_alimento (
      id_refeicao INT NOT NULL,
      id_alimento INT NOT NULL,
      quantidade VARCHAR(50),
      PRIMARY KEY (id_refeicao, id_alimento),
      CONSTRAINT fk_refeicao_alimento_refeicao FOREIGN KEY (id_refeicao) REFERENCES refeicoes(id_refeicao) ON DELETE CASCADE,
      CONSTRAINT fk_refeicao_alimento_alimento FOREIGN KEY (id_alimento) REFERENCES alimentos(id_alimento) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS avaliacoes (
      id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
      id_usuario INT NOT NULL,
      id_cardapio INT NOT NULL,
      nota INT NOT NULL,
      data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT chk_nota CHECK (nota BETWEEN 1 AND 5),
      CONSTRAINT fk_avaliacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
      CONSTRAINT fk_avaliacao_cardapio FOREIGN KEY (id_cardapio) REFERENCES cardapios(id_cardapio) ON DELETE CASCADE,
      CONSTRAINT uk_avaliacao_usuario_cardapio UNIQUE (id_usuario, id_cardapio)
    );`,

    `CREATE TABLE IF NOT EXISTS comentarios (
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
    );`,

    `CREATE TABLE IF NOT EXISTS recuperacao_senha (
      id_recuperacao INT AUTO_INCREMENT PRIMARY KEY,
      id_usuario INT NOT NULL,
      codigo VARCHAR(255) NOT NULL,
      data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_expiracao DATETIME NOT NULL,
      utilizado BOOLEAN DEFAULT FALSE,
      data_utilizacao DATETIME NULL,
      CONSTRAINT fk_recuperacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS log_acoes (
      id_log INT AUTO_INCREMENT PRIMARY KEY,
      id_usuario INT NOT NULL,
      acao VARCHAR(255) NOT NULL,
      data_acao DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
    );`
  ];

  for (const query of createTablesQueries) {
    await connection.query(query);
  }
  console.log('Tabelas criadas com sucesso!');

  // Seed Users
  const defaultPasswordHash = await bcrypt.hash('123456', 10);
  
  const usersToInsert = [
    { nome: 'Direção SESI', cpf: '11111111111', email: 'direcao@sesi.com', senha: defaultPasswordHash, perfil: 'DIRECAO', ano_escolar: null },
    { nome: 'Dra. Marina Alves', cpf: '22222222222', email: 'nutri@sesi.com', senha: defaultPasswordHash, perfil: 'NUTRICIONISTA', ano_escolar: null },
    { nome: 'Carlos Eduardo', cpf: '33333333333', email: 'aluno@sesi.com', senha: defaultPasswordHash, perfil: 'ALUNO', ano_escolar: '1º ano' },
    { nome: 'Ana Clara Souza', cpf: '44444444444', email: 'anaclara@sesi.com', senha: defaultPasswordHash, perfil: 'ALUNO', ano_escolar: '2º ano' }
  ];

  for (const u of usersToInsert) {
    await connection.query(
      `INSERT INTO usuarios (nome, cpf, email, senha, perfil, ano_escolar, status)
       VALUES (?, ?, ?, ?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha = VALUES(senha), perfil = VALUES(perfil);`,
      [u.nome, u.cpf, u.email, u.senha, u.perfil, u.ano_escolar]
    );
  }

  // Seed Restrictions
  const restrictionsToInsert = [
    { nome: 'Intolerância à Lactose', descricao: 'Evitar derivados do leite com lactose' },
    { nome: 'Sem Glúten', descricao: 'Evitar trigo, aveia, cevada e derivados' },
    { nome: 'Alergia a Amendoim', descricao: 'Evitar amendoim e oleaginosas' }
  ];

  for (const r of restrictionsToInsert) {
    await connection.query(
      `INSERT INTO restricoes_alimentares (nome_restricao, descricao, status)
       SELECT ?, ?, TRUE WHERE NOT EXISTS (SELECT 1 FROM restricoes_alimentares WHERE nome_restricao = ?);`,
      [r.nome, r.descricao, r.nome]
    );
  }

  // Link Carlos (aluno@sesi.com) to Lactose restriction
  const [alunoRows] = await connection.query('SELECT id_usuario FROM usuarios WHERE email = ?', ['aluno@sesi.com']);
  const [restrRows] = await connection.query('SELECT id_restricao FROM restricoes_alimentares WHERE nome_restricao = ?', ['Intolerância à Lactose']);
  
  if (alunoRows.length > 0 && restrRows.length > 0) {
    await connection.query(
      `INSERT IGNORE INTO usuario_restricao (id_usuario, id_restricao) VALUES (?, ?);`,
      [alunoRows[0].id_usuario, restrRows[0].id_restricao]
    );
  }

  // Seed Initial Foods into `alimentos`
  const foodsToInsert = [
    { nome: 'Arroz com cenoura', calorias: 150 },
    { nome: 'Feijão preto', calorias: 120 },
    { nome: 'Grelhado de frango', calorias: 180 },
    { nome: 'Salada de alface e tomate', calorias: 30 },
    { nome: 'Pão integral', calorias: 110 },
    { nome: 'Suco de laranja natural', calorias: 90 },
    { nome: 'Maçã', calorias: 60 },
    { nome: 'Bolo de banana', calorias: 160 }
  ];

  for (const f of foodsToInsert) {
    await connection.query(
      `INSERT INTO alimentos (nome_alimento, calorias)
       SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM alimentos WHERE nome_alimento = ?);`,
      [f.nome, f.calorias, f.nome]
    );
  }

  // Seed Cardápio & Refeições
  const [cardapioRows] = await connection.query('SELECT id_cardapio FROM cardapios LIMIT 1');
  let cardapioId;
  if (cardapioRows.length === 0) {
    const [cRes] = await connection.query(
      `INSERT INTO cardapios (data_inicio, data_fim, tipo, observacoes, status)
       VALUES (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'PADRAO', 'Cardápio semanal padrão SESI', TRUE);`
    );
    cardapioId = cRes.insertId;
  } else {
    cardapioId = cardapioRows[0].id_cardapio;
  }

  // Seed default meal for Almoco
  const [mealRows] = await connection.query('SELECT id_refeicao FROM refeicoes WHERE id_cardapio = ? AND tipo_refeicao = "ALMOCO"', [cardapioId]);
  let mealId;
  if (mealRows.length === 0) {
    const [mRes] = await connection.query(
      `INSERT INTO refeicoes (id_cardapio, tipo_refeicao, data_refeicao)
       VALUES (?, 'ALMOCO', CURDATE());`,
      [cardapioId]
    );
    mealId = mRes.insertId;
  } else {
    mealId = mealRows[0].id_refeicao;
  }

  // Link foods to meal
  const [allFoods] = await connection.query('SELECT id_alimento FROM alimentos LIMIT 4');
  for (const food of allFoods) {
    await connection.query(
      'INSERT IGNORE INTO refeicao_alimento (id_refeicao, id_alimento) VALUES (?, ?)',
      [mealId, food.id_alimento]
    );
  }

  // Seed Comentários
  const [comentRows] = await connection.query('SELECT id_comentario FROM comentarios LIMIT 1');
  if (comentRows.length === 0 && alunoRows.length > 0) {
    await connection.query(
      `INSERT INTO comentarios (id_usuario, id_cardapio, comentario, status)
       VALUES (?, ?, 'A merenda hoje estava ótima! O suco de laranja bem fresco.', 'ATIVO');`,
      [alunoRows[0].id_usuario, cardapioId]
    );
  }

  console.log('Configuração do banco de dados e dados de teste concluídos com sucesso!');
  await connection.end();
}

setupDatabase().catch((err) => {
  console.error('Erro na execução do setup do banco:', err);
  process.exit(1);
});
