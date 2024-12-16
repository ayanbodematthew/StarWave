//getting our required elements

const startBtn = document.getElementById("start")//button to start recording

const stopBtn = document.getElementById("stop")//button to stop recording

const pauseBtn = document.getElementById("pause")//button to pause recording

const cancBtn = document.getElementById("canc")//button to cancel recording

const contBtn = document.getElementById("continue")//button to continue the recording

/* function to oversee the recording, processing, playing and sending the audio to the server.
*/

const handlesuccess = function(stream) {

    var secs = 0;
    var init = "";

    //getting things ready for recording
    const mediaRec = new MediaRecorder(stream)
    const audioChunk = [];

    mediaRec.ondataavailable = e => {
        //push stream into array when data is available
        audioChunk.push(e.data)
    }

    mediaRec.onstop = () => {

        secs = "";
        //stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())

        if (init == "") {

            //converting chunk into blob
            const blob = new Blob(audioChunk, {
                type: "audio/wav"
            })

            //uploading to server
            const formdata = new FormData()
            formdata.append("audio", blob, "recording.wav")

            fetch("https://path_to_your_server/upload", {
                method: "POST",
                body: formdata
            }).then(res => {
                console.log("Upload successful: ", res)
            }).catch(err => {
                console.error("Upload error: ", err)
            })

            //generating url for audio Blob
            const url = URL.createObjectURL(blob)

            //creating an audio element to play the audio record
            var elem = document.getElementById("audy")
            elem.setAttribute("src", url)

            setCtrls(url)

        }
    }

    mediaRec.start()

    const getFormat = (secs) => {
        var min = Math.floor(secs/60)
        var remSecs = Math.floor(secs%60)
        return `${String(min).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
    }

    setInterval(function() {
        if (typeof secs == "number") {
            secs++;
            var format = getFormat(secs)
            rept.innerHTML = format;
        }
    },
        1000)

    //binding event listener to stop button

    stopBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "#fff";
            stopBtn.style.border = "none";
            stopBtn.classList.remove("animate")

            startBtn.style.visibility = "visible";
            stopBtn.style.visibility = "hidden";
            pauseBtn.style.visibility = "hidden";
            cancBtn.style.visibility = "hidden";
            mediaRec.stop()
        })

    pauseBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "#fff";
            stopBtn.style.border = "none";
            stopBtn.classList.remove("animate")

            contBtn.style.color = "#f44336";
            contBtn.style.border = " #f44336 0.01em solid";

            pauseBtn.style.visibility = "hidden";
            contBtn.style.visibility = "visible";
            secs = `${secs}`;

            mediaRec.pause()
        })

    contBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "#f44336";
            stopBtn.style.border = " #f44336 0.01em solid";
            stopBtn.classList.add("animate")

            contBtn.style.color = "#fff";
            contBtn.style.border = "none";

            pauseBtn.style.visibility = "visible";
            contBtn.style.visibility = "hidden";
            secs = parseInt(secs);

            mediaRec.resume()
        })

    cancBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "#fff";
            stopBtn.style.border = "none";
            stopBtn.classList.remove("animate")

            startBtn.style.visibility = "visible";
            stopBtn.style.visibility = "hidden";
            pauseBtn.style.visibility = "hidden";
            cancBtn.style.visibility = "hidden";

            rept.innerHTML = "";
            init = "yes";
            mediaRec.stop()
        })

}

//binding event listener to the start button

startBtn.addEventListener("click", function() {
    //create access to media element using navigator.
    //only audio is being used here.

    stopBtn.style.color = "#f44336";
    stopBtn.style.border = "#f44336 0.01em solid";
    stopBtn.classList.add("animate")

    startBtn.style.visibility = "hidden";
    stopBtn.style.visibility = "visible";
    pauseBtn.style.visibility = "visible";
    cancBtn.style.visibility = "visible";

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(handlesuccess).catch(err => {
        console.error("Error: ", err)
    })
})

const setCtrls = (url) => {

    const ply = document.getElementById("ply")//for playing the recordings

    const pus = document.getElementById("pus")//for pausing the played recordings

    const stp = document.getElementById("stp")//for stoping the played recordings

    const dwl = document.getElementById("dwl")//for saving the recordings by downloading

    var elem = document.getElementById("audy")

    ply.addEventListener("click",
        function() {

            var audy = document.getElementById("audy")
            var slider = document.getElementById("slider")

            function timeUpdate() {
                var curr = audy.currentTime;
                var dura = audy.duration;

                var change = Math.floor((curr/dura) * 100);

                slider.style.backgroundSize = `${change}% 100%`;
                slider.value = change;
            }

            function handleInput(e) {

                var target = e.target;

                var min = target.min;
                var max = target.max;
                var val = target.value;

                var change = (val/max) * 100;

                target.style.backgroundSize = `${change}% 100%`;

                var time = (val / 100) * audy.duration;
                audy.currentTime = time;

            }

            elem.play()
            audy.ontimeupdate = timeUpdate
            slider.addEventListener("input", handleInput)

        })

    pus.addEventListener("click",
        function() {
            elem.pause()
        })

    stp.addEventListener("click",
        function() {
            elem.pause()
            elem.currentTime = 0;
        })

    dwl.addEventListener("click",
        function() {

            var id = "";
            for (var i = 0; i < 5; i++) {
                var rand = Math.floor(Math.random() * 9)
                id += rand;
            }
            var sav = document.getElementById("download")
            sav.href = url;
            sav.download = `StarWave_${id}.wav`;
            sav.click()

            var ads = document.getElementById("ads")
            ads.click()
        })

}

window.onload = function() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("https://starwave.onrender.com/worker.js").then(res => {
            console.log("worker registered successfully: ", res)
        }).catch(err => {
            console.error("worker error: ", err)
            alert(err)
        })
    }
}
