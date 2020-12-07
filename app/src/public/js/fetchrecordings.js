const allreq_path = "http://localhost:8080/allreq"
const delreq_path = "http://localhost:8080/delreq"
const error = document.getElementById("error")
const mediaplayer = document.getElementById("mediaplayer")

// If the user is not signed in
if (userid == null) {
    error.innerHTML = "User not signed in!"
    document.getElementById("top").style = "visibility: visible"
// The user is signed in
} else {
    let formbody = new FormData()
    formbody.append("userid", userid)

    /**
     * Get the information from the server using a fetch request
     * body: Contains the users UserID stored in the cookie
     */
    fetch(allreq_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: formbody
    // Parse result, if status is 500, error occured, if not, parse returned data as JSON
    }).then((res) => {
        if (res.status == 500) {
            console.error("Internal server error, check to make sure API is running")
        } else {
            return res.json()
        }
    // Take parsed result data and do more checks
    }).then((result) => {
        // If result is empty, no data returned, if result has data, continue
        if (result) {
            // If result has no values, no recordings exist for this userid
            if (result.length == 0) {
                error.innerHTML = "No recordings exist for your userid!"
                document.getElementById("top").style = "visibility: visible"
            // Else build the HTML to represent the data in the document
            } else {
                let mediaplayer = document.getElementById("mediaplayer")
                for (i = 0; i < result.length; i++) {
                    // Parent div, will hold all the buttons and data
                    let infocontainer = document.createElement("div")
                    infocontainer.className = "infocontainer"

                    // 3 columns are needed (2 for data, one for buttons)
                    let column = document.createElement("div")
                    column.className = "column myrecordings"
                    infocontainer.appendChild(column)
                    let column2 = document.createElement("div")
                    column2.className = "column myrecordings"
                    infocontainer.appendChild(column2)
                    let column3 = document.createElement("div")
                    column3.className = "column button"
                    infocontainer.appendChild(column3)

                    // 4 rows are needed (2 per data column)
                    let row = document.createElement("div")
                    row.className = "row"
                    let row2 = document.createElement("div")
                    row2.className = "row"
                    let row3 = document.createElement("div")
                    row3.className = "row"
                    let row4 = document.createElement("div")
                    row4.className = "row"

                    // Append to appropriate columns
                    column.appendChild(row)
                    column.appendChild(row2)
                    column2.appendChild(row3)
                    column2.appendChild(row4)

                    // Make clipname text
                    let clipname = document.createElement("h5")
                    clipname.className = "infoitem"
                    clipname.innerHTML = "Clip name: "
                    // Append the id beside the clipname text
                    let usergivenid = document.createElement("p")
                    usergivenid.className = "infocontent"
                    usergivenid.innerHTML = " " + result[i].usergivenid

                    // Make length text
                    let length = document.createElement("h5")
                    length.className = "infoitem"
                    length.innerHTML = "Length: "
                    // Append the clip's length beside the length text
                    let cliplength = document.createElement("p")
                    cliplength.className = "infocontent"
                    let inseconds = (result[i].cliplength / 1000).toFixed(2)
                    cliplength.innerHTML = " " + inseconds + " seconds"

                    // make file name text
                    let file = document.createElement("h5")
                    file.className = "infoitem"
                    file.innerHTML = "File name: "
                    // Append the clips file name beside the file name text
                    let filename = document.createElement("p")
                    filename.className = "infocontent"
                    filename.innerHTML = " " + result[i].filename

                    // Make url text
                    let hash = document.createElement("h5")
                    hash.className = "infoitem"
                    hash.innerHTML = "URL: "
                    // Append the URL hash beside the url text
                    let urlhash = document.createElement("p")
                    urlhash.className = "infocontent"
                    urlhash.innerHTML = " " + result[i].url_hash

                    // Append all the information we just made to the respective parent rows
                    row.appendChild(clipname)
                    row.appendChild(usergivenid)
                    row2.appendChild(length)
                    row2.appendChild(cliplength)
                    row3.appendChild(file)
                    row3.appendChild(filename)
                    row4.appendChild(hash)
                    row4.appendChild(urlhash)

                    // Make the "view" button
                    let webview = document.createElement("a")
                    webview.className = "loginbuttons webplayerview"
                    webview.innerHTML = "View"
                    webview.href = "../webplayer/" + result[i].url_hash

                    // Make the "delete" button
                    let deletebtn = document.createElement("a")
                    deletebtn.classList.add("loginbuttons")
                    deletebtn.classList.add("webplayerview")
                    deletebtn.id = result[i].filename
                    deletebtn.onclick = () => {
                        // Append a fetch to the delete button so that the file and db entry can be removed by the user when the delete button is pressed
                        let formbody2 = new FormData()
                        formbody2.append("filename", deletebtn.id)
                        // Send the filename for the file we want to delete from the server
                        fetch(delreq_path, {
                            method: 'POST',
                            mode: 'no-cors',
                            cache: 'no-cache',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: formbody2
                        // Parse result, if status is 500, error occured, if not, parse returned data as JSON
                        }).then((res) => {
                            if (res.status == 500) {
                                console.error("Internal server error, check to make sure API is running")
                            } else {
                                return res.text()
                            }
                        // If deletion is successful, reload page to repopulate users recordings
                        }).then((result) => {
                            if (result == "success") {
                                location.reload()
                            } else {
                                console.log("Error deleting")
                            }
                        })
                    }
                    deletebtn.innerHTML = "Delete"

                    // Append the view and delete buttons to the corresponding column
                    column3.appendChild(webview)
                    column3.appendChild(deletebtn)

                    // Append everything we just made to it's container in the document
                    mediaplayer.appendChild(infocontainer)
                }
            }
        } else {
            error.innerHTML = "Internal Server Error"
            document.getElementById("top").style = "visibility: visible"
        }
    // Error catch just in case
    }).catch((err) => {
        console.error(err)
    })
}