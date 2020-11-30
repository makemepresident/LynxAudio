const recreq_path = 'http://localhost:8080/recreq'
let recordingtoggle = document.getElementById("recentrecordings")
let mediaplayer = document.getElementById("mediaplayer")

fetch(recreq_path, {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
}).then((res) => {
    if (res.status == 500) {
        console.error("Internal server error, check to make sure API is running")
    } else {
        return res.json()
    }
}).then((result) => {
    if (result) {
        if (result.length == 0) {
            document.getElementById("recentfailure").style = "display: block"
        } else {
            for (i = 0; i < result.length; i++) {
                // Don't ever make me thing about this again, this was garbage to write
                let infocontainer = document.createElement("div")
                infocontainer.className = "infocontainer"

                let column = document.createElement("div")
                column.className = "column myrecordings"
                infocontainer.appendChild(column)
                let column2 = document.createElement("div")
                column2.className = "column myrecordings"
                infocontainer.appendChild(column2)
                let column3 = document.createElement("div")
                column3.className = "column button"
                infocontainer.appendChild(column3)

                let row = document.createElement("div")
                row.className = "row"
                let row2 = document.createElement("div")
                row2.className = "row"
                let row4 = document.createElement("div")
                row4.className = "row"
                let row5 = document.createElement("div")
                row5.className = "row"

                column.appendChild(row)
                column.appendChild(row2)
                column2.appendChild(row4)
                column2.appendChild(row5)

                let clipname = document.createElement("h5")
                clipname.className = "infoitem"
                clipname.innerHTML = "Clip name: "

                let usergivenid = document.createElement("p")
                usergivenid.className = "infocontent"
                usergivenid.innerHTML = " " + result[i].usergivenid

                let length = document.createElement("h5")
                length.className = "infoitem"
                length.innerHTML = "Length: "

                let cliplength = document.createElement("p")
                cliplength.className = "infocontent"
                let inseconds = (result[i].cliplength / 1000).toFixed(2)
                cliplength.innerHTML = " " + inseconds + " seconds"

                let file = document.createElement("h5")
                file.className = "infoitem"
                file.innerHTML = "Created by: "

                let filename = document.createElement("p")
                filename.className = "infocontent"
                filename.innerHTML = " " + result[i].username

                let hash = document.createElement("h5")
                hash.className = "infoitem"
                hash.innerHTML = "URL: "

                let urlhash = document.createElement("p")
                urlhash.className = "infocontent"
                urlhash.innerHTML = " " + result[i].url_hash

                row.appendChild(clipname)
                row.appendChild(usergivenid)
                row2.appendChild(length)
                row2.appendChild(cliplength)
                row4.appendChild(file)
                row4.appendChild(filename)
                row5.appendChild(hash)
                row5.appendChild(urlhash)

                let webview = document.createElement("a")
                webview.className = "loginbuttons webplayerview"
                webview.innerHTML = "View"
                webview.href = "../webplayer/" + result[i].url_hash

                column3.appendChild(webview)

                mediaplayer.appendChild(infocontainer)
            }
        }

    }
})

recordingtoggle.onchange = () => {
    if (recordingtoggle.checked) {
        mediaplayer.style = "display: block"
    } else {
        mediaplayer.style = "display: none"
    }
}