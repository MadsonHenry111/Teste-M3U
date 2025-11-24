let conteudo = localStorage.getItem("m3uData");
let linhas = conteudo.split("\n");

let canais = [];
let meta = {};

linhas.forEach(l => {
    if (l.startsWith("#EXTINF")) {
        const nome = l.split(",")[1];
        const logoMatch = l.match(/tvg-logo="(.*?)"/);

        meta = {
            nome,
            logo: logoMatch ? logoMatch[1] : "assets/placeholder.png"
        };
    } 
    else if (l.startsWith("http")) {
        canais.push({ ...meta, url: l });
    }
});

const lista = document.getElementById("listaCanais");

canais.forEach(c => {
    let item = document.createElement("div");
    item.className = "canal-item";

    let img = document.createElement("img");
    img.src = c.logo;

    let nome = document.createElement("span");
    nome.innerText = c.nome;

    item.appendChild(img);
    item.appendChild(nome);

    item.onclick = () => tocar(c.url);

    lista.appendChild(item);
});

function tocar(url) {
    const video = document.getElementById("video");

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
    } else {
        video.src = url;
    }

    carregarEPG();
}