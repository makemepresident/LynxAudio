let username = document.getElementById("username")
let password = document.getElementById("password")
let verify = document.getElementById("verify")
let first = document.getElementById("first")
let last = document.getElementById("last")
let email = document.getElementById("email")
let error = document.getElementById("error")
let register = document.getElementById("register")
const register_path = 'http://localhost:5433/regreq'

let validpass = false
let validverify = false
let validemail = false
let validfirst = false
let falidlast = false
let validusername = false

username.onkeyup = () => {
    if (username.value.length > 0) {
        if (username.value.length > 30) {
            setRed("usernamelabel", username, "Username is too long")
            validusername = false
        } else {
            setWhite("usernamelabel", username, "Username good")
            validusername = true;
        }
    } else {
        setRed("usernamelabel", username, "Username can't be length 0")
        validusername = false
    }
}

first.onkeyup = () => {
    if (first.value.length > 0) {
        if (first.value.length > 30) {
            setRed("firstlabel", first, "First Name too long")
            validfirst = false
        } else {
            setWhite("firstlabel", first, "First name good")
            validfirst = true;
        }
    } else {
        setRed("firstlabel", first, "First name field empty")
        validfirst = false;
    }
}

last.onkeyup = () => {
    if (last.value.length > 0) {
        if (last.value.length > 30) {
            setRed("lastlabel", last, "Last Name too long")
            validlast = false
        } else {
            setWhite("lastlabel", last, "Last name good")
            validlast = true;
        }
    } else {
        setRed("lastlabel", last, "Last name field empty")
        validlast = false;
    }
}

password.onkeyup = () => {
    if (password.value.length < 8) {
        setRed("passwordlabel", password, "Password invalid")
        validpass = false
    } else {
        setWhite("passwordlabel", password, "Password valid")
        validpass = true
        if (password.value == verify.value) {
            setWhite("verifylabel", verify, "Passwords match")
        }
    }
}

verify.onkeyup = () => {
    if (password.value != verify.value) {
        setRed("verifylabel", verify, "Passwords do not match")
        validverify = false
    } else {
        setWhite("verifylabel", verify, "Passwords match")
        validverify = true
    }
}

email.onkeyup = () => {
    if (email.value.includes("@") && email.value.includes(".") && email.value.length <= 50) {
        setWhite("emaillabel", email, "Email valid")
        validemail = true
    } else {
        if (email.value.length > 50) {
            setRed("emaillabel", email, "Email address too long")
        } else {
            setRed("emaillabel", email, "Email address invalid")
        }
        validemail = false
    }
}

register.onclick = () => {
    if (validusername && validemail && validpass && validverify && validfirst && validlast) {
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
        if (res.status == 500) {
            console.error("Internal server error, check to make sure API is running")
        } else {
            return res.text()
        }
    }).then((result) => {
        if (result) {
            if (result == "true") {
                document.cookie = "regsuccess=" + result + ";path=/"
                window.location.href = "./index.html"
            } else if (result == "false") {
                document.getElementById("usernamelabel").innerHTML = "Username taken"
                document.getElementById("usernamelabel").style.color = "rgb(255, 0, 0)"
                username.style.boxShadow = "inset 0 -2px 0 #F00"
                register.disabled = false
            } else if (result == "profane") {
                document.getElementById("usernamelabel").innerHTML = "Username contains profanity"
                document.getElementById("usernamelabel").style.color = "rgb(255, 0, 0)"
                username.style.boxShadow = "inset 0 -2px 0 #F00"
                register.disabled = false
            }
        }
    })
}

function setRed(label, input, text) {
    document.getElementById(label).innerHTML = text
    document.getElementById(label).style.color = "rgb(255, 0, 0)"
    input.style.boxShadow = "inset 0 -2px 0 #F00"
}

function setWhite(label, input, text) {
    document.getElementById(label).innerHTML = text
    document.getElementById(label).style.color = "rgba(255, 255, 255, 0.75)"
    input.style.boxShadow = "inset 0 -2px 0 #FFF"
}