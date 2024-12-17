//getting our required elements

const startBtn = document.getElementById("start")//button to start recording

const stopBtn = document.getElementById("stop")//button to stop recording

const pauseBtn = document.getElementById("pause")//button to pause recording

const cancBtn = document.getElementById("canc")//button to cancel recording

const contBtn = document.getElementById("continue")//button to continue the recording

/* function to oversee the recording, processing, playing and sending the audio to the server.
*/

var db;

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

            //generating url for audio Blob
            const url = URL.createObjectURL(blob)

            //creating an audio element to play the audio record
            var elem = document.getElementById("audy")
            elem.setAttribute("src", url)

            window.urli = url;
            window.blob = blob;

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

    const dwl = document.getElementById("dwl")
    const dwld = document.getElementById("dwld")

    dwld.style.display = "none";
    dwl.style.display = "inline-block";
})

const setCtrls = () => {

    const ply = document.getElementById("ply")//for playing the recordings

    const pus = document.getElementById("pus")//for pausing the played recordings

    const stp = document.getElementById("stp")//for stoping the played recordings

    const dwl = document.getElementById("dwl")//for saving the recordings

    const dwld = document.getElementById("dwld")//for downloading the recordings

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
            var sav = `StarWave_${id}.wav`;

            const addData = (data) => {
                const transaction = db.transaction("Records", "readwrite");
                const store = transaction.objectStore("Records");
                store.add(data);

                transaction.oncomplete = () => {
                    console.log("Data added successfully");

                    functs.setNewRec(sav, window.urli, id)

                    const dwl = document.getElementById("dwl")
                    const dwld = document.getElementById("dwld")

                    dwl.style.display = "none";
                    dwld.style.display = "inline-block";
                };

                transaction.onerror = (event) => {
                    console.error("Transaction error:", event.target.error);
                };
            };

            //save record to database
            addData({
                id: id, nam: sav, blob: window.blob
            });
        })

    //download the audio stream
    dwld.addEventListener("click",
        function() {
            var trigger = document.getElementById("download")
            trigger.href = window.url;
            trigger.download = window.nam;
            trigger.click()
        })

}

const functs = {
    setNewRec(nam,
        url,
        id) {

        var roy = window.roy + 1;
        var elem = `<div id='aud${id}' style='padding: 1vw'> <span style='font-size: 8vw'>&rarr;</span> ${nam} </div> <div id='roy${roy}'></div>`;

        var fog = document.getElementById("loky").innerHTML;

        if (!fog.includes("No Records")) {
            document.getElementById(`roy${window.roy}`).innerHTML = elem;
        } else {
            document.getElementById("loky").innerHTML = elem;
        }
        window.roy = roy;

        var ele = document.getElementById(`aud${id}`)

        ele.addEventListener("click", () => {
            elem = document.getElementById("audy")
            elem.setAttribute("src", url)

            const ply = document.getElementById("ply")
            ply.click()

            const dwl = document.getElementById("dwl")
            const dwld = document.getElementById("dwld")

            dwl.style.display = "none";
            dwld.style.display = "inline-block";
        })

        window.url = url;
        window.nam = nam;
    },
    getRecs() {
        //read data stored in database
        const transaction = db.transaction("Records", "readonly");

        const store = transaction.objectStore("Records");

        const request = store.openCursor();

        const allData = []; // Array to store all records

        request.onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                allData.push(cursor.value); // Add the current record to the array
                cursor.continue(); // Move to the next record
            } else {
                console.log("All data retrieved using cursor");
                console.log(allData)

                allData.forEach(elem => {

                    var url = URL.createObjectURL(elem.blob, {
                        type: "audio/wav"
                    })

                    functs.setNewRec(elem.nam, url, elem.id)

                })
            }
        };

        request.onerror = (event) => {
            console.error("Cursor error:", event.target.error);
        };
    }
}

window.onload = function() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./worker.js").then(res => {
            res.addEventListener("updatefound", () => {
                var update = res.installing;
                console.log(update)
            })
        }).catch(err => {
            console.error("worker error: ", err)
        })
    }

    window.roy = 0;
    setCtrls()

    //create an instance of indexedDB database
    const request = indexedDB.open("StarWave_DB", 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;

        // Create an object store if it doesn't exist
        if (!db.objectStoreNames.contains("Records")) {
            db.createObjectStore("Records", {
                keyPath: "id"
            }); // Specify a keyPath
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        functs.getRecs()
        console.log("Database opened successfully");
    };

    request.onerror = (event) => {
        console.error("Database error:", event.target.error);
    };

}