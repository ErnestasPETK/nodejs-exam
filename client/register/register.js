document.querySelector("form#registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = event.target.querySelector("input#email").value;
    const fullName = event.target.querySelector("input#fullName").value;
    const password = event.target.querySelector("input#password").value;
    const passwordRepeat = event.target.querySelector("input#passwordRepeat").value;
    console.log(email, fullName, password, passwordRepeat);
    const response = await fetch("//localhost:3001/api/v1/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            full_name: fullName,
            password: password,
            repeat_password: passwordRepeat,
        }),
    });
    console.log(response.json());
    if (response.status == 200) {
        window.location.href = "../login/login.html";
    } else {
        alert("Invalid email or password");
    }
});