const cont = new AudioContext()
const sourceNode = new AudioBufferSourceNode(cont)
const recorder = new WebAudioRecorder(sourceNode, {workerDir: '../js/lib/'})
const limit = 5000 // 5s record limit
const api_path = 'http://localhost:80/postmemo'

let hasMicrophone = false
let start = null
let end = null

navigator.mediaDevices.getUserMedia({audio: true}).then((ms) => {
    hasMicrophone = true
})

let recbtn = document.getElementById('recordbutton')
let text = document.getElementById('filenameid')
recorder.setOptions({timelimit: 5})
recorder.onComplete = (rec, blob) => {
    recbtn.style.backgroundColor = null
    end = new Date()
    postMemo(blob)
}

let a = false
recbtn.onclick = () => {
    cont.resume()
    if(a == true) {
        a = false
        recorder.finishRecording()
        recbtn.style.backgroundColor = null
        return
    }
    a = true
    recbtn.style.backgroundColor = '#FF0000'
    start = new Date();
    recorder.startRecording()
}

async function postMemo(blob) {
    let fd = new FormData()
    fd.append('blob', blob)
    fd.append('duration', end - start)
    await fetch(api_path, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: fd
    })
}