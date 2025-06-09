// Функция для проверки авторизации
async function submitAnswers(event) {
	event.preventDefault(); // предотвращаем стандартное поведение формы

	const login = document.getElementById("InputEmail").value.trim();
	const pass = document.getElementById("InputPassword").value;



	if (!login) {
		alert("Вы не ввели логин!");
		return;
	}

	if (!pass) {
		alert("Вы не ввели пароль!");
		return;
	}

	try {
		const response = await fetch("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: login, password: pass })
		});

		const result = await response.json();
		console.log(result);
	

		if (response.ok) {
			alert("Успешный вход!");
			console.log(result.user.group);
			localStorage.setItem("group", result.user.group);
			localStorage.setItem("username", result.user.username);
			localStorage.setItem("user_id", result.user.user_id);
			if(result.user.role == "admin") window.location.href = "admin.html";
			else window.location.href = "profile.html";
			
		} else {
			alert("Не удалось войти");
		}
	} catch (error) {
		console.error("Ошибка отправки запроса:", error);
		alert("Не удалось авторизоваться.");
	}
}

document.getElementById("submit-login").addEventListener("click", submitAnswers);