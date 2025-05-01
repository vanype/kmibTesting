document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("user-name").innerHTML = localStorage.getItem("username");
	document.getElementById("user-group").innerHTML = localStorage.getItem("group");
	
	
    document.getElementById("start_test_0").addEventListener("click", () => {
	const group = document.getElementById("group").innerText;
	localStorage.setItem("selectedGroup", group);
	window.location.href = "test-page.html";
}
);
});
