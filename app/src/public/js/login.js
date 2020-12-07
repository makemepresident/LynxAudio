const loginbutton = document.getElementById("login")
const loginconf = document.getElementById("signedin")
const usernamelabel = document.getElementById("usernamelabel")
const passwordlabel = document.getElementById("passwordlabel")
const username = document.getElementById("username")
const password = document.getElementById("password")
const login_path = 'https://52.14.141.136/loginreq'

const cookies = document.cookie
let userid = null
let usernamecook = null
let first = null

if (cookies.includes("id")) {
    let splitCookie = cookies.split("; ")
    userid = splitCookie[0].split("=")[1]
    usernamecook = splitCookie[1].split("=")[1]
    first = splitCookie[2].split("=")[1]
    loginconf.innerHTML = "Hello " + first + "!"
    document.getElementById("signeddiv").style = "display: visible"
    document.getElementById("logindiv").style.display = "none"
}

loginbutton.onclick = () => {
    usernamelabel.innerHTML = "Username"
    usernamelabel.style.color = "rgba(255, 255, 255, 0.75)"
    username.style.boxShadow = "inset 0 -2px 0 #FFF"
    passwordlabel.innerHTML = "Password"
    passwordlabel.style.color = "rgba(255, 255, 255, 0.75)"
    password.style.boxShadow = "inset 0 -2px 0 #FFF"
    login();
}

function logout() {
    document.cookie = "id=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    document.cookie = "firstname=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    location.reload()
}

async function login() {
    let ld = new FormData()
    ld.append('username', username.value)
    ld.append('password', password.value)
    await fetch(login_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: ld
    }).then((res) => {
        if (res.status == 500) {
            console.error("Internal server error, check to make sure API is running")
        } else {
            return res.json()
        }
    }).then((result) => {
        if (result) {
            if (result.result == "true") {
                document.cookie = "id=" + result.id + ";path=/"
                document.cookie = "username=" + result.username + ";path=/"
                document.cookie = "firstname=" + result.firstname + ";path=/"
                location.reload()
            } else if (result.result == "userresult") {
                usernamelabel.innerHTML = "Username invalid."
                usernamelabel.style.color = "rgb(255, 0, 0)"
                username.style.boxShadow = "inset 0 -2px 0 #F00"
            } else if (result.result == "passresult") {
                passwordlabel.innerHTML = "Incorrect username/password!"
                passwordlabel.style.color = "rgb(255, 0, 0)"
                password.style.boxShadow = "inset 0 -2px 0 #F00"
            }
        }
    })
}