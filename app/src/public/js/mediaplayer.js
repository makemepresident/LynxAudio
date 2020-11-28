let playpause = document.getElementById("playpausepath")
let currenttime = document.getElementById("currenttime")
let totaltime = document.getElementById("totaltime")
let dot = document.getElementById("progressdot")
let progress = document.getElementById("progress")
let audiocontroller = document.getElementById("audiocontroller")
let audiosource = document.getElementById("audiosource")
let loading = document.getElementById("loading")
let playpausevis = document.getElementById("playpausevis")
let slider = document.getElementById("slider")

audiocontroller.onloadedmetadata = () => {
    loading.style = "display: none"
    playpausevis.style = "display: visible"
    let totalseconds = audiocontroller.duration.toFixed(2)
    totaltime.innerHTML = totalseconds

    document.onmouseup = (event) => {
        dot.onmousemove = null;
    }
    
    dot.onmousedown = (event) => {
        event = event || window.event
        event.preventDefault()
    
        let x = event.clientX
        let min = 0
        let max = parseInt(window.getComputedStyle(slider).width)
        let current = parseInt(window.getComputedStyle(progress).width)
    
        console.log(max)
        console.log(current)
    
        dot.onmousemove = (event2) => {
            event2 = event2 || window.event;
            event2.preventDefault();
            
            let calculatedwidth = (event2.clientX - x) + parseInt(current)
            if (calculatedwidth >= 0 && calculatedwidth < max) {
                progress.style = "width: " + ((event2.clientX - x) + current) + "px"

                let ratio = (calculatedwidth / max)
                let value = (ratio * totalseconds)

                audiocontroller.currentTime = value
            }
        }
    }
}

audiocontroller.onended = () => {
    playpause.setAttribute("d", "M 18 12 L 0 24 V 0 0")
    progress.style.width = "0%"
    currenttime.innerHTML = "0.00"
}

audiocontroller.ontimeupdate = () => {
    currenttime.innerHTML = audiocontroller.currentTime.toFixed(2)
    progress.style.width = ((audiocontroller.currentTime / audiocontroller.duration) * 100).toFixed(2) + "%"
}

playpause.onclick = () => {
    if (audiocontroller.paused == true) {
        playpause.setAttribute("d", "M 0 0 L 0 24 L 6 24 L 6 0 M 18 0 L 18 24 L 12 24 L 12 0")
        audiocontroller.play()
    } else {
        playpause.setAttribute("d", "M 18 12 L 0 24 V 0 0")
        audiocontroller.pause()
    }
}

audiosource.src = "../uploads/3b7e7251bfec10f7751fb574188f7b65"
audiocontroller.load()