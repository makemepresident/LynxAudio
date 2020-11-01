const cont = new AudioContext()
const sourceNode = new AudioBufferSourceNode(cont)
const recorder = new WebAudioRecorder(sourceNode, {workerDir: '../js/lib/'})
const limit = 5000 // 5s record limit
recorder.setOptions({timelimit: 5})

recorder.onComplete = (rec, blob) => {
    recbtn.style.backgroundColor = null
    console.log('henlo')
    console.log(blob)
}

let recbtn = document.getElementById('recordbutton')
let a = false
recbtn.onclick = () => {
    cont.resume()
    if(a == true) {
        a = false
        recorder.finishRecording()
        recbtn.style.backgroundColor = null
        return
    }
    // change button colour
    // start timer on limit
    // start recording
    a = true
    recbtn.style.backgroundColor = '#FF0000'
    recorder.startRecording()
}