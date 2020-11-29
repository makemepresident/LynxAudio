const allreq_path = 'http://localhost:8080/allreq'
const delreq_path = "http://localhost:8080/delreq"
const error = document.getElementById("error")
const mediaplayer = document.getElementById("mediaplayer")

if (userid == null) {
    error.innerHTML = "User not signed in!"
    document.getElementById("top").style = "visibility: visible"
} else {
    let formbody = new FormData()
    formbody.append("userid", userid)

    fetch(allreq_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: formbody
    }).then((res) => {
        if (res.status == 500) {
            console.error("Internal server error, check to make sure API is running")
        } else {
            return res.json()
        }
    }).then((result) => {
        console.log(result)
        if (result) {
            if (result.length == 0) {
                error.innerHTML = "No recordings exist for your userid!"
                document.getElementById("top").style = "visibility: visible"
            } else {
                let mediaplayer = document.getElementById("mediaplayer")
                for (i = result.length - 1; i >=0; i--) {
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
                    let row3 = document.createElement("div")
                    row3.className = "row"
                    let row4 = document.createElement("div")
                    row4.className = "row"
                    let row5 = document.createElement("div")
                    row5.className = "row"
                    let row6 = document.createElement("div")
                    row6.className = "row"

                    column.appendChild(row)
                    column.appendChild(row2)
                    column.appendChild(row3)
                    column2.appendChild(row4)
                    column2.appendChild(row5)
                    column2.appendChild(row6)

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
                    cliplength.innerHTML = " " + result[i].cliplength

                    let size = document.createElement("h5")
                    size.className = "infoitem"
                    size.innerHTML = "File size: "

                    let filesize = document.createElement("p")
                    filesize.className = "infocontent"
                    filesize.innerHTML = " " + result[i].filesize

                    let file = document.createElement("h5")
                    file.className = "infoitem"
                    file.innerHTML = "File name: "

                    let filename = document.createElement("p")
                    filename.className = "infocontent"
                    filename.innerHTML = " " + result[i].filename

                    let hash = document.createElement("h5")
                    hash.className = "infoitem"
                    hash.innerHTML = "URL Hash: "

                    let urlhash = document.createElement("p")
                    urlhash.className = "infocontent"
                    urlhash.innerHTML = " " + result[i].url_hash

                    let id = document.createElement("h5")
                    id.className = "infoitem"
                    id.innerHTML = "Database ID: "

                    let dbid = document.createElement("p")
                    dbid.className = "infocontent"
                    dbid.innerHTML = " " + result[i].id

                    row.appendChild(clipname)
                    row.appendChild(usergivenid)
                    row2.appendChild(length)
                    row2.appendChild(cliplength)
                    row3.appendChild(size)
                    row3.appendChild(filesize)
                    row4.appendChild(file)
                    row4.appendChild(filename)
                    row5.appendChild(hash)
                    row5.appendChild(urlhash)
                    row6.appendChild(id)
                    row6.appendChild(dbid)

                    let webview = document.createElement("a")
                    webview.className = "loginbuttons webplayerview"
                    webview.innerHTML = "View in Webplayer"
                    webview.href = "../webplayer/" + result[i].url_hash

                    column3.appendChild(webview)

                    mediaplayer.appendChild(infocontainer)
                }
            }


            /*} else {
                for (i = result.length - 1; i >= 0; i--) {
                    let container = document.createElement("div")
                    container.classList.add("recordingcontainer")

                    let title = document.createElement("h5")
                    title.classList.add("mediatitle")
                    title.innerHTML = result[i].usergivenid

                    let filesize = document.createElement("h5")
                    filesize.classList.add("filesize")
                    filesize.innerHTML = "Filesize " + result[i].filesize

                    let audioplayer = document.createElement("audio")
                    audioplayer.nodeType="audio/wav"
                    audioplayer.classList.add("audioplayer")
                    audioplayer.controls = 'controls'

                    let source = document.createElement("source")
                    source.id = "audiosource"
                    source.src = "../uploads/" + result[i].filename

                    let deletebtn = document.createElement("button")
                    deletebtn.classList.add("loginbuttons")
                    deletebtn.classList.add("deletebutton")
                    deletebtn.onclick = () => {
                        let formbody2 = new FormData()
                        formbody2.append("filename", source.src.split("/uploads/")[1])
                        fetch(delreq_path, {
                            method: 'POST',
                            mode: 'no-cors',
                            cache: 'no-cache',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: formbody2
                        }).then((res) => {
                            if (res.status == 500) {
                                console.error("Internal server error, check to make sure API is running")
                            } else {
                                return res.text()
                            }
                        }).then((result) => {
                            if (result == "success") {
                                location.reload()
                            } else {
                                console.log("Error deleting")
                            }
                        })
                    }
                    deletebtn.innerHTML = "Delete Memo"

                    audioplayer.appendChild(source)
                    container.appendChild(title)
                    container.appendChild(filesize)
                    container.appendChild(deletebtn)
                    container.appendChild(audioplayer)
                    mediaplayer.appendChild(container)
                }
            }*/
        } else {
            error.innerHTML = "Internal Server Error"
            document.getElementById("top").style = "visibility: visible"
        }
    })
}