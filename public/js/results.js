document.addEventListener("DOMContentLoaded", async () => {
    const resultText = document.getElementById("result-text");
    const rateText = document.getElementById("rate-text");
    const storedResults = localStorage.getItem("testResults");

    if (!storedResults) {
        resultText.textContent = "Нет данных о результатах.";
        return;
    }

    const { correct, total } = JSON.parse(storedResults);
    resultText.textContent = `Вы ответили правильно на ${correct} из ${total} вопросов! 🎉`; 
	const rate = Math.round((5 / total) * correct);
    rateText.textContent = `Ваша оценка - ${rate} !`; 

    // Очищаем данные, чтобы результаты не повторялись при следующем тесте
    localStorage.removeItem("testResults");
});
