const express = require("express");
const cors = require("cors");
const path = require("path");

const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 📌 Роут на главную страницу (вручную отправляем login.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 📦 Статические файлы
app.use(express.static(path.join(__dirname, "public")));

// 🧭 Роуты
app.use("/questions", questionRoutes);
app.use("/auth", authRoutes);

// 🟢 Запуск сервера
app.listen(PORT, "192.168.0.126", () => {
    console.log(`✅ Сервер запущен на http://192.168.0.126:${PORT}`);
});
