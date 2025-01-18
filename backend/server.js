const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Настройка CORS
app.use(cors({
    origin: "*", // Разрешаем доступ со всех источников
    methods: ["GET", "POST"], // Разрешаем только GET и POST
    allowedHeaders: ["Content-Type"] // Разрешаем заголовок Content-Type
}));

app.use(express.json());

const ordersFile = "orders.json";

// Загружаем заказы из файла (если файл есть)
const loadOrders = () => {
    if (fs.existsSync(ordersFile)) {
        return JSON.parse(fs.readFileSync(ordersFile));
    }
    return [];
};

// Сохраняем заказы в файл
const saveOrders = (orders) => {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
};

// Получить список всех заказов
app.get("/orders", (req, res) => {
    res.json(loadOrders());
});

// Создать новый заказ
app.post("/orders", (req, res) => {
    const orders = loadOrders();
    const newOrder = {
        id: orders.length + 1,
        description: req.body.description,
        wallet: req.body.wallet,
        status: "Pending"
    };
    orders.push(newOrder);
    saveOrders(orders);
    res.json({ success: true, order: newOrder });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
