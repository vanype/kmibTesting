// Функция для проверки авторизации
async function submitAnswers(event) {
	event.preventDefault(); // предотвращаем стандартное поведение формы

	const login = document.getElementById("InputEmail").value.trim();
	const pass = document.getElementById("InputPassword").value;

	console.log("Логин:", login);
	console.log("Пароль:", pass);
	console.log("JSON:", JSON.stringify({ username: login, password: pass }));

	if (!login) {
		alert("Вы не ввели логин!");
		return;
	}

	if (!pass) {
		alert("Вы не ввели пароль!");
		return;
	}

	try {
		const response = await fetch("http://192.168.0.126:3000/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: login, password: pass })
		});

		const result = await response.json();
		console.log(result);

		if (response.ok) {
			alert("Успешный вход!");
			window.location.href = "profile.html";
		} else {
			alert("Ошибка авторизации: " + (result.message || "неизвестная ошибка"));
		}
	} catch (error) {
		console.error("Ошибка отправки запроса:", error);
		alert("Не удалось авторизоваться.");
	}
}

document.getElementById("submit-login").addEventListener("click", submitAnswers);