const loginbutton = document.getElementById("login")
const loginconf = document.getElementById("signedin")
const login_path = 'http://localhost:8080/loginreq'

const cookies = document.cookie

if (cookies) {
    let splitCookie = cookies.split("; ")
    let userid = splitCookie[0].split("=")[1]
    let username = splitCookie[1].split("=")[1]
    let first = splitCookie[2].split("=")[1]
    loginconf.innerHTML = "Hello " + first + "!"
    document.getElementById("signeddiv").style = "display: visible"
}

loginbutton.onclick = () => {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    login(username, password);
}

function logout() {
    document.cookie = "id=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    document.cookie = "firstname=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    location.reload()
}

async function login(username, password) {
    let ld = new FormData()
    ld.append('username', username)
    ld.append('password', password)
    await fetch(login_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: ld
    }).then((res) => {
        return res.json()
    }).then((result) => {
        if (result.result == "true") {
            document.cookie = "id=" + result.id + ";path=/"
            document.cookie = "username=" + result.username + ";path=/"
            document.cookie = "firstname=" + result.firstname + ";path=/"
            location.reload()
        }
    })
}