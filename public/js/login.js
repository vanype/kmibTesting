//Функция для проверки авторизации
async function submitAnswers() {
	
	const login = document.getElementById("InputEmail").value;
	const pass = document.getElementById("InputPassword").value;

    if (!login) 
	{
        alert("Вы не ввели логин!");
        return;
    }

    try {
        const response = await fetch("http://192.168.0.126:3000/submit-answers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group: localStorage.getItem("selectedGroup"), answers })
        });

        const result = await response.json();
        localStorage.setItem("testResults", JSON.stringify(result));

        window.location.href = "results.html";
    } catch (error) {
        console.error("Ошибка отправки ответов:", error);
        alert("Не удалось отправить ответы.");
    }
}

document.getElementById("submit-login").addEventListener("click", submitAnswers);