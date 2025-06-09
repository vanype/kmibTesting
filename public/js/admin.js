document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addQuestionForm");
  const correctAnswerSelect = document.getElementById("correctAnswer");
  const groupFilter = document.getElementById("groupFilter");
  const questionsList = document.getElementById("questionsList");
  const addQuestionForm = document.getElementById("addQuestionForm");
  const messageDiv = document.getElementById("message");
  const addUserForm = document.getElementById("addUserForm");
  const userList = document.getElementById("userList");


	// Пример массива групп (замени на реальный источник)
const groups = ['POB-32','POB-31'];

function updateUserGroupSelect() {
  const select = document.getElementById('userGroupSelect');
  // Очистим текущие опции, кроме первой
  select.length = 1; // оставляем только placeholder
  
  groups.forEach(group => {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group;
    select.appendChild(option);
  });
}
  // Обновление вариантов правильных ответов
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

  // Экранирование HTML
  function escapeHTML(text) {
    return text.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  // Загрузка предметов (групп)
  async function loadGroups() {
    try {
      const groups = ["Веб-разработка", "Базы данных", "Кибербезопасность", "JavaScript", "Веб-технологии"];
      groupFilter.innerHTML = `<option value="all">Все группы</option>`;
      groups.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g;
        opt.textContent = g;
        groupFilter.appendChild(opt);
      });
    } catch (error) {
      console.error(error);
      groupFilter.innerHTML = `<option value="all">Ошибка загрузки групп</option>`;
    }
  }

  // Загрузка вопросов
  async function loadQuestions() {
    try {
      const group = groupFilter.value;
      if (!group || group === "all") {
        questionsList.innerHTML = "<p>Пожалуйста, выберите группу (предмет).</p>";
        return;
      }

      const user_group = document.getElementById("user_group").value.trim() || "";
      const url = `/questions?group=${encodeURIComponent(group)}&user_group=${encodeURIComponent(user_group)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      const questions = await response.json();

      if (questions.length === 0) {
        questionsList.innerHTML = "<p>Нет доступных вопросов.</p>";
        return;
      }

      questionsList.innerHTML = "";
      questions.forEach((q, i) => {
        const div = document.createElement("div");
        div.classList.add("mb-3", "p-3", "border", "rounded");
        div.innerHTML = `
          <strong>${i + 1}. ${escapeHTML(q.question)}</strong>
          <ul>${q.answers.map(a => `<li>${escapeHTML(a)}</li>`).join("")}</ul>
        `;
        questionsList.appendChild(div);
      });
    } catch (error) {
      console.error("Ошибка загрузки вопросов:", error);
      questionsList.innerHTML = `<p class="text-danger">Ошибка: ${error.message}</p>`;
    }
  }


// Вызови эту функцию при загрузке страницы или когда обновляются группы
document.addEventListener('DOMContentLoaded', updateUserGroupSelect);
	
  // Обработчик добавления вопроса
  addQuestionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const question = document.getElementById("question").value.trim();
    const answer1 = document.getElementById("answer1").value.trim();
    const answer2 = document.getElementById("answer2").value.trim();
    const answer3 = document.getElementById("answer3").value.trim();
    const correctAnswer = correctAnswerSelect.value;
    const group_name = document.getElementById("group").value.trim();
    const user_group = document.getElementById("user_group").value.trim();

    if (!question || !answer1 || !answer2 || !answer3 || !correctAnswer || !group_name || !user_group) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    const data = {
      question,
      answer_1: answer1,
      answer_2: answer2,
      answer_3: answer3,
      correct_answer: correctAnswer,
      group_name,
      user_group,
    };

    try {
      const response = await fetch("/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const result = await response.json();

      messageDiv.textContent = result.message || "Вопрос успешно добавлен!";
      messageDiv.className = "text-success mt-3";
      addQuestionForm.reset();
      updateCorrectAnswerOptions();
      loadQuestions();
    } catch (error) {
      console.error("Ошибка:", error);
      messageDiv.textContent = "Ошибка при добавлении вопроса.";
      messageDiv.className = "text-danger mt-3";
    }
  });

 // ✅ Добавление пользователя
addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user_login = document.getElementById("username").value.trim();
  const user_password = document.getElementById("password").value.trim();
  const user_role = document.getElementById("role").value;
  const user_group = document.getElementById("userGroupSelect").value;  // новое поле

  if (!user_login || !user_password || !user_role || !user_group) {
    alert("Пожалуйста, заполните все поля!");
    return;
  }

  try {
    const response = await fetch("auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_login, user_password, user_role, user_group }),
    });

    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
    const result = await response.json();

    messageDiv.textContent = result.message || "Пользователь добавлен!";
    messageDiv.className = "text-success mt-3";
    addUserForm.reset();
    loadUsers();
  } catch (error) {
    console.error("Ошибка добавления пользователя:", error);
    messageDiv.textContent = "Ошибка при добавлении пользователя.";
    messageDiv.className = "text-danger mt-3";
  }
});


  // ✅ Загрузка пользователей
async function loadUsers() {
  try {
    const response = await fetch("/auth/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}) // Пустое тело для получения всех
    });

    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

    const users = await response.json();
    userList.innerHTML = "";

    if (users.length === 0) {
      userList.innerHTML = "<li class='list-group-item'>Нет пользователей.</li>";
      return;
    }

    users.forEach(user => {
  const username = user.username ?? "unknown";
  const role = user.role ?? "unknown";

  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.innerHTML = `<span>${escapeHTML(String(username))} (${escapeHTML(String(role))})</span>`;
  userList.appendChild(li);
});



  } catch (error) {
    console.error("Ошибка загрузки пользователей:", error);
    userList.innerHTML = "<li class='list-group-item text-danger'>Ошибка загрузки пользователей.</li>";
  }
}


  // Загрузка данных при инициализации
  loadGroups();
  updateUserGroupSelect();
  groupFilter.addEventListener("change", loadQuestions);

  // Загрузка пользователей при переходе на вкладку
  document.querySelector('[data-bs-target="#users"]').addEventListener("click", loadUsers);
});
