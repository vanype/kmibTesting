document.addEventListener("DOMContentLoaded", () => {
    const testForm = document.getElementById("testForm");
    const adminButton = document.getElementById("admin");

    if (testForm) {
        testForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fio = document.getElementById("fio").value.trim();
            const group = document.getElementById("group").value;

            if (!fio) {
                alert("Введите ФИО!");
                return;
            }

            if (!group) {
                alert("Выберите группу!");
                return;
            }

            // Сохранение в локальное хранилище
            localStorage.setItem("userFIO", fio);
            localStorage.setItem("selectedGroup", group);

            // Переход к тестам
            window.location.href = "test-page.html";
        });
    }

    if (adminButton) {
        adminButton.addEventListener("click", function () {
            window.location.href = "admin.html";
        });
    }
});
