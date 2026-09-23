const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.alpzoylebgrtevlzbeev',
  password: 'Artik1337228',
  ssl: {
    rejectUnauthorized: false
  },
  family: 4
});

// Перехват ошибок пула, чтобы сервер не падал
pool.on('error', (err) => {
  console.error('Неожиданная ошибка базы данных:', err);
});

// Проверка подключения
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

// Используем порт от Render или стандартный 3000
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
});
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
