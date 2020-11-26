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
            document.getElementById("usernamelabel").style.color = "rgb(255, 0, 0)"
            username.style.boxShadow = "inset 0 -2px 0 #F00"
            validfirst = false
        } else {
            document.getElementById("usernamelabel").innerHTML = "Username good"
            document.getElementById("usernamelabel").style.color = "rgba(255, 255, 255, 0.75)"
            username.style.boxShadow = "inset 0 -2px 0 #FFF"
            validfirst = true;
        }
    } else {
        document.getElementById("usernamelabel").innerHTML = "Username can't be length 0!"
        document.getElementById("usernamelabel").style.color = "rgb(255, 0, 0)"
        username.style.boxShadow = "inset 0 -2px 0 #F00"
    }
}

first.onkeyup = () => {
    if (first.value.length > 0) {
        if (first.value.length > 30) {
            document.getElementById("firstlabel").innerHTML = "First Name too long!"
            document.getElementById("firstlabel").style.color = "rgb(255, 0, 0)"
            first.style.boxShadow = "inset 0 -2px 0 #F00"
            validfirst = false
        } else {
            document.getElementById("firstlabel").innerHTML = "First name good"
            document.getElementById("firstlabel").style.color = "rgba(255, 255, 255, 0.75)"
            first.style.boxShadow = "inset 0 -2px 0 #FFF"
            validfirst = true;
        }
    } else {
        document.getElementById("firstlabel").innerHTML = "First name field empty"
        document.getElementById("firstlabel").style.color = "rgb(255, 0, 0)"
        first.style.boxShadow = "inset 0 -2px 0 #F00"
        validfirst = false;
    }
}

last.onkeyup = () => {
    if (last.value.length > 0) {
        if (last.value.length > 30) {
            document.getElementById("lastlabel").innerHTML = "Last Name too long!"
            document.getElementById("lastlabel").style.color = "rgb(255, 0, 0)"
            last.style.boxShadow = "inset 0 -2px 0 #F00"
            validlast = false
        } else {
            document.getElementById("lastlabel").innerHTML = "Last name good"
            document.getElementById("lastlabel").style.color = "rgba(255, 255, 255, 0.75)"
            last.style.boxShadow = "inset 0 -2px 0 #FFF"
            validlast = true;
        }
    } else {
        document.getElementById("lastlabel").innerHTML = "Last name field empty"
        document.getElementById("lastlabel").style.color = "rgb(255, 0, 0)"
        last.style.boxShadow = "inset 0 -2px 0 #F00"
        validlast = false;
    }
}

password.onkeyup = () => {
    if (password.value.length < 8) {
        document.getElementById("passwordlabel").innerHTML = "Password invalid"
        document.getElementById("passwordlabel").style.color = "rgb(255, 0, 0)"
        password.style.boxShadow = "inset 0 -2px 0 #F00"
        validpass = false
    } else {
        document.getElementById("passwordlabel").innerHTML = "Password valid"
        document.getElementById("passwordlabel").style.color = "rgba(255, 255, 255, 0.75)"
        password.style.boxShadow = "inset 0 -2px 0 #FFF"
        validpass = true
    }
}

verify.onkeyup = () => {
    if (password.value != verify.value) {
        document.getElementById("verifylabel").innerHTML = "Passwords do not match!"
        document.getElementById("verifylabel").style.color = "rgb(255, 0, 0)"
        verify.style.boxShadow = "inset 0 -2px 0 #F00"
        validverify = false
    } else {
        document.getElementById("verifylabel").innerHTML = "Passwords match!"
        document.getElementById("verifylabel").style.color = "rgba(255, 255, 255, 0.75)"
        verify.style.boxShadow = "inset 0 -2px 0 #FFF"
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
        document.getElementById("emaillabel").style.color = "rgb(255, 0, 0)"
        email.style.boxShadow = "inset 0 -2px 0 #F00"
        validemail = false
    } else {
        document.getElementById("emaillabel").innerHTML = "Email valid!"
        document.getElementById("emaillabel").style.color = "rgba(255, 255, 255, 0.75)"
        email.style.boxShadow = "inset 0 -2px 0 #FFF"
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
            document.cookie = "regsuccess=" + result + ";path=/"
            window.location.href = "./index.html"
        } else if (result == "false") {
            document.getElementById("usernamelabel").innerHTML = "Username taken"
            document.getElementById("usernamelabel").style.color = "rgb(255, 0, 0)"
            username.style.boxShadow = "inset 0 -2px 0 #F00"
            register.disabled = false
        }
    })
}