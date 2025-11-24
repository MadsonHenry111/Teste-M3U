function checkLogin() {
    if (localStorage.getItem("logged") !== "yes") {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("logged");
    window.location.href = "login.html";
}

// ------ PLAYER -------
let hls;

function play(url) {
    const video = document.getElementById("video");

    if (hls) hls.destroy();

    if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
    } else {
        video.src = url;
    }
}

// ------ M3U PARSER -------
async function loadM3U() {
    const response = await fetch("canais.m3u");
    const text = await response.text();

    const lines = text.split("\n");
    const channels = document.getElementById("channels");

    let name = "";
    let logo = "";

    lines.forEach(line => {
        if (line.startsWith("#EXTINF")) {
            const info = line.split(",");
            name = info[1];
            
            const logoMatch = line.match(/tvg-logo="(.*?)"/);
            logo = logoMatch ? logoMatch[1] : "";
        } 
        else if (line.startsWith("http")) {
            const url = line.trim();
            channels.innerHTML += `
                <div class="channel" onclick="play('${url}'); loadEPG('${name}');">
                    <strong>${name}</strong>
                </div>
            `;
        }
    });
}

// ------ EPG -------
async function loadEPG(channelName) {
    const epgList = document.getElementById("epg-list");
    epgList.innerHTML = "<li>Carregando...</li>";

    const response = await fetch("epg.json");
    const epg = await response.json();

    const programs = epg[channelName] || [];

    epgList.innerHTML = programs.length
        ? programs.map(p => `<li>${p.hora} – ${p.titulo}</li>`).join("")
        : "<li>Sem programação disponível</li>";
}