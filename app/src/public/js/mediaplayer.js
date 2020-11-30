// Play/Pause/Loading
let playpause = document.getElementById("playpause")
let playpausepath = document.getElementById("playpausepath")
let playpausevis = document.getElementById("playpausevis")
let loading = document.getElementById("loading")

// Audio text elements
let currenttime = document.getElementById("currenttime")
let totaltime = document.getElementById("totaltime")

// Progress Elements
let progress = document.getElementById("progress")
let slider = document.getElementById("slider")
let dot = document.getElementById("progressdot")

// Controller
let audiocontroller = document.getElementById("audiocontroller")
let audiosource = document.getElementById("audiosource")

// Volume controller
let volumebutton = document.getElementById("volumebutton")
let volumecontroller = document.getElementById("volumecontainer")
let volumeslider = document.getElementById("volslider")
let volumeprogress = document.getElementById("volprogress")
let volumedot = document.getElementById("voldot")

// Buttons
let returntohome = document.getElementById("returntohome")
let returntorecordings = document.getElementById("returntorecordings")

let volumeshown = false

if (document.referrer.includes("myrecordings.html")) {
    returntorecordings.style = "display: block"
} else {
    returntohome.style = "display: block"
}

// Volume button handlers

volumebutton.onclick = (event) => {
    event.stopPropagation()
    if (!volumeshown) {
        volumeshown = true;
        volumecontainer.style = "visibility: visible;"
        document.onclick = (event) => {
            if (!volumecontroller.contains(event.target)) {
                volumeshown = false;
                volumecontainer.style = "visibility: hidden;"
            }
        }
    } else {
        volumeshown = false;
        volumecontainer.style = "visibility: hidden;"
    }
}

volumedot.onmouseup = () => {
    window.onmousemove = null
}

volumedot.onmousedown = (event) => {
    let x = event.clientX
    let min = 0
    let max = parseInt(window.getComputedStyle(volumeslider).width)
    let current = parseInt(window.getComputedStyle(volumeprogress).width)

    window.onmousemove = (event2) => {
        let calculatedwidth = (event2.clientX - x) + parseInt(current)
        if (calculatedwidth >= min && calculatedwidth < max) {
            let ratio = (calculatedwidth / max)
            audiocontroller.volume = ratio.toFixed(2)
        }
    }
}

audiocontroller.onvolumechange = () => {
    volumeprogress.style.width = (audiocontroller.volume * 100) + "%"
}

// Audio controller handers

playpause.onclick = () => {
    if (audiocontroller.paused == true) {
        playpausepath.setAttribute("d", "M 0 0 L 0 24 L 6 24 L 6 0 M 18 0 L 18 24 L 12 24 L 12 0")
        audiocontroller.play()
    } else {
        playpausepath.setAttribute("d", "M 18 12 L 0 24 V 0 0")
        audiocontroller.pause()
    }
}

audiocontroller.onloadedmetadata = () => {
    loading.style = "display: none"
    playpausevis.style = "display: visible"
    let totalseconds = audiocontroller.duration.toFixed(2)
    totaltime.innerHTML = totalseconds

    window.onmouseup = (event) => {
        window.onmousemove = null;
    }
    
    dot.onmousedown = (event) => {
        let x = event.clientX
        let min = 0
        let max = parseInt(window.getComputedStyle(slider).width)
        let current = parseInt(window.getComputedStyle(progress).width)
    
        window.onmousemove = (event2) => {
            let calculatedwidth = (event2.clientX - x) + parseInt(current)
            if (calculatedwidth >= min && calculatedwidth <= max) {
                let ratio = (calculatedwidth / max)
                let value = (ratio * totalseconds)

                audiocontroller.currentTime = value
            }
        }
    }
}

audiocontroller.ontimeupdate = () => {
    currenttime.innerHTML = audiocontroller.currentTime.toFixed(2)
    progress.style.width = ((audiocontroller.currentTime / audiocontroller.duration) * 100).toFixed(2) + "%"
}

audiocontroller.onended = () => {
    playpausepath.setAttribute("d", "M 18 12 L 0 24 V 0 0")
    progress.style.width = "0%"
    currenttime.innerHTML = "0.00"
}