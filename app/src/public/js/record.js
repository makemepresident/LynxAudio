let audioContext = new AudioContext()
let input;
let recorder;
let gumStream;
const limit = 10000 // 10s record limit
const app_path = 'https://52.14.141.136/memoreq'
let hasMicrophone = false
let start = null
let end = null
let clicked = false
let recbtn = document.getElementById('recordbutton')
let text = document.getElementById('usergivenid')

navigator.mediaDevices.getUserMedia({audio: true})

text.onkeyup = () => {
    if (text.value.length > 50) {
        setRed("usergivenidlabel", text, "Name too long")
        recbtn.disabled = true
    } else {
        setWhite("usergivenidlabel", text, "Record Name")
        recbtn.disabled = false
    }
}

recbtn.onclick = () => {
    let bar = document.getElementById("progressbar")
    width = 0

    if(clicked == true) {
        recorder.finishRecording()
        return
    }
    navigator.permissions.query({name:"microphone"}).then((res) => {
        if (res.state == "granted") {
            navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
                queryRecording(bar, width)
            })
        } else if (res.state == "prompt") {
            navigator.mediaDevices.getUserMedia({audio: true})
        } else if (res.state == "denied") {
            document.getElementById("micperms").style = "display: visible"
        }
    }).catch((err) => {
        console.log("Navigator microphone permissions API not available")
        queryRecording(bar, width)
    })
}

async function postMemo(blob, encoding) {
    let fd = new FormData()
    fd.append('blob', blob)
    fd.append('duration', end - start)
    fd.append('usergivenid', text.value)
    fd.append('userid', userid)
    await fetch(app_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: fd
    }).then((res) => {
        if (res.status == 500) {
            console.error("Internal server error, check to make sure API is running")
        } else {
            return res.text()
        }
    }).then((hash) => {
        if (hash) {
            window.location.href = "/webplayer/" + hash;
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

function queryRecording(bar, width) {
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        audioContext = new AudioContext();

        gumStream = stream

        input = audioContext.createMediaStreamSource(stream);

        recorder = new WebAudioRecorder(input, {
            workerDir: '../js/lib/',
            encoding: 'wav',
            numChannels: 2,
            onEncoderLoading: function(recorder, encoding) {
                console.log("Loading encoder " + encoding)
            },
            onEncoderLoaded: function(recorder, encoding) {
                console.log("Loaded encoder " + encoding)
            }
        })

        recorder.onComplete = (rec, blob) => {
            end = new Date()
            recbtn.style.backgroundColor = null
            recbtn.disabled = true
            clearInterval(interval)
            gumStream.getAudioTracks()[0].stop()
            clicked = false
            postMemo(blob, recorder.encoding)
        }

        recorder.setOptions({
            timelimit: 10,
            encodeAfterRecord: true
        })

        clicked = true
        recbtn.style.backgroundColor = 'rgb(199, 0, 0)'
        start = new Date();

        recorder.startRecording()
        interval = setInterval(frame, (10000 / 100))

        function frame() {
            if (width >= 100) {
                recorder.finishRecording()
            } else {
                width++;
                bar.style.width = width + '%'
            }
        }
    })
}