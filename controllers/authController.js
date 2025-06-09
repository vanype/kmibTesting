const AuthModel = require("../models/authModel");

const bcrypt = require("bcrypt"); // Подключаем bcrypt

exports.registerUser = (req, res) => {
    const { user_login, user_password, user_role, user_group } = req.body;

    if (!user_login || !user_password) {
        return res.status(400).json({ error: "Все поля обязательны!" });
    }

    AuthModel.create_user(req.body, (err, id) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, message: "Новый пользователь добавлен!" });
    });
};

exports.getUser = (req, res) => {
    const username = req.query.username;

    AuthModel.getUser(username, (err, users) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        res.json(
            Array.isArray(users)
                ? users.map(user => ({ username: user.login, role
				: user.role, user_password: user.password }))
                : { username: users.login, role: users.role, user_password: user.password }
        );
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Введите логин и пароль" });
    }

    AuthModel.getUser(username, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Неверный логин или пароль" });

        // Проверяем пароль
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(401).json({ error: "Неверный логин или пароль" });

            // Если пароль правильный, можно выдать токен или просто вернуть успех
            res.json({ message: "Успешный вход!", user: { username: user.login, user_id:user.id, role: user.role, group: user.group } });
        });
    });
};

