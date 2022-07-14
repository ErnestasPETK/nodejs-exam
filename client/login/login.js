document.querySelector("form#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = event.target.querySelector("input#email").value;
    const password = event.target.querySelector("input#password").value;
    const fullName = event.target.querySelector("input#fullName").value;
    const response = await fetch("//localhost:3001/api/v1/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            full_name: fullName,
            password: password,
        }),
    });
    // console.log(await response.json());
    if (response.status == 200) {
        const token = (await response.json()).token;
        localStorage.setItem("token", token);
        window.location.href = "../groups/groups.html";
        alert(" Login Successful!");
    } else {
        alert("Invalid email or password");
    }
});