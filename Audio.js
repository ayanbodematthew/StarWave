//getting our required elements

const recky = document.getElementById("recky")//recorder feature container

const fily = document.getElementById("fily")//file upload and playing container

const zap = document.getElementById("musy")//home music container

const sett = document.getElementById("sett")//settings

const file = document.getElementById("file")//input file element

const sech = document.getElementById("sech")

const supt = document.getElementById("supt")

const wiki = document.getElementById("wiki")

const playlist = [];

var db;

var mediaRec;

sech.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        var ele = sech.value;
        if (ele.match(/[a-z0-9]/)) {
            functs.sechVideo(ele)
            sech.value = "";
        }
    }
}, {
    passive: true
})

supt.addEventListener("click",
    () => {
        document.getElementById("ads").click()
    }, {
        passive: true
    })

sett.addEventListener("click", function() {
    setTimeout(function() {

        var mod = document.getElementById("mod")

        if (window.caty == "set_pad") {
            mod.style.display = "none";
            return;
        }

        var mus = document.getElementById(window.caty)
        var player = document.getElementById("set_pad")

        mod.style.display = "none";
        mus.style.display = "none";
        player.style.display = "block";

        if (window.caty == "wiki_pad") {
            document.getElementById("adss").style.display = "block";
        }
        window.caty = "set_pad";

        if (window.theme !== null && window.theme !== undefined) {
            return;
        }

        var theme = localStorage.getItem("theme")
        var lgtBtn = document.getElementById("lgt")
        var drkBtn = document.getElementById("drk")

        if (theme == 'light') {
            lgtBtn.innerHTML = "<i style='color: #ff001e' class='fa fa-toggle-on'></i>";
        } else if (theme == "dark") {
            drkBtn.innerHTML = "<i style='color: #ff001e' class='fa fa-toggle-on'></i>";
        }

        lgtBtn.addEventListener("click",
            () => {
                localStorage.setItem("theme", "light")
                lgtBtn.innerHTML = "<i style='color: #ff001e' class='fa fa-toggle-on'></i>";
                drkBtn.innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.documentElement.setAttribute('data-theme', "light");
            })

        drkBtn.addEventListener("click", () => {
            localStorage.setItem("theme", "dark")
            drkBtn.innerHTML = "<i style='color: #ff001e' class='fa fa-toggle-on'></i>";
            lgtBtn.innerHTML = "<i class='fa fa-toggle-off'></i>";
            document.documentElement.setAttribute('data-theme', "dark");
        })

        window.theme = "yes";

    },
        300);
}, {
    passive: true
})

recky.addEventListener("click", function() {
    setTimeout(function() {

        var mod = document.getElementById("mod")

        if (window.caty == "rec_pad") {
            mod.style.display = "none";
            return;
        }

        var mus = document.getElementById(window.caty)
        var player = document.getElementById("rec_pad")

        mod.style.display = "none";
        mus.style.display = "none";
        player.style.display = "block";

        if (window.caty == "wiki_pad") {
            document.getElementById("adss").style.display = "block";
        }
        window.caty = "rec_pad";
        user_guide()
        set_recorder()

    },
        300);
}, {
    passive: true
})

zap.addEventListener("click", function() {
    setTimeout(function() {

        var mod = document.getElementById("mod")

        if (window.caty == "mus_pad") {
            mod.style.display = "none";
            return;
        }

        var mus = document.getElementById(window.caty)
        var player = document.getElementById("mus_pad")

        mod.style.display = "none";
        mus.style.display = "none";
        player.style.display = "block";

        if (window.caty == "wiki_pad") {
            document.getElementById("adss").style.display = "block";
        }
        window.caty = "mus_pad";

    },
        300);
}, {
    passive: true
})

wiki.addEventListener("click", () => {
    setTimeout(function() {

        var mod = document.getElementById("mod")

        if (window.caty == "wiki_pad") {
            mod.style.display = "none";
            return;
        }

        if (window.caty !== "") {
            var mus = document.getElementById(window.caty)
            var player = document.getElementById("wiki_pad")

            mod.style.display = "none";
            mus.style.display = "none";
            player.style.display = "block";
        }
        document.getElementById("adss").style.display = "none";
        window.caty = "wiki_pad";

        var sen = document.getElementById("sen")
        var hist = document.getElementById("hist")

        sen.addEventListener("click", () => {

            var con = document.getElementById("con")

            if (con.innerHTML.match(/[a-z0-9]/)) {

                var apiKey = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(con.innerHTML)}&format=json&origin=*`;

                fetch(apiKey).then(resp => resp.json()).then(data => {

                    const result = data.query.search;

                    const cont = document.getElementById("w_pasty")

                    if (result.length <= 0) {
                        cont.innerHTML = `<div class='snip'>
                        <div class='nipy'> <b>No results found</b> </div>
                        </div>`;
                        return;
                    }

                    result.forEach(res => {

                        var arty = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${encodeURIComponent(res.title)}&format=json&origin=*`;

                        fetch(arty).then(ret => ret.json()).then(retn => {

                            var Id = Object.keys(retn.query.pages)[0]

                            var article = retn.query.pages[Id]

                            var elem = `<div class='snip'>
                            <div class='tity'>${article.title}</div>
                            <div class='nipy'> <b>${article.extract}</b> </div>
                            </div>`;

                            cont.insertAdjacentHTML("beforeend", elem);

                        }).catch(err2 => {
                            console.error("Error_2: ", err2)
                        })

                    })

                }).catch(err => {
                    console.error("Error: ", err)
                })

                functs.savSech(con.innerHTML)

            }

            con.innerHTML = "";

        },
            {
                passive: true
            })

        hist.addEventListener("click", () => {

            var mod = document.getElementById("mod4");
            mod.style.display = "block";

            var ele = document.getElementById("oths")
            if (ele.innerHTML !== "") {
                return;
            }

            functs.modCls("mod4")
            functs.getWikiSech()

        },
            {
                passive: true
            })

    },
        300);
}, {
    passive: true
})

fily.addEventListener("click", function() {
    setTimeout(function() {

        var mod = document.getElementById("mod")
        mod.style.display = "block";

        functs.modCls("mod")

        var fil = document.getElementById("filii")

        fil.addEventListener("click",
            () => {

                var mod = document.getElementById("mod")

                if (window.caty == "play_pad") {
                    mod.style.display = "none";
                    return;
                }

                var mus = document.getElementById(window.caty)
                var player = document.getElementById("play_pad")
                mod.style.display = "none";
                mus.style.display = "none";
                player.style.display = "block";

                if (window.caty == "wiki_pad") {
                    document.getElementById("adss").style.display = "block";
                }
                window.caty = "play_pad";
                user_guide2()

            })

        var fol = document.getElementsByClassName("filo")[0]
        var fol2 = document.getElementsByClassName("filo2")[0]

        fol2.addEventListener("click",
            () => {

                var dop = document.getElementById("dop")
                dop.style.display = "block";
                functs.modCls("dop")

                var oth = document.getElementById("oth")

                if (oth.innerHTML == "") {
                    functs.getRecs();
                }

            })

        fol.addEventListener("click",
            () => {
                document.getElementById("file").click()
            })

    },
        300);
}, {
    passive: true
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

        functs.savFile(id, name, "file")

    }
}, {
    passive: true
})

const set_recorder = () => {

    if (window.recorder == "yes") {
        return;
    }
    window.recorder = "yes";
    var secs = 0;
    var init = "";
    var puse = "no";

    const startBtn = document.getElementById("start")//button to start recording

    const stopBtn = document.getElementById("stop")//button to stop recording

    const pauseBtn = document.getElementById("pause")//button to pause recording

    const cancBtn = document.getElementById("canc")//button to cancel recording

    const contBtn = document.getElementById("continue")//button to continue the recording

    const handlesuccess = function(stream) {

        if (init == "yes") {
            init = "";
        }

        //getting things ready for recording
        mediaRec = new MediaRecorder(stream)
        const audioChunk = [];

        mediaRec.ondataavailable = e => {
            //push stream into array when data is available
            audioChunk.push(e.data)
        }

        mediaRec.onstop = () => {
            //stop all tracks to release the microphone
            stream.getTracks().forEach(track => track.stop())

            document.getElementsByClassName("curt2")[0].innerHTML = functs.getFormat(secs)

            secs = "";

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

                var id = "";
                for (var i = 0; i < 5; i++) {
                    var rand = Math.floor(Math.random() * 9)
                    id += rand;
                }
                var nam = `StarWave_${id}.wav`;
                functs.savFile(id, nam, "recs")

            }
        }

        mediaRec.start()

        setInterval(function() {
            if (puse == "yes" || secs == "") {
                return;
            }

            document.getElementsByClassName("curt2")[0].innerHTML = functs.getFormat(secs)
            secs++;
        },
            1000)

    }

    //binding event listener to the start button

    startBtn.addEventListener("click",
        function() {
            //create access to media element using navigator.
            //only audio is being used here.

            stopBtn.style.color = "#ff001e";
            stopBtn.style.border = "#ff001e 0.01em solid";
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

        },
        {
            passive: true
        })

    stopBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "var(--clr1)";
            stopBtn.style.border = "none";
            stopBtn.classList.remove("animate")

            startBtn.style.visibility = "visible";
            stopBtn.style.visibility = "hidden";
            pauseBtn.style.visibility = "hidden";
            cancBtn.style.visibility = "hidden";

            secs = 0;
            mediaRec.stop()
        },
        {
            passive: true
        })

    pauseBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "var(--clr1)";
            stopBtn.style.border = "none";
            stopBtn.classList.remove("animate")

            stopBtn.disabled = true;
            cancBtn.disabled = true;

            contBtn.style.color = "#ff001e";
            contBtn.style.border = " #ff001e 0.01em solid";

            pauseBtn.style.visibility = "hidden";
            contBtn.style.visibility = "visible";
            puse = "yes";

            mediaRec.pause()
        },
        {
            passive: true
        })

    contBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "#ff001e";
            stopBtn.style.border = " #ff001e 0.01em solid";
            stopBtn.classList.add("animate")

            stopBtn.disabled = false;
            cancBtn.disabled = false;

            contBtn.style.color = "var(--clr1)";
            contBtn.style.border = "none";

            pauseBtn.style.visibility = "visible";
            contBtn.style.visibility = "hidden";
            puse = "no";

            mediaRec.resume()
        },
        {
            passive: true
        })

    cancBtn.addEventListener("click",
        function() {
            stopBtn.style.color = "var(--clr1)";
            stopBtn.style.border = "none";
            stopBtn.classList.remove("animate")

            startBtn.style.visibility = "visible";
            stopBtn.style.visibility = "hidden";
            pauseBtn.style.visibility = "hidden";
            cancBtn.style.visibility = "hidden";

            init = "yes";
            puse = "yes";
            secs = 0;
            mediaRec.stop()
        },
        {
            passive: true
        })

}

//setting controls

const setCtrls = () => {

    if (window.ctrls == "yes") {
        return;
    }

    const ply = document.getElementById("ply")//for playing the recordings

    const pus = document.getElementById("pus")//for pausing the played recordings

    const stp = document.getElementById("stp")//for stoping the played recordings

    var elem = document.getElementById("audy")

    ply.addEventListener("click",
        function() {

            var url = elem.getAttribute("src")
            if (!url) {
                console.log("no url")
                return;
            }

            var slider = document.getElementById("slider")

            function timeUpdate() {
                var curr = elem.currentTime;
                var dura = elem.duration;

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

                var time = (val / 100) * elem.duration;
                elem.currentTime = time;

            }
            elem.play();

            elem.ontimeupdate = timeUpdate
            slider.addEventListener("input", handleInput)

        },
        {
            passive: true
        })

    pus.addEventListener("click",
        function() {
            var url = elem.getAttribute("src")
            if (!url) {
                console.log("no url")
                return;
            }
            elem.pause()
        },
        {
            passive: true
        })

    stp.addEventListener("click",
        function() {
            var url = elem.getAttribute("src")
            if (!url) {
                console.log("no url")
                return;
            }
            elem.pause()
            elem.currentTime = 0;
        },
        {
            passive: true
        })

}

const functs = {
    sechVideo(elem) {
        const API_KEY = "AIzaSyBhTnzMRBDVI__Lo45OGTc1DS_MV6VQWIc";

        const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(elem)}&type=video&maxResults=5&key=${API_KEY}`;

        var disp = document.getElementById("pasty")

        async function sech() {

            try {
                /* code */
                const response = await fetch(endpoint);
                const data = await response.json();

                data.items.forEach(item => {
                    const videoId = item.id.videoId;

                    // Create an iframe element
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${videoId}`;
                    iframe.width = '100%';
                    iframe.height = '150vw';
                    iframe.frameBorder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;

                    // Add iframe to the results container
                    if (disp.innerHTML.includes("Error") || disp.innerHTML.includes("Search")) {
                        disp.innerHTML = "";
                    }

                    disp.appendChild(iframe);

                });

            } catch (e) {
                disp.innerHTML = `<div style='padding: 2vw'> <b>Error</b> <br><br> ${e.message} </div>`;
            }

        }

        sech();

    },
    getFormat(secs) {
        var min = Math.floor(secs/60)
        var remSecs = Math.floor(secs%60)
        return `${String(min).padStart(2,
            '0')}:${String(remSecs).padStart(2,
            '0')}`;
    },
    savSech(title) {
        let data = {
            title: title
        }

        let oth = document.getElementById("oths")
        if (oth.innerHTML.includes(title)) {
            return;
        }

        const transaction = db.transaction("Searchs",
            "readwrite");
        const store = transaction.objectStore("Searchs");
        store.add(data);

        transaction.oncomplete = () => {
            console.log("Data added successfully");
            functs.setSechs(title)
        };

        transaction.onerror = (event) => {
            console.error("Transaction error:",
                event.target.error);
        };
    },
    savFile(id,
        nam,
        tag) {
        const addData = (data) => {
            const transaction = db.transaction("Records",
                "readwrite");
            const store = transaction.objectStore("Records");
            store.add(data);

            transaction.oncomplete = () => {
                console.log("Data added successfully");

                functs.setNewRec(nam,
                    window.urli,
                    id,
                    tag)
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
            nam: nam,
            blob: window.blob
        });
    },
    setNewRec(nam,
        url,
        id, tag) {

        if (tag == "file") {

            var namy = document.getElementsByClassName("ply_nam")[0]
            namy.innerHTML = nam;

            var slider = document.getElementById("pls")

            var tim = document.getElementsByClassName("curt")[0]

            var dur = document.getElementsByClassName("durt")[0]

            var audy = document.getElementById("aud_ply")
            audy.setAttribute("src", url)

            function timeUpdate() {
                var curr = audy.currentTime;
                var dura = audy.duration;

                var change = Math.floor((curr/dura) * 100);

                slider.style.backgroundSize = `${change}% 100%`;
                slider.value = change;

                tim.innerHTML = functs.getFormat(curr)

                dur.innerHTML = functs.getFormat(dura)
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

            audy.ontimeupdate = timeUpdate;
            slider.addEventListener("input", handleInput, {
                passive: true
            })

            var ply = document.getElementById("ple")
            var pus = document.getElementById("pue")
            var nxt = document.getElementById("nxt")
            var prv = document.getElementById("prv")

            ply.addEventListener("click", () => {
                audy.play()
                ply.style.display = "none";
                pus.style.display = "inline-block";
                window.ply_id = id;
            }, {
                passive: true
            })

            pus.addEventListener("click", () => {
                audy.pause()
                pus.style.display = "none";
                ply.style.display = "inline-block";
            }, {
                passive: true
            })

            nxt.addEventListener("click", () => {

                var ply_id = window.ply_id;

                if (ply_id !== null && ply_id !== undefined) {
                    var idx = playlist.indexOf(ply_id)

                    if (idx == playlist.length - 1) {
                        return;
                    } else if (playlist.length > 1) {
                        var new_id = playlist[idx+1]

                        document.getElementById(`aud${new_id}`).click()
                    }

                }

            },
                {
                    passive: true
                })

            prv.addEventListener("click",
                () => {

                    var ply_id = window.ply_id;

                    if (ply_id !== null && ply_id !== undefined) {
                        var idx = playlist.indexOf(ply_id)

                        if (playlist.length > 1 && idx !== 0) {
                            var new_id = playlist[idx-1]

                            document.getElementById(`aud${new_id}`).click()
                        }

                    }

                },
                {
                    passive: true
                })

            ply.click()
            return;

        } else {

            var audy = document.getElementById("audy")
            audy.setAttribute("src", url)

            document.getElementsByClassName("ply_nam2")[0].innerHTML = nam;

            setCtrls()

        }

    },
    modCls(id) {
        var mod = document.getElementById(id)
        var cls = document.getElementById("cls")
        window.onclick = function(e) {
            if (e.target == mod || e.target == cls) {
                mod.style.display = "none";
            }
        }
    },
    setSechs(title) {
        var Id = "";
        for (var i = 0; i < 5; i++) {
            var rand = Math.floor(Math.random() * 5)
            Id += rand;
        }

        var pad = `<div style='padding:3vw; font-size:3.5vw; margin:1vw; border-bottom: var(--clr6) 0.01em solid; font-weight: bold' id='${Id}'>${title}</div>`;

        document.getElementById("oths").insertAdjacentHTML("beforeend", pad)

        var toy = document.getElementById(Id)

        toy.addEventListener("click", () => {

            var con = document.getElementById("con")
            var ele = toy.innerHTML;

            ele = ele.replace("<div>", "/n")
            ele = ele.replace("</div>", "")

            con.innerHTML = ele;

            document.getElementById("sen").click()

            document.getElementById("mod4").style.display = "none";

        }, {
            passive: true
        })
    },
    getWikiSech() {
        //read data stored in database
        const transaction = db.transaction("Searchs",
            "readonly");

        const store = transaction.objectStore("Searchs");

        const request = store.openCursor();

        const allData = []; // Array to store all records

        request.onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                allData.push(cursor.value)
                cursor.continue();
            } else {

                allData.forEach(elem => {
                    var title = elem.title;
                    functs.setSechs(title)
                })

            }

        }
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

                allData.forEach(rec => {

                    if (rec.blob !== null && rec.blob !== undefined) {

                        var blob = new Blob([rec.blob], {
                            type: rec.blob.type
                        })

                        var url = URL.createObjectURL(blob)

                        functs.setRecs(rec.nam, url, rec.id)

                        playlist.push(`${rec.id}`)

                    } else {
                        functs.delRec(rec.id, "")
                    }

                })
            }
        };

        request.onerror = (event) => {
            console.error("Cursor error:",
                event.target.error);
        };

    },
    setRecs(nam,
        url,
        id) {

        var roy = window.roy + 1;
        var elem = `<div id='pad${roy}' style='padding: 1vw; display: flex'> <div id='aud${id}' class='tup'> ${nam} </div> <button id='del${id}' class='del'>delete</button> </div>`;

        var oth = document.getElementById("oth");

        if (oth.innerHTML !== "") {
            oth.insertAdjacentHTML("beforeend", elem)
        } else {
            oth.innerHTML = elem;
        }
        window.roy = roy;

        //Event listener for playing and deleting records
        var ele = document.getElementById(`aud${id}`)
        var del = document.getElementById(`del${id}`)

        //for playing
        ele.addEventListener("click", () => {

            //change color of record name playing
            if (window.ply == "") {
                ele.style.color = "#ff001e";
            } else {
                var tag = window.ply;
                document.getElementById(tag).style.color = "var(--clr1)";
                ele.style.color = "#ff001e";
            }
            window.ply = `aud${id}`;

            functs.setNewRec(nam, url, id, "file")

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
    delRec(id,
        roy) {

        //deleting record from our database
        const transaction = db.transaction("Records",
            "readwrite");

        const store = transaction.objectStore("Records");

        store.delete(id);

        transaction.oncomplete = () => {
            if (roy !== "") {
                document.getElementById(`pad${roy}`).remove()
            }
        };

        transaction.onerror = (event) => {
            console.error("Transaction error:",
                event.target.error);
        };
    }
}

const audEnd = () => {
    var e = document.getElementById("audy")
    e.currentTime = 0;
}

const audEnd2 = () => {

    var g = document.getElementById("aud_ply")
    g.currentTime = 0;

    var ply = document.getElementById("ple")
    var pus = document.getElementById("pue")

    pus.style.display = "none";
    ply.style.display = "inline-block";

    setTimeout(function() {
        document.getElementById("nxt").click()
    }, 150);

}

const handleNotification = (title, body) => {

    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
            body: body,
            icon: './1000025725.png'
        });
    }).catch(err => {
        console.error("Error: ", err)
    });

}

const user_guide = () => {

    const steps = document.querySelectorAll(".highlight");
    let currentStep = 0;
    let Id;
    let prev;

    function showStep(index) {
        steps.forEach((step,
            i) => {
            step.classList.toggle("active",
                i === index);
        });

        if (index == 1) {

            Id = document.getElementById("start")
            Id.style.backgroundColor = "#999";
            window.paint = "start";

            var nxt = document.getElementById("pam").innerHTML;

            document.getElementById("one").insertAdjacentHTML("beforeend", `<br> <div id='pam2'>${nxt}</div>`)

            document.getElementById("pam").remove()

        } else if (index == 2) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#222";

            Id = document.getElementById("ply")
            Id.style.backgroundColor = "#999";
            window.paint = "ply";

            var nxt = document.getElementById("pam2").innerHTML;

            document.getElementById("two").insertAdjacentHTML("beforeend", `<br> <div id='pam3'>${nxt}</div>`)

            document.getElementById("pam2").remove()

        } else if (index == 3) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#222";
            prev.style.color = "#f90";

            Id = document.getElementById("pus")
            Id.style.backgroundColor = "#999";
            window.paint = "pus";

            var nxt = document.getElementById("pam3").innerHTML;

            document.getElementById("three").insertAdjacentHTML("beforeend", `<br> <div id='pam4'>${nxt}</div>`)

            document.getElementById("pam3").remove()

        } else if (index == 4) {

            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#222";

            Id = document.getElementById("stp")
            Id.style.backgroundColor = "#999";
            window.paint = "stp";

        }

        var dec = document.querySelector('#one')
        dec.style.left = "50%";
        dec.style.top = "72%";

        var dec = document.querySelector('#two')
        dec.style.left = "50%";
        dec.style.top = "52%";

        var dec = document.querySelector('#three')
        dec.style.left = "50%";
        dec.style.top = "52%";

        var dec = document.querySelector('#four')
        dec.style.left = "50%";
        dec.style.top = "52%";

        document.getElementById("mod2").style.display = "block";

        document.getElementById("nextBtn").style.display = index < steps.length - 1 ? "block": "none";
        document.getElementById("finishBtn").style.display = index === steps.length - 1 ? "block": "none";

        document.getElementById("nextBtn").addEventListener("click",
            () => {
                currentStep++;
                if (currentStep < steps.length) showStep(currentStep);
            },
            {
                passive: true
            });
    }

    document.getElementById("finishBtn").addEventListener("click",
        () => {

            steps.forEach(step => step.classList.remove("active"));

            localStorage.setItem("visited", "true");

            document.getElementById("mod2").style.display = "none";

            prev = document.getElementById(window.paint)

            prev.style.backgroundColor = "#222";

            window.paint = "";

            document.getElementById("pam4").remove()

        },
        {
            passive: true
        });

    if (!localStorage.getItem("visited"))
        showStep(currentStep)

}

const user_guide2 = () => {

    const steps = document.querySelectorAll(".high");

    let currentStep = 0;
    let Id;
    let prev;

    function showStep(index) {

        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index)
        })

        if (index == 1) {
            Id = document.getElementById("ple")
            Id.style.backgroundColor = "#999";
            window.paint = "ple";

            var nxt = document.getElementById("pan").innerHTML;

            document.getElementById("oney").insertAdjacentHTML("beforeend", `<br> <div id='pan2'>${nxt}</div>`)

            document.getElementById("pan").remove()
        } else if (index == 2) {
            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#222";

            Id = document.getElementById("nxt")
            Id.style.backgroundColor = "#999";
            window.paint = "nxt";

            var nxt = document.getElementById("pan2").innerHTML;

            document.getElementById("twoy").insertAdjacentHTML("beforeend", `<br> <div id='pan3'>${nxt}</div>`)

            document.getElementById("pan2").remove()
        } else if (index == 3) {
            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#222";

            Id = document.getElementById("prv")
            Id.style.backgroundColor = "#999";
            window.paint = "prv";

            var nxt = document.getElementById("pan3").innerHTML;

            document.getElementById("thry").insertAdjacentHTML("beforeend", `<br> <div id='pan4'>${nxt}</div>`)

            document.getElementById("pan3").remove()
        } else if (index == 4) {
            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#222";

            Id = document.getElementById("pkv")
            Id.style.backgroundColor = "#999";
            window.paint = "pkv";

            var nxt = document.getElementById("pan4").innerHTML;

            document.getElementById("fouy").insertAdjacentHTML("beforeend", `<br> <div id='pan5'>${nxt}</div>`)

            document.getElementById("pan4").remove()
        } else if (index == 5) {
            prev = document.getElementById(window.paint)
            prev.style.backgroundColor = "#222";

            Id = document.getElementById("pku")
            Id.style.backgroundColor = "#999";
            window.paint = "pku";
        }

        var dec = document.querySelector('#oney')
        dec.style.left = "50%";
        dec.style.top = "66%";

        var dec = document.querySelector('#twoy')
        dec.style.left = "50%";
        dec.style.top = "66%";

        var dec = document.querySelector('#thry')
        dec.style.left = "50%";
        dec.style.top = "66%";

        var dec = document.querySelector('#fouy')
        dec.style.left = "50%";
        dec.style.top = "41%";

        var dec = document.querySelector('#fivy')
        dec.style.left = "50%";
        dec.style.top = "48%";

        document.getElementById("mod2").style.display = "block";

        document.getElementById("nextBtn2").style.display = index < steps.length - 1 ? "block": "none";
        document.getElementById("finishBtn2").style.display = index === steps.length - 1 ? "block": "none";

        document.getElementById("nextBtn2").addEventListener("click",
            () => {
                currentStep++;
                if (currentStep < steps.length) showStep(currentStep);
            },
            {
                passive: true
            });

    }

    document.getElementById("finishBtn2").addEventListener("click",
        () => {

            steps.forEach(step => step.classList.remove("active"));

            localStorage.setItem("visited2", "true");

            document.getElementById("mod2").style.display = "none";

            prev = document.getElementById(window.paint)

            prev.style.backgroundColor = "#222";

            window.paint = "";

            document.getElementById("pan5").remove()

        },
        {
            passive: true
        })

    if (!localStorage.getItem("visited2"))
        showStep(currentStep)
}

window.onload = function() {

    const savedTheme = localStorage.getItem("theme")

    if (!savedTheme) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark': 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./worker.js", {
            scope: "./"
        }).then(res => {
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
    window.caty = "";
    window.recorder = "";
    window.ctrls = "";

    //create an instance of indexedDB database
    const request = indexedDB.open("StarWave_DB", 2);

    request.onupgradeneeded = (event) => {
        db = event.target.result;

        // Create an object store if it doesn't exist
        if (!db.objectStoreNames.contains("Records")) {
            db.createObjectStore("Records", {
                keyPath: "id"
            }); // Specify a keyPath
        }

        if (!db.objectStoreNames.contains("Searchs")) {
            db.createObjectStore("Searchs", {
                keyPath: "title"
            })
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        setTimeout(function() {
            wiki.click()
        }, 50);
    };

    request.onerror = (event) => {
        console.error("Database error:",
            event.target.error);
    };

    const tits = "Welcome Message";
    const bod = "Hello there, it's good to have you here on StarWave. \nStarWave has made learning easier for you, watch videos from youtube, search for solutions to problems and also record and playback audio - for ease of note taking.\nStarWave uses ads for generating income and revenue for growth and development.\nWe are but a young but growing ecosystem with hope to build on more and more functionalities, thank you for joining us.";

    if (Notification.permission == 'granted') {
        var check = localStorage.getItem("noty")
        if (check !== "yeah") {
            handleNotification(tits, bod)
            localStorage.setItem("noty", "yeah")
        }
    } else {
        Notification.requestPermission().then(permission => {
            if (permission == 'granted') {
                handleNotification(tits, bod)
            }
        });
    }

}