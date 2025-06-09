document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("user-name").innerHTML = localStorage.getItem("username");
	document.getElementById("user-group").innerHTML = localStorage.getItem("group");
	
	
    document.getElementById("start_test_0").addEventListener("click", () => {
			const group = document.getElementById("web-tech").innerText;
			localStorage.setItem("selectedGroup", group);
			window.location.href = "test-page.html";
		}
	);
	
	document.getElementById("start_test_1").addEventListener("click", () => {
			const group = document.getElementById("db").innerText;
			localStorage.setItem("selectedGroup", group);
			window.location.href = "test-page.html";
		}
	);
	document.getElementById("start_test_2").addEventListener("click", () => {
			const group = document.getElementById("web-dev").innerText;
			localStorage.setItem("selectedGroup", group);
			window.location.href = "test-page.html";
		}
	);
	document.getElementById("start_test_3").addEventListener("click", () => {
			const group = document.getElementById("js").innerText;
			localStorage.setItem("selectedGroup", group);
			window.location.href = "test-page.html";
		}
	);
	document.getElementById("start_test_4").addEventListener("click", () => {
			const group = document.getElementById("cyber").innerText;
			localStorage.setItem("selectedGroup", group);
			window.location.href = "test-page.html";
		}
	);
	
	const userId = 6; // Здесь нужно подставить актуальный ID пользователя, можно брать из сессии или локального хранилища

	  // Мапа: id элемента → название теста (соответствует test_name в БД)
	  const testsMap = {
		"web-tech prog": "Веб-технологии",
		"db prog": "Базы данных",
		"web-dev prog": "Веб-разработка",
		"js prog": "JavaScript",
		"cyber prog": "Кибербезопасность"
	  };

	  Object.entries(testsMap).forEach(([elementId, testName]) => {
		fetch("/questions/getresults", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ user_id: userId, test_name: testName })
		})
		  .then(res => res.json())
		  .then(results => {
  // Если приходит объект, а не массив — делаем так:
  if (results && typeof results === "object" && !Array.isArray(results)) {
    // Отобразим напрямую
    const span = document.getElementById(elementId);
    if (span) {
      span.textContent = `Ваш результат: ${results.score} из ${results.total} (${results.percentage.toFixed(1)}%)`;
    }
  } else if (Array.isArray(results) && results.length > 0) {
    const latest = results[0];
    const span = document.getElementById(elementId);
    if (span) {
      span.textContent = `Ваш результат: ${latest.score} из ${latest.total} (${latest.percentage.toFixed(1)}%)`;
    }
  } else {
    const span = document.getElementById(elementId);
    if (span) {
      span.textContent = "Результатов нет";
    }
  }
});

  });
});
