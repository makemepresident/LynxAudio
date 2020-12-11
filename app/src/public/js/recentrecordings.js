const recreq_path = 'https://localhost:443/recreq'
let recordingtoggle = document.getElementById("recentrecordings")
let mediaplayer = document.getElementById("mediaplayer")

// Request the information from the server
fetch(recreq_path, {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
// Parse result, if status is 500, error occured, if not, parse returned data as JSON
}).then((res) => {
    if (res.status == 500) {
        console.error("Internal server error, check to make sure API is running")
    } else {
        return res.json()
    }
}).then((result) => {
    // If result is null, error occured, if result has data, continue
    if (result) {
        // If result has no values, no recent recordings have been made
        if (result.length == 0) {
            document.getElementById("recentfailure").style = "display: block"
        // Else build the HTML to represent the data in the document
        } else {
            // For every result returned
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
                let row4 = document.createElement("div")
                row4.className = "row"
                let row5 = document.createElement("div")
                row5.className = "row"

                // Append to appropriate columns
                column.appendChild(row)
                column.appendChild(row2)
                column2.appendChild(row4)
                column2.appendChild(row5)

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

                // Make created by text
                let file = document.createElement("h5")
                file.className = "infoitem"
                file.innerHTML = "Created by: "
                // Append the username beside the created by text
                let filename = document.createElement("p")
                filename.className = "infocontent"
                filename.innerHTML = " " + result[i].username

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
                row4.appendChild(file)
                row4.appendChild(filename)
                row5.appendChild(hash)
                row5.appendChild(urlhash)

                // Make the "view" button
                let webview = document.createElement("a")
                webview.className = "loginbuttons webplayerview"
                webview.innerHTML = "View"
                webview.href = "../webplayer/" + result[i].url_hash

                // Append the view button to the corresponding column
                column3.appendChild(webview)

                // Append everything we just made to it's container in the document
                mediaplayer.appendChild(infocontainer)
            }
        }

    }
// Just in case an error occurs
}).catch((err) => {
    console.error(err)
})

// If the user wants to see recent recordings, show, otherwise hide
recordingtoggle.onchange = () => {
    if (recordingtoggle.checked) {
        mediaplayer.style = "display: block"
    } else {
        mediaplayer.style = "display: none"
    }
}