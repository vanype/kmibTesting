const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("test_database.db", (err) => {
    if (err) {
        console.error("❌ Ошибка подключения к базе данных:", err.message);
    } else {
        console.log("✅ База данных подключена!");
    }
});

// Функция создания таблицы пользователей
function createUsersTable() {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT "user"
        )`,
        (err) => {
            if (err) {
                console.error("❌ Ошибка создания таблицы users:", err.message);
            } else {
                console.log("✅ Таблица users проверена/создана");
            }
        }
    );
}

// Запускаем создание таблиц при инициализации
createUsersTable();

module.exports = db;
