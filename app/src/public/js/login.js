const loginbutton = document.getElementById("login")
const loginconf = document.getElementById("signedin")
const login_path = 'http://localhost:8080/loginreq'

const cookies = document.cookie
let userid = null
let username = null
let first = null

if (cookies.includes("id")) {
    let splitCookie = cookies.split("; ")
    userid = splitCookie[0].split("=")[1]
    username = splitCookie[1].split("=")[1]
    first = splitCookie[2].split("=")[1]
    loginconf.innerHTML = "Hello " + first + "!"
    document.getElementById("signeddiv").style = "display: visible"
    document.getElementById("logindiv").style.display = "none"
}

loginbutton.onclick = () => {
    document.getElementById("usernamelabel").innerHTML = "Username"
    document.getElementById("usernamelabel").style.color = "rgba(255, 255, 255, 0.75)"
    document.getElementById("username").style.boxShadow = "inset 0 -2px 0 #FFF"
    document.getElementById("passwordlabel").innerHTML = "Username"
    document.getElementById("passwordlabel").style.color = "rgba(255, 255, 255, 0.75)"
    document.getElementById("password").style.boxShadow = "inset 0 -2px 0 #FFF"
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
        } else if (result.result == "userresult") {
            document.getElementById("usernamelabel").innerHTML = "Username invalid."
            document.getElementById("usernamelabel").style.color = "rgb(255, 0, 0)"
            document.getElementById("username").style.boxShadow = "inset 0 -2px 0 #F00"
        } else if (result.result == "passresult") {
            document.getElementById("passwordlabel").innerHTML = "Incorrect username/password!"
            document.getElementById("passwordlabel").style.color = "rgb(255, 0, 0)"
            document.getElementById("password").style.boxShadow = "inset 0 -2px 0 #F00"
        }
    })
}