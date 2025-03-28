const db = require("../config/db");

const bcrypt = require("bcrypt"); // Подключаем bcrypt
const SALT_ROUNDS = 10; // Количество раундов для хеширования

function create_user(userData, callback) {
    const { user_login, user_password, user_role = "user" } = userData; // Значение по умолчанию "user"

    db.get("SELECT id FROM users WHERE login = ?", [user_login], (err, row) => {
        if (err) return callback(err);
        if (row) return callback(new Error("Пользователь с таким логином уже существует"));

        // Хешируем пароль перед сохранением
        bcrypt.hash(user_password, SALT_ROUNDS, (err, hashedPassword) => {
            if (err) return callback(err);

            db.run(
                `INSERT INTO users (login, password, role) VALUES (?, ?, ?)`,
                [user_login, hashedPassword, user_role],
                function (err) {
                    if (err) return callback(err);
                    callback(null, this.lastID);
                }
            );
        });
    });
}




function login(userData, callback)
{
	const { user_login, user_password } = userData;
	 db.get("SELECT password FROM users WHERE login = ?", [user_login], (err, row) => {
        if (err) return callback(err);
        if (!row) return callback(new Error("Пользователь не найден"));

        // Сравниваем введенный пароль с хешированным в базе
        bcrypt.compare(user_password, row.password, (err, isMatch) => {
            if (err) return callback(err);
            if (!isMatch) return callback(new Error("Неверный пароль"));

            callback(null, true); // Пароль верный
        });
	})
}


function getUser(username, callback) {
    if (!username) {
        // Если логин не указан — вернуть всех пользователей
        db.all("SELECT login, role, password FROM users", [], (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(null, rows);
        });
    } else {
        // Ищем конкретного пользователя
        db.get("SELECT login, role, password FROM users WHERE login = ?", [username], (err, row) => {
            if (err) {
                return callback(err);
            }
            return callback(null, row);
        });
    }
}


module.exports = { create_user, getUser, login };