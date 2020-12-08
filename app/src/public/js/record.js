const limit = 10000 // 10s record limit
const app_path = 'http://localhost:8080/memoreq'
let audioContext = new AudioContext()
let input;
let recorder;
let gumStream;
let hasMicrophone = false
let start = null
let end = null
let clicked = false
let recbtn = document.getElementById('recordbutton')
let text = document.getElementById('usergivenid')

// Prompt user to accept microphone access when they visit the main page
navigator.mediaDevices.getUserMedia({audio: true})

// Client-side check if the user has entered too many characters in the recording name box
text.onkeyup = () => {
    if (text.value.length > 50) {
        setRed("usergivenidlabel", text, "Name too long")
        recbtn.disabled = true
    } else {
        setWhite("usergivenidlabel", text, "Record Name")
        recbtn.disabled = false
    }
}

// When the user clicks on the record button
recbtn.onclick = () => {
    let bar = document.getElementById("progressbar")
    width = 0

    // If the user is clicking it a second time (ending recording)
    if(clicked == true) {
        recorder.finishRecording()
        return
    }

    // Check to make sure the user has given microphone permissions
    // This was where the error in out presentation occured, navigator.permissions.query is not a valid method on FireFox (as intended design)
    navigator.permissions.query({name:"microphone"}).then((res) => {
        // If user has, begin the recording
        if (res.state == "granted") {
            queryRecording(bar, width)
        // If user has neither granted nor denied, prompt them
        } else if (res.state == "prompt") {
            navigator.mediaDevices.getUserMedia({audio: true})
        // If user has denied, show denial HTML box
        } else if (res.state == "denied") {
            document.getElementById("micperms").style = "display: visible"
        }
    // If user is using FireFox or browser that does not support navigator.permissions.query, record if permission granted
    }).catch((err) => {
        console.log("Navigator microphone permissions API not available")
        queryRecording(bar, width)
    })
}

/**
 * Sends the blob and data to the db
 * @param {*} blob The recording blob
 * @param {*} encoding The encoding type (always WAV)
 */
async function postMemo(blob, encoding) {
    // Append the blob, duration, user given clip name, and user id to the form
    let fd = new FormData()
    fd.append('blob', blob)
    fd.append('duration', end - start)
    fd.append('usergivenid', text.value)
    fd.append('userid', userid)
    // Send the information to app/index with the form
    await fetch(app_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: fd
    // Parse result, if status is 500, error occured, if not, parse returned data as text
    }).then((res) => {
        if (res.status == 500) {
            console.error("Internal server error, check to make sure API is running")
        } else {
            return res.text()
        }
    // Open webplayer for just-made recording
    }).then((hash) => {
        if (hash) {
            window.location.href = "/webplayer/" + hash;
        }
    // Error catch for safe measure
    }).catch((err) => {
        console.error(err)
    })
}

// Sets the passed text input element to red styling
function setRed(label, input, text) {
    document.getElementById(label).innerHTML = text
    document.getElementById(label).style.color = "rgb(255, 0, 0)"
    input.style.boxShadow = "inset 0 -2px 0 #F00"
}

// Resets the passed text input element to normal styling
function setWhite(label, input, text) {
    document.getElementById(label).innerHTML = text
    document.getElementById(label).style.color = "rgba(255, 255, 255, 0.75)"
    input.style.boxShadow = "inset 0 -2px 0 #FFF"
}

/**
 * Main recording control function
 * @param {*} bar the progress bar HTML element
 * @param {*} width the width of the progress bar
  */
function queryRecording(bar, width) {
    // Obtain a stream on the microphone
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        // Reset the audio context
        audioContext = new AudioContext();

        // Make a global stream for use in recordingfinished
        gumStream = stream

        // Make the input stream
        input = audioContext.createMediaStreamSource(stream);

        // Build the recorder using the WebAudioRecorder library with the right encoding
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

        // When recorder.finishRecording() is called, change some styling and end the audio stream, then send the memo to app/index
        recorder.onComplete = (rec, blob) => {
            end = new Date()
            recbtn.style.backgroundColor = null
            recbtn.disabled = true
            clearInterval(interval)
            gumStream.getAudioTracks()[0].stop()
            clicked = false
            postMemo(blob, recorder.encoding)
        }

        // Options for the WebAudioRecorder
        recorder.setOptions({
            timelimit: 10,
            encodeAfterRecord: true
        })

        // Button has been clicked once
        clicked = true
        recbtn.style.backgroundColor = 'rgb(199, 0, 0)'
        start = new Date();

        // Begin recording and progress the progress bar on an interval
        recorder.startRecording()
        interval = setInterval(frame, (10000 / 100))

        /**
         * Progress the progress bar, when at 100% (10s), finish recording
         */
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