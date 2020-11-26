const allreq_path = 'http://localhost:8080/allreq'
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
        return res.json()
    }).then((result) => {
        if (result.length == 0) {
            error.innerHTML = "No recordings exist for your userid!"
            document.getElementById("top").style = "visibility: visible"
        } else {
            for (i = 0; i < result.length; i++) {
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
                source.id = "audiosouce"
                source.src = "../uploads/" + result[i].filename

                audioplayer.appendChild(source)
                container.appendChild(title)
                container.appendChild(filesize)
                container.appendChild(audioplayer)
                mediaplayer.appendChild(container)
            }
        }
    })
}