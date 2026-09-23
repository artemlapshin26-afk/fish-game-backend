const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Используем стандартную переменную окружения DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  family: 4
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
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
