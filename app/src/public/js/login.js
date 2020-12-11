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

// If the cookies are set, parse them for information to append to the signed in div
if (cookies.includes("id")) {
    let splitCookie = cookies.split("; ")
    
    for (i = 0; i < splitCookie.length; i++) {
        let currentsplit = splitCookie[i].split("=");
        if (currentsplit[0] == "firstname") {
            first = currentsplit[1]
        } else if (currentsplit[0] == "id") {
            userid = currentsplit[1];
        } else if (currentsplit[0] == "username") {
            usernamecook = currentsplit[1];
        }
    }

    /*userid = splitCookie[0].split("=")[1]
    usernamecook = splitCookie[1].split("=")[1]
    first = splitCookie[2].split("=")[1]*/
    loginconf.innerHTML = "Hello " + first + "!"
    // Show signed in div and hide login div
    document.getElementById("signeddiv").style = "display: visible"
    document.getElementById("logindiv").style.display = "none"
}

// If the user clicks the login button, make sure red fields are white again and run login function
loginbutton.onclick = () => {
    usernamelabel.innerHTML = "Username"
    usernamelabel.style.color = "rgba(255, 255, 255, 0.75)"
    username.style.boxShadow = "inset 0 -2px 0 #FFF"
    passwordlabel.innerHTML = "Password"
    passwordlabel.style.color = "rgba(255, 255, 255, 0.75)"
    password.style.boxShadow = "inset 0 -2px 0 #FFF"
    login();
}

// Remove cookies from browser by setting them as expired and reload the page
function logout() {
    document.cookie = "id=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    document.cookie = "firstname=;expires=Thu, 01 Jan 1970 00:00:00;path=/;"
    location.reload()
}

// Main login function
async function login() {
    // Append user provided username and password to the form
    let ld = new FormData()
    ld.append('username', username.value)
    ld.append('password', password.value)

    // Request the information be checked against the db
    await fetch(login_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: ld
    // Parse result, if status is 500, error occured, if not, parse returned data as JSON
    }).then((res) => {
        if (res.status == 500) {
            console.error("Internal server error, check to make sure API is running")
        } else {
            return res.json()
        }
    // Take parsed result data and do more checks
    }).then((result) => {
        // If result didn't error, continue
        if (result) {
            // If credentials are valid, API and APP return true result, set cookies and reload page
            if (result.result == "true") {
                document.cookie = "id=" + result.id + ";path=/"
                document.cookie = "username=" + result.username + ";path=/"
                document.cookie = "firstname=" + result.firstname + ";path=/"
                location.reload()
            // If username is invalid, db returns userresult, present information to user
            } else if (result.result == "userresult") {
                usernamelabel.innerHTML = "Username invalid."
                usernamelabel.style.color = "rgb(255, 0, 0)"
                username.style.boxShadow = "inset 0 -2px 0 #F00"
            // if password is invalid, db returns passresult, present information to user
            } else if (result.result == "passresult") {
                passwordlabel.innerHTML = "Incorrect username/password!"
                passwordlabel.style.color = "rgb(255, 0, 0)"
                password.style.boxShadow = "inset 0 -2px 0 #F00"
            }
        }
    // Just in case an unknown error occurs
    }).catch((err) => {
        console.error(err)
    })
}