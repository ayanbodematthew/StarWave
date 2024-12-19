//getting our required elements

const startBtn = document.getElementById("start")//button to start recording

const stopBtn = document.getElementById("stop")//button to stop recording

const pauseBtn = document.getElementById("pause")//button to pause recording

const cancBtn = document.getElementById("canc")//button to cancel recording

const contBtn = document.getElementById("continue")//button to continue the recording

const rept = document.getElementById("rept")//container for recording timeline

const fily = document.getElementById("fily")//button to choose audio file from filesystem

const file = document.getElementById("file")//input file element

/* function to oversee the recording, processing, playing and sending the audio to the server.
*/

var db;

const handlesuccess = function(stream) {

    var secs = 0;
    var init = "";
    var puse = "no";

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
        if (puse == "no") {
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

            stopBtn.disabled = true;
            cancBtn.disabled = true;

            contBtn.style.color = "#f06";
            contBtn.style.border = " #f06 0.01em solid";

            pauseBtn.style.visibility = "hidden";
            contBtn.style.visibility = "visible";
            puse = "yes";

            mediaRec.pause()
        })

    contBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "#f06";
            stopBtn.style.border = " #f06 0.01em solid";
            stopBtn.classList.add("animate")

            stopBtn.disabled = false;
            cancBtn.disabled = false;

            contBtn.style.color = "#fff";
            contBtn.style.border = "none";

            pauseBtn.style.visibility = "visible";
            contBtn.style.visibility = "hidden";
            puse = "no";

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

            rept.innerHTML = getFormat(0);
            init = "yes";
            puse = "yes";
            secs = 0;
            mediaRec.stop()
        })

}

//binding event listener to the start button

startBtn.addEventListener("click", function() {
    //create access to media element using navigator.
    //only audio is being used here.

    stopBtn.style.color = "#f06";
    stopBtn.style.border = "#f06 0.01em solid";
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

//binding event listener to the file picker button

fily.addEventListener("click", function() {
    setTimeout(function() {
        document.getElementById("file").click()
    }, 300);
})

//binding event listener to the input file

file.addEventListener("change", function() {
    if (this.files && this.files[0]) {

        var name = this.files[0].name;
        var blob = new Blob([this.files[0]], {
            type: this.files[0].type
        })
        var url = URL.createObjectURL(blob)

        var id = "";
        for (var i = 0; i < 5; i++) {
            var rand = Math.floor(Math.random() * 9)
            id += rand;
        }

        window.blob = blob;
        window.urli = url;
        functs.savRecs(id, name)

    }
})

//setting controls

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

            var url = audy.getAttribute("src")
            if (!url) {
                console.log("no url")
                return;
            }

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
            var audy = document.getElementById("audy")

            var url = audy.getAttribute("src")
            if (!url) {
                console.log("no url")
                return;
            }
            elem.pause()
        })

    stp.addEventListener("click",
        function() {
            var audy = document.getElementById("audy")

            var url = audy.getAttribute("src")
            if (!url) {
                console.log("no url")
                return;
            }
            elem.pause()
            elem.currentTime = 0;
        })

    dwl.addEventListener("click",
        function() {
            var audy = document.getElementById("audy")

            var url = audy.getAttribute("src")
            if (!url) {
                console.log("no url")
                return;
            }
            var id = "";
            for (var i = 0; i < 5; i++) {
                var rand = Math.floor(Math.random() * 9)
                id += rand;
            }
            var sav = `StarWave_${id}.wav`;
            functs.savRecs(id, sav)
        })

    //download the audio stream
    dwld.addEventListener("click",
        function() {
            var audy = document.getElementById("audy")

            var url = audy.getAttribute("src")
            if (!url) {
                console.log("no url")
                return;
            }
            var trigger = document.getElementById("download")
            trigger.href = window.url;
            trigger.download = window.nam;
            trigger.click()
        })

}

const functs = {
    savRecs(id,
        sav) {
        const addData = (data) => {
            const transaction = db.transaction("Records",
                "readwrite");
            const store = transaction.objectStore("Records");
            store.add(data);

            transaction.oncomplete = () => {
                console.log("Data added successfully");

                functs.setNewRec(sav,
                    window.urli,
                    id)

                const dwl = document.getElementById("dwl")
                const dwld = document.getElementById("dwld")

                dwl.style.display = "none";
                dwld.style.display = "inline-block";
            };

            transaction.onerror = (event) => {
                console.error("Transaction error:",
                    event.target.error);
            };
        };

        if (!window.blob) {
            console.log("no blob")
            return;
        }

        //save record to database
        addData({
            id: id,
            nam: sav,
            blob: window.blob
        });
    },
    setNewRec(nam,
        url,
        id) {

        //sorting out the records
        var roy = window.roy + 1;
        var elem = `<div id='pad${roy}' style='padding: 1vw; display: flex'> <div id='aud${id}' class='tup'> ${nam} </div> <button id='del${id}' class='del'>delete</button> </div> <div id='roy${roy}'></div>`;

        var fog = document.getElementById("loky").innerHTML;

        if (!fog.includes("No Records")) {
            document.getElementById(`roy${window.roy}`).innerHTML = elem;
        } else {
            document.getElementById("loky").innerHTML = elem;
        }
        window.roy = roy;

        //Event listener for playing and deleting records
        var ele = document.getElementById(`aud${id}`)
        var del = document.getElementById(`del${id}`)

        //for playing
        ele.addEventListener("click", () => {

            //change color of record name playing
            if (window.ply == "") {
                ele.style.color = "#4caf50";
            } else {
                var tag = window.ply;
                document.getElementById(tag).style.color = "#fff";
                ele.style.color = "#f06";
            }
            window.ply = `aud${id}`;

            //set src of the audio element and play
            elem = document.getElementById("audy")
            elem.setAttribute("src", url)

            const ply = document.getElementById("ply")
            ply.click()

            //display download button when playing
            const dwl = document.getElementById("dwl")
            const dwld = document.getElementById("dwld")

            dwl.style.display = "none";
            dwld.style.display = "inline-block";
        })

        //for deleting
        del.addEventListener("click",
            () => {
                setTimeout(function() {
                    functs.delRec(id, roy)
                }, 150);
            })

        window.url = url;
        window.nam = nam;
    },
    getRecs() {
        //read data stored in database
        const transaction = db.transaction("Records",
            "readonly");

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

                //looping through the array of records
                allData.forEach(elem => {

                    var url = URL.createObjectURL(elem.blob, {
                        type: "audio/wav"
                    })

                    //function to sort out each records
                    functs.setNewRec(elem.nam, url, elem.id)

                })
            }
        };

        request.onerror = (event) => {
            console.error("Cursor error:", event.target.error);
        };
    },
    delRec(id, roy) {

        //deleting record from our database
        const transaction = db.transaction("Records", "readwrite");

        const store = transaction.objectStore("Records");

        store.delete(id);

        transaction.oncomplete = () => {
            console.log("Data deleted successfully");
            document.getElementById(`pad${roy}`).remove()
        };

        transaction.onerror = (event) => {
            console.error("Transaction error:", event.target.error);
        };
    }
}

const audEnd = () => {
    var e = document.getElementById("audy")
    e.currentTime = 0;
}

const handleNotification = (title, body) => {

    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
            body: body,
            icon: './Screenshot_20241216-125252_2.png'
        });
    });

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
    window.ply = "";
    window.ply2 = "";
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

document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".highlight");
    let currentStep = 0;
    let Id;
    let prev;

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });

        if (index == 1) {

            Id = document.getElementById("fily")
            Id.style.backgroundColor = "#999";
            window.paint = "fily";

        } else if (index == 2) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#282828";

            Id = document.getElementById("start")
            Id.style.backgroundColor = "#999";
            window.paint = "start";

        } else if (index == 3) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#333";
            prev.style.color = "#f90";

            Id = document.getElementById("ply")
            Id.style.backgroundColor = "#999";
            window.paint = "ply";

        } else if (index == 4) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#333";

            Id = document.getElementById("pus")
            Id.style.backgroundColor = "#999";
            window.paint = "pus";

        } else if (index == 5) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#333";

            Id = document.getElementById("stp")
            Id.style.backgroundColor = "#999";
            window.paint = "stp";

        } else if (index == 6) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#333";

            Id = document.getElementById("dwl")
            Id.style.backgroundColor = "#999";
            window.paint = "dwl";

        } else if (index == 7) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#333";

            Id = document.getElementById("loky")
            Id.style.backgroundColor = "#999";
            window.paint = "loky";
        }

        var dec = document.querySelector('#one')
        dec.style.left = "27%";
        dec.style.top = "82%";

        var dec = document.querySelector('#two')
        dec.style.left = "55%";
        dec.style.top = "82%";

        var dec = document.querySelector('#three')
        dec.style.left = "65%";
        dec.style.top = "82%";

        var dec = document.querySelector('#four')
        dec.style.left = "77%";
        dec.style.top = "82%";

        var dec = document.querySelector('#five')
        dec.style.left = "45%";
        dec.style.top = "82%";

        var dec = document.querySelector('#six')
        dec.style.left = "50%";
        dec.style.top = "175px";

        document.getElementById("mod").style.display = "block";

        document.getElementById("nextBtn").style.display = index < steps.length - 1 ? "block": "none";
        document.getElementById("finishBtn").style.display = index === steps.length - 1 ? "block": "none";
    }

    document.getElementById("nextBtn").addEventListener("click",
        () => {
            currentStep++;
            if (currentStep < steps.length) showStep(currentStep);
        });

    document.getElementById("finishBtn").addEventListener("click",
        () => {

            steps.forEach(step => step.classList.remove("active"));

            localStorage.setItem("visited", "true");

            document.getElementById("mod").style.display = "none";

            prev = document.getElementById(window.paint)

            prev.style.backgroundColor = "transparent";

            window.paint = "";

            const tits = "Welcome Message";
            const bod = "Hello there, it's good to have you here on StarWave. \nStarWave is a platform for recording, playing, saving and downloading audio stream as well as audio files on your filesystem. \nWe are but a young but growing ecosystem with hope to build on more and more functionalities, thank you for joining us.";

            if (Notification.permission === 'granted') {
                handleNotification(tits, bod)
            } else {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('Permission granted for notifications.');
                        handleNotification(tits, bod)
                    }
                });
            }

        });

    if (!localStorage.getItem("visited")) showStep(currentStep);
});