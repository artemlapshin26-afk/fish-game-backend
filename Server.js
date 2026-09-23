const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// СЮДА ВСТАВЬТЕ ТОКЕН ВАШЕГО БОТА (полученный у @BotFather)
const BOT_TOKEN = "8522943994:AAGn_2crI48ae6cHzRclYpJquZkKaZxOvgY"; 

// Подключение к базе данных PostgreSQL в Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/fish_game',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Создаем таблицу с текстовым ключом для поддержки любых ID
pool.query(`
  CREATE TABLE IF NOT EXISTS players (
    telegram_id TEXT PRIMARY KEY,
    inventory JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// 1. Эндпоинт для загрузки
app.get('/api/load/:telegram_id', async (req, res) => {
  const telegramId = req.params.telegram_id.replace('tg_', '');

  try {
    const result = await pool.query('SELECT inventory FROM players WHERE telegram_id = $1', [telegramId]);
    if (result.rows.length > 0) {
      res.json({ success: true, inventory: result.rows[0].inventory });
    } else {
      res.json({ success: true, inventory: {} });
    }
  } catch (err) {
    console.error('Ошибка загрузки:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// 2. Эндпоинт для сохранения
app.post('/api/save', async (req, res) => {
  const { userId, inventory } = req.body;
  const telegramId = String(userId).replace('tg_', '');

  try {
    const query = `
      INSERT INTO players (telegram_id, inventory, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (telegram_id) 
      DO UPDATE SET 
        inventory = EXCLUDED.inventory,
        updated_at = NOW();
    `;
    await pool.query(query, [telegramId, JSON.stringify(inventory)]);
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка сохранения:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// 3. Эндпоинт для создания ссылки на оплату Telegram Stars
app.post('/api/create-invoice', async (req, res) => {
    // Принимаем данные, которые присылает клиент
    const { title, description, payload, stars } = req.body;

    if (!title || !stars) {
        return res.status(400).json({ success: false, error: 'Не указаны обязательные параметры инвойса' });
    }

    const invoiceData = {
        title: title,
        description: description || title,
        payload: payload || 'default_payload',
        provider_token: "", // Для Telegram Stars всегда пустая строка!
        currency: "XTR",     // Обязательно XTR для Telegram Stars
        prices: [{ label: title, amount: Number(stars) }] // Сумма в звездах
    };

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoiceData)
        });
        
        const data = await response.json();
        
        if (data.ok) {
            res.json({ success: true, invoiceLink: data.result });
        } else {
            console.error('Telegram API Error:', data);
            res.status(500).json({ success: false, error: data.description || 'Telegram API error' });
        }
    } catch (err) {
        console.error('Ошибка создания инвойса:', err);
        res.status(500).json({ success: false, error: "Ошибка сервера" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
