const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("test_database.db", (err) => {
    if (err) {
        console.error("❌ Ошибка подключения к базе данных:", err.message);
    } else {
        console.log("✅ База данных подключена!");
    }
});

module.exports = db;
