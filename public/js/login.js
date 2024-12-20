document.addEventListener("DOMContentLoaded", () => {
	const loginForm = document.getElementById("login-form");

	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		console.log("로그인 폼 제출 이벤트 발생");

		const email = document.getElementById("login-email").value;
		const password = document.getElementById("login-password").value;
		console.log({ email, password });

		try {
			const response = await fetch("http://localhost:3000/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const result = await response.json();
			if (response.ok) {
				window.location.href = "/users/main";
			} else {
				console.error("서버 응답 오류:", result);
				alert(result.error || "로그인 실패");
			}
		} catch (error) {
			console.error("로그인 요청 실패:", error);
			alert("아이디 또는 비밀번호가 잘못되었습니다.");
		}
	});
});
