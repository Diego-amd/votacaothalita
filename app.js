const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configurar conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'viaduct.proxy.rlwy.net',
  user: 'root',
  password: '6$lzvj64kxe63dh0ovqp3tirpy$9d76z',
  database: 'railway',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Configurar middleware para lidar com JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definir rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota para processar o nome da escola
app.post('/verificar-escola', (req, res) => {
  const { nomeEscola } = req.body;

  // Consultar o banco de dados MySQL para verificar os votos da escola
  db.query('SELECT votos FROM tb_votacao WHERE nome_escola = ?', [nomeEscola], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      res.status(500).json({ error: 'Erro ao consultar o banco de dados.' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Escola não encontrada.' });
      return;
    }

    res.json({ votos: results[0].votos });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
