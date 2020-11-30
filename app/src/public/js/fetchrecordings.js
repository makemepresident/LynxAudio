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
        if (result) {
            if (result.length == 0) {
                error.innerHTML = "No recordings exist for your userid!"
                document.getElementById("top").style = "visibility: visible"
            } else {
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
            }
        } else {
            error.innerHTML = "Internal Server Error"
            document.getElementById("top").style = "visibility: visible"
        }
    })
}