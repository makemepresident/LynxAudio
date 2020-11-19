const loginbutton = document.getElementById("login")
const login_path = 'http://localhost:80/loginreq'

loginbutton.onclick = () => {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    login(username, password);
}

async function login(username, password) {
    let ld = new FormData();
    ld.append('username', username);
    ld.append('password', password);
    await fetch(login_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: ld
    })
}