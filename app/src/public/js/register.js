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
let validusername = false

username.onkeyup = () => {
    if (username.value.length > 0) {
        if (username.value.length > 30) {
            document.getElementById("usernamelabel").innerHTML = "Username too long!"
            username.style.borderColor = "red"
            validfirst = false
        } else {
            document.getElementById("usernamelabel").innerHTML = "Username good"
            username.style.borderColor = "green"
            validfirst = true;
        }
    }
}

first.onkeyup = () => {
    if (first.value.length > 0) {
        if (first.value.length > 30) {
            document.getElementById("firstlabel").innerHTML = "First Name too long!"
            first.style.borderColor = "red"
            validfirst = false
        } else {
            document.getElementById("firstlabel").innerHTML = "First name good"
            first.style.borderColor = "green"
            validfirst = true;
        }
    } else {
        document.getElementById("firstlabel").innerHTML = "First name field empty"
        first.style.borderColor = "red"
        validfirst = false;
    }
}

last.onkeyup = () => {
    if (last.value.length > 0) {
        if (last.value.length > 30) {
            document.getElementById("lastlabel").innerHTML = "Last Name too long!"
            last.style.borderColor = "red"
            validlast = false
        } else {
            document.getElementById("lastlabel").innerHTML = "Last name good"
            last.style.borderColor = "green"
            validlast = true;
        }
    } else {
        document.getElementById("lastlabel").innerHTML = "Last name field empty"
        last.style.borderColor = "red"
        validlast = false;
    }
}

password.onkeyup = () => {
    if (password.value.length < 8) {
        document.getElementById("passwordlabel").innerHTML = "Password must be greater than or equal to 8 characters"
        password.style.borderColor = "red"
        validpass = false
    } else {
        document.getElementById("passwordlabel").innerHTML = "Password valid"
        password.style.borderColor = "green"
        validpass = true
    }
}

verify.onkeyup = () => {
    if (password.value != verify.value) {
        document.getElementById("verifylabel").innerHTML = "Passwords do not match!"
        verify.style.borderColor = "red"
        validverify = false
    } else {
        document.getElementById("verifylabel").innerHTML = "Passwords match!"
        verify.style.borderColor = "green"
        validverify = true
    }
}

email.onkeyup = () => {
    if (!email.value.includes("@")) {
        if (email.value.length > 50) {
            document.getElementById("emaillabel").innerHTML = "Email address too long"
        } else {
            document.getElementById("emaillabel").innerHTML = "Email address invalid"
        }
        email.style.borderColor = "red"
        validemail = false
    } else {
        document.getElementById("emaillabel").innerHTML = "Email valid!"
        email.style.borderColor = "green"
        validemail = true
    }
}

register.onclick = () => {
    if (validemail && validpass && validverify && validfirst && validlast) {
        register.disabled = true
        postRegister()
    } else {
        printError("Please fill all of the forms accurately!")
    }
}

function printError(errorMsg) {
    error.style = "visibility: visible"
    error.innerHTML = errorMsg
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
        console.log(result)
        if (result == "true") {
            // Set user cookie with userid
            window.location.href = "./index.html"
        } else if (result == "false") {
            document.getElementById("usernamelabel").innerHTML = "Username has already been taken."
            username.style.borderColor = "red"
        }
    })
}