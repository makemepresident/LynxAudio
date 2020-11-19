const loginbutton = document.getElementById("login")
const login_path = 'http://localhost:8080/loginreq'

loginbutton.onclick = () => {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    login(username, password);
}

async function login(username, password) {
    var jsondata = {"username": username, "password": password}
    await fetch(login_path, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        //mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify(jsondata)
    })
}