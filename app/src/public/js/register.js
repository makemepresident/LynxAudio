let username = document.getElementById("username")
let password = document.getElementById("password")
let verify = document.getElementById("verify")
let first = document.getElementById("first")
let last = document.getElementById("last")
let email = document.getElementById("email")
let error = document.getElementById("error")
let register = document.getElementById("register")
const register_path = 'http://localhost:8080/regreq'

// Bools that indicate whether or not a field is valid
let validpass = false
let validverify = false
let validemail = false
let validfirst = false
let falidlast = false
let validusername = false

// Check to make sure the username is not empty and it is not greater than the db max of 30
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

// Check to make sure the first name is not empty and it is not greater than the db max of 30
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

// Check to make sure the last name is not empty and it is not greater than the db max of 30
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

// Check to make sure the password is at least 8 characters long
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

// Check to make sure the password matches the verified password
verify.onkeyup = () => {
    if (password.value != verify.value) {
        setRed("verifylabel", verify, "Passwords do not match")
        validverify = false
    } else {
        setWhite("verifylabel", verify, "Passwords match")
        validverify = true
    }
}

// Check to make sure the email looks valid and is under the db max of 50 characters (does not have any implementation use yet)
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

// When the user clicks the register button, make sure all fields are reported as valid and send the request to the db
// Disables the register button to prevent double submissions
register.onclick = () => {
    if (validusername && validemail && validpass && validverify && validfirst && validlast) {
        register.disabled = true
        postRegister()
    } else {
        printError("Please fill all of the forms accurately!")
    }
}

/**
 * Prints error in dedicated error box and shows it to user
 * @param {*} errorMsg 
 */
function printError(errorMsg) {
    error.style = "visibility: visible"
    error.innerHTML = errorMsg
}

async function postRegister() {
    // Build form using all entered data
    let formbody = new FormData()
    formbody.append('username', username.value)
    formbody.append('password', password.value)
    formbody.append('first', first.value)
    formbody.append('last', last.value)
    formbody.append('email', email.value)

    // Request the information from the server with the form
    await fetch(register_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: formbody
    // Parse result, if status is 500, error occured, if not, parse returned data as text
    }).then((res) => {
        if (res.status == 500) {
            console.error("Internal server error, check to make sure API is running")
        } else {
            return res.text()
        }
    // Check server send result
    }).then((result) => {
        // If no result, do nothing
        if (result) {
            // If result is true, registration success, set success cookie and redirect to index.html for the user to sign in
            if (result == "true") {
                document.cookie = "regsuccess=" + result + ";path=/"
                window.location.href = "./index.html"
            // If result is false, username is already taken, notify user to change username and re-enable register button
            } else if (result == "false") {
                document.getElementById("usernamelabel").innerHTML = "Username taken"
                document.getElementById("usernamelabel").style.color = "rgb(255, 0, 0)"
                username.style.boxShadow = "inset 0 -2px 0 #F00"
                register.disabled = false
            // If result is profane, user used bad words in his username, notify user to change and renable register button
            } else if (result == "profane") {
                document.getElementById("usernamelabel").innerHTML = "Username contains profanity"
                document.getElementById("usernamelabel").style.color = "rgb(255, 0, 0)"
                username.style.boxShadow = "inset 0 -2px 0 #F00"
                register.disabled = false
            }
        }
    // Just in case a random error occurs
    }).catch((err) => {
        console.error(err)
    })
}

// Sets the elements border and text to red
function setRed(label, input, text) {
    document.getElementById(label).innerHTML = text
    document.getElementById(label).style.color = "rgb(255, 0, 0)"
    input.style.boxShadow = "inset 0 -2px 0 #F00"
}

// Sets the elements border and text to white
function setWhite(label, input, text) {
    document.getElementById(label).innerHTML = text
    document.getElementById(label).style.color = "rgba(255, 255, 255, 0.75)"
    input.style.boxShadow = "inset 0 -2px 0 #FFF"
}