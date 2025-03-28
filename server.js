const express = require("express");
const cors = require("cors");
const path = require("path");

const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes"); // Подключаем роуты

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/questions", questionRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "192.168.0.126", () => {
    console.log(`✅ Сервер запущен на http://192.168.0.126:${PORT}`);
});
