function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (match) => {
        const escapes = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return escapes[match];
    });
}


async function loadQuestions() {
    try {
        const test = localStorage.getItem("selectedGroup"); // Получаем выбранную группу
        const user_group = localStorage.getItem("group"); // Получаем выбранную группу
        if (!test) {
            alert("Группа не выбрана! Вернитесь на главную страницу и выберите группу.");
            return;
        }

        const response = await fetch(`/questions?group=${encodeURIComponent(test)}&user_group=${encodeURIComponent(user_group)}`);

        const questions = await response.json();
        const container = document.getElementById("questions-container");
        container.innerHTML = "";

        if (questions.length === 0) {
            container.innerHTML = "<p>Нет доступных вопросов для этой группы.</p>";
            return;
        }

        questions.forEach((q, index) => {
            const questionBlock = document.createElement("div");
            questionBlock.classList.add("mb-3");
            questionBlock.innerHTML = `
				<p><strong>${index + 1}. <q>${escapeHTML(q.question)}</q></strong></p>
				${q.answers.map(answer => `
					<div class="form-check">
						<input class="form-check-input" type="radio" name="question${q.id}" value="${escapeHTML(answer)}" required>
						<label class="form-check-label">${escapeHTML(answer)}</label>
					</div>
				`).join('')}
			`;

            container.appendChild(questionBlock);
        });

    } catch (error) {
        console.error("Ошибка загрузки вопросов:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadQuestions);

//Функция для отправки ответов
async function submitAnswers() {
    const answers = [];
    document.querySelectorAll(".mb-3").forEach(q => {
        const input = q.querySelector("input:checked");
        if (input) {
            answers.push({
                question: q.querySelector("q").textContent,
                answer: input.value
            });
        }
    });

    if (answers.length === 0) {
        alert("Вы не ответили ни на один вопрос!");
        return;
    }

    try {
        const response = await fetch("/questions/submit-answers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group: localStorage.getItem("selectedGroup"), answers })
        });
		
		console.log({ group: localStorage.getItem("selectedGroup"), answers });
		
        const result = await response.json();
        localStorage.setItem("testResults", JSON.stringify(result));

        window.location.href = "results.html";
    } catch (error) {
        console.error("Ошибка отправки ответов:", error);
        alert("Не удалось отправить ответы.");
    }
}

document.getElementById("submit-test").addEventListener("click", submitAnswers);
