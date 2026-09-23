const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  family: 4 // Жестко принуждает использовать только IPv4
});

// Проверка подключения к базе данных
pool.connect((err, client, release) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.stack);
  } else {
    console.log('Успешно подключено к базе данных PostgreSQL!');
    release();
  }
});

app.get('/', (req, res) => {
  res.send('Fish Game Backend is running!');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
