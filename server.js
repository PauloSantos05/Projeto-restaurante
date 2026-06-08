const express = require('express');
const mysql   = require('mysql2');
const bcrypt  = require('bcrypt');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve seus arquivos HTML/CSS/JS

const db = mysql.createConnection({
  host:     'localhost',
  user:     'yuan_user',         // seu usuário MariaDB
  password: 'yuan123',   // sua senha MariaDB
  database: 'yuan'
});

// Cria a tabela se não existir
db.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    nome     VARCHAR(100) NOT NULL,
    email    VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    senha    VARCHAR(255) NOT NULL
  )
`);

// ── CADASTRO ──
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, telefone, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  db.query(
    'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
    [nome, email, telefone, hash],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY')
          return res.status(409).json({ erro: 'E-mail já cadastrado.' });
        return res.status(500).json({ erro: 'Erro ao cadastrar.' });
      }
      res.json({ ok: true });
    }
  );
});

// ── LOGIN ──
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, rows) => {
    if (err || rows.length === 0)
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

    const senhaCorreta = await bcrypt.compare(senha, rows[0].senha);
    if (!senhaCorreta)
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

    res.json({ ok: true, nome: rows[0].nome });
  });
});

app.listen(3000, () => console.log('Yuan rodando em http://localhost:3000'));