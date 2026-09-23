const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Передаем параметры подключения отдельно, чтобы избежать ошибок парсинга строки
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
