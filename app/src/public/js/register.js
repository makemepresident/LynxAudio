let username = document.getElementById("username")
let password = document.getElementById("password")
let verify = document.getElementById("verify")
let first = document.getElementById("first")
let last = document.getElementById("last")
let email = document.getElementById("email")
let error = document.getElementById("error")
let register = document.getElementById("register")
const register_path = 'http://localhost:8080/regreq'

let validpass = false
let validverify = false
let validemail = false
let validfirst = false
let falidlast = false

first.onkeyup = () => {
    if (first.value.length > 0) {
        validfirst = true;
    } else {
        validfirst = false;
    }
}

last.onkeyup = () => {
    if (first.value.length > 0) {
        validlast = true;
    } else {
        validlast = false;
    }
}

password.onkeyup = () => {
    if (password.value.length < 8) {
        error.style = "visibility: visible"
        error.innerHTML = "Password must be greater than or equal to 8 characters"
        validpass = false
    } else {
        error.innerHTML = "Password valid"
        validpass = true
    }
}

verify.onkeyup = () => {
    if (password.value != verify.value) {
        error.style = "visibility: visible"
        error.innerHTML = "Passwords do not match!"
        validverify = false
    } else {
        error.innerHTML = "Passwords match!"
        validverify = true
    }
}

email.onkeyup = () => {
    if (!email.value.includes("@")) {
        error.style = "visibility: visible"
        error.innerHTML = "Email address invalid"
        validemail = false
    } else {
        error.innerHTML = "Email valid!"
        validemail = true
    }
}

register.onclick = () => {
    if (validemail && validpass && validverify && validfirst && validlast) {
        register.disabled = true
        postRegister()
    } else {
        error.style = "visibility: visible"
        error.innerHTML = "Please fill all of the forms!"
    }
}

async function postRegister() {
    let formbody = new FormData()
    formbody.append('username', username.value)
    formbody.append('password', password.value)
    formbody.append('first', first.value)
    formbody.append('last', last.value)
    formbody.append('email', email.value)

    await fetch(register_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: formbody
    }).then((res) => {
        return res.text()
    }).then((result) => {
        if (result == "true") {
            window.location.href("./index.html")
        } else if (result == "false") {
            // Username already exists
        }
    })
}