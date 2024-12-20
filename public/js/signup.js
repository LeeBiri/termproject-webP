// 회원가입 요청 처리
document.addEventListener("DOMContentLoaded", () => {
	const signupForm = document.getElementById("signup-form");

	signupForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;

		try {
			const response = await fetch("http://localhost:3000/users/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			});

			const result = await response.json();
			if (response.ok) {
				alert("회원가입 로그인 화면으로 이동합니다.");
				window.location.href = "index.html"; // 로그인 페이지로 리다이렉트
			} else {
				console.error("서버 응답 오류:", result);
				alert(result.error || "회원가입 실패");
			}
		} catch (error) {
			console.error("회원가입 요청 실패:", error);
			alert("회원가입 요청 실패");
		}
	});
});
