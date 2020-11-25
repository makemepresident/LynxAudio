let audioContext = new AudioContext()
let input;
let recorder;
let gumStream;
const limit = 5000 // 5s record limit
const app_path = 'http://localhost:8080/memoreq'
let hasMicrophone = false
let start = null
let end = null
let recbtn = document.getElementById('recordbutton')
let text = document.getElementById('usergivenid')

text.onkeyup = () => {
    if (text.value.length > 50) {
        document.getElementById("nameerror").innerHTML = "Name too long"
        recbtn.disabled = true
    } else {
        document.getElementById("nameerror").innerHTML = ""
        recbtn.disabled = false
    }
}

let a = false
recbtn.onclick = () => {
    if(a == true) {
        gumStream.getAudioTracks()[0].stop()
        a = false
        recorder.finishRecording()
        recbtn.style.backgroundColor = null
        return
    }

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
            recbtn.style.backgroundColor = null
            end = new Date()
            postMemo(blob, recorder.encoding)
        }

        recorder.setOptions({
            timelimit: 5,
            encodeAfterRecord: true
        })

        a = true
        recbtn.style.backgroundColor = '#FF0000'
        start = new Date();
        recorder.startRecording()
    })
}

async function postMemo(blob, encoding) {
    let fd = new FormData()
    fd.append('blob', blob)
    fd.append('duration', end - start)
    fd.append('usergivenid', text.value)
    fd.append('userid', )
    await fetch(app_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: fd
    }).then((res) => {
        return res.text()
    }).then((hash) => {
        if (hash == "Internal Server Error") {
            console.log("Quit being sneaky and trying to write bad stuff to the db")
        } else {
            window.location.href = "/webplayer/" + hash;
        }
    })
}