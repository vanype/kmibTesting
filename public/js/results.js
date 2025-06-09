document.addEventListener("DOMContentLoaded", async () => {
    const resultText = document.getElementById("result-text");
    const rateText = document.getElementById("rate-text");
    const storedResults = localStorage.getItem("testResults");

    if (!storedResults) {
        resultText.textContent = "Нет данных о результатах.";
        return;
    }

    const { correct, total } = JSON.parse(storedResults);
    resultText.textContent = `Вы ответили правильно на ${correct/total*100}% вопросов! 🎉`; 
	const rate = Math.round((5 / total) * correct);
    rateText.textContent = `Ваша оценка - ${rate} !`; 
	
	const saveData = {
		user_id: localStorage.getItem("user_id"), // например, id пользователя из localStorage или сессии
		test_name: localStorage.getItem("selectedGroup"),
		score: correct,
		total: total
	};

	fetch("questions/results", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(saveData)
	})
	.then(res => res.json())
	.then(data => {
		console.log("Результат сохранён:", data);
	})
	.catch(error => {
		console.error("Ошибка сохранения:", error);
	});

	
    // Очищаем данные, чтобы результаты не повторялись при следующем тесте
    localStorage.removeItem("testResults");
});
