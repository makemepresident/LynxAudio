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

// Bools
let volumeshown = false

// Shows button that takes you back to either myrecordings.html or the homepage depending on where you came from
if (document.referrer.includes("myrecordings.html")) {
    returntorecordings.style = "display: block"
} else {
    returntohome.style = "display: block"
}

// Volume controller handlers

// When you click the volume button on the mediaplayer
volumebutton.onclick = (event) => {
    event.stopPropagation()
    if (!volumeshown) {
        volumeshown = true;
        volumecontainer.style = "visibility: visible;"
        // when the user clicks outside the volume button, hide the volume container
        document.onclick = (event) => {
            if (!volumecontroller.contains(event.target)) {
                volumeshown = false;
                volumecontainer.style = "visibility: hidden;"
            }
        }
    // if the user clicks the volume button again, hide the volume container
    } else {
        volumeshown = false;
        volumecontainer.style = "visibility: hidden;"
    }
}

// Reset the onmousemove to null to stop from being changed accidentally
volumedot.onmouseup = () => {
    window.onmousemove = null
}

// Finds where the user clicked the volume button and increments or decrements the width of the progress bar depending
// on where the mouse moves to
volumedot.onmousedown = (event) => {
    let x = event.clientX
    let min = 0
    let max = parseInt(window.getComputedStyle(volumeslider).width)
    let current = parseInt(window.getComputedStyle(volumeprogress).width)

    // Appended to window just in case the user moves the mouse off the volume dot while still clicked down
    // When the user moves their mouse, calculate the portion it moved and update accordingly
    window.onmousemove = (event2) => {
        let calculatedwidth = (event2.clientX - x) + parseInt(current)
        if (calculatedwidth >= min && calculatedwidth < max) {
            let ratio = (calculatedwidth / max)
            // Change the volume of the controller, automatically calls onvolumechange()
            audiocontroller.volume = ratio.toFixed(2)
        }
    }
}

// Move the progressbar to where the user moved the dot to
audiocontroller.onvolumechange = () => {
    volumeprogress.style.width = (audiocontroller.volume * 100) + "%"
}

// Audio controller handers

// When you click the play/pause button
playpause.onclick = () => {
    // If it is currently paused
    if (audiocontroller.paused == true) {
        // Change the style to a pause button and play the recording
        playpausepath.setAttribute("d", "M 0 0 L 0 24 L 6 24 L 6 0 M 18 0 L 18 24 L 12 24 L 12 0")
        audiocontroller.play()
    } else {
        // Change the style to a play button and pause the recording
        playpausepath.setAttribute("d", "M 18 12 L 0 24 V 0 0")
        audiocontroller.pause()
    }
}

// When the controller has loaded the file properly
audiocontroller.onloadedmetadata = () => {
    // Hide the loading icon
    loading.style = "display: none"
    // Show the play/pause icon
    playpausevis.style = "display: visible"
    // Update the clip length html
    let totalseconds = audiocontroller.duration.toFixed(2)
    totaltime.innerHTML = totalseconds

    // Reset the onmousemove to null to stop from being changed after mouse button is lifted
    window.onmouseup = () => {
        window.onmousemove = null;
    }
    
    // Finds where the user clicked the srub button and increments or decrements the width of the progress bar depending
    // on where the mouse moves to
    dot.onmousedown = (event) => {
        let x = event.clientX
        let min = 0
        let max = parseInt(window.getComputedStyle(slider).width)
        let current = parseInt(window.getComputedStyle(progress).width)
    
        // Appended to window just in case the user moves the mouse off the scrubbing dot while still clicked down
        // When the user moves their mouse, calculate the portion it moved and update accordingly
        window.onmousemove = (event2) => {
            let calculatedwidth = (event2.clientX - x) + parseInt(current)
            if (calculatedwidth >= min && calculatedwidth <= max) {
                let ratio = (calculatedwidth / max)
                let value = (ratio * totalseconds)
                // Change the current time of the controller, automatically calls ontimeupdate()
                audiocontroller.currentTime = value
            }
        }
    }
}

// Move progress bar to where the current time is and update the current time html
audiocontroller.ontimeupdate = () => {
    currenttime.innerHTML = audiocontroller.currentTime.toFixed(2)
    progress.style.width = ((audiocontroller.currentTime / audiocontroller.duration) * 100).toFixed(2) + "%"
}

// When the playback is finished, reset the player back to the beginning and make the pause button a play button
audiocontroller.onended = () => {
    playpausepath.setAttribute("d", "M 18 12 L 0 24 V 0 0")
    progress.style.width = "0%"
    currenttime.innerHTML = "0.00"
}