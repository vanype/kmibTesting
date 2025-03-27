document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addQuestionForm");
    const correctAnswerSelect = document.getElementById("correctAnswer");

    // Автоматически обновлять список правильных ответов
    function updateCorrectAnswerOptions() {
        const answers = [
            document.getElementById("answer1").value,
            document.getElementById("answer2").value,
            document.getElementById("answer3").value
        ];
        correctAnswerSelect.innerHTML = '<option value="" disabled selected>Выберите правильный ответ</option>';
        answers.forEach(answer => {
            if (answer.trim() !== "") {
                const option = document.createElement("option");
                option.value = answer;
                option.textContent = answer;
                correctAnswerSelect.appendChild(option);
            }
        });
    }

    document.getElementById("answer1").addEventListener("input", updateCorrectAnswerOptions);
    document.getElementById("answer2").addEventListener("input", updateCorrectAnswerOptions);
    document.getElementById("answer3").addEventListener("input", updateCorrectAnswerOptions);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const question = document.getElementById("question").value.trim();
        const answer1 = document.getElementById("answer1").value.trim();
        const answer2 = document.getElementById("answer2").value.trim();
        const answer3 = document.getElementById("answer3").value.trim();
        const correctAnswer = correctAnswerSelect.value.trim();
        const group = document.getElementById("group").value;

        if (!question || !answer1 || !answer2 || !answer3 || !correctAnswer || !group) {
            alert("Заполните все поля!");
            return;
        }

        const data = { question, answer_1: answer1, answer_2: answer2, answer_3: answer3, correct_answer: correctAnswer, group_name: group };

        try {
            const response = await fetch("http://192.168.0.126:3000/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            document.getElementById("message").textContent = result.message;
            form.reset();
            updateCorrectAnswerOptions();
        } catch (error) {
            console.error("Ошибка добавления вопроса:", error);
            document.getElementById("message").textContent = "Ошибка при добавлении вопроса.";
        }
    });
});
