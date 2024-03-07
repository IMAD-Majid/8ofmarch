// variables
const fps = 24;
const bstep = 4;
const spriteWidth = 32;
const xmax = window.innerWidth;
const ymax = window.innerHeight;

const butterfliesContainer = document.getElementById("butterflies");
const heartsContainer = document.getElementById("hearts");
const promptTxt = document.getElementById("prompt");
const envelopBtn = document.querySelector("button");
const envelopIco = envelopBtn.querySelector("img");
const hwdTxt = document.getElementById("hwd");
const noteTxt = document.getElementById("note");
const bouquetImg = document.getElementById("bouquet");
let isopen = false;

// configuration
const specialNotes = {
    "asmae": `
    Bonne journée internationale de la femme, madame Asmae.
    Depuis que je suis arrivée dans l'école, tu as toujours été une mère pour moi, et t'apprécies beaucoup pour être une personne si merveilleuse, et je pris pour que tu continues à l'être comme toujours.
    J'aimerais pouvoir continuer à voir des gens comme vous dans le monde extérieur. Continue d'être toi-même, madame, je t'aime.
    `,
    "master": "old man"
}

const href = location.href
let lang, reciever;
if (href.includes("?l=")) {
    lang = href.slice(href.indexOf("?l=") + 3, href.length).split("?")[0]
}
if (href.includes("?to=")) {
    reciever = href.slice(href.indexOf("?to=") + 4, href.length).split("?")[0]
}

if (lang) {
    switch(lang){
        case "ar":
            promptTxt.textContent = "أريد أن أقول لك شيئا"
            hwdTxt.textContent = "يوم سعيد للمرأة"
            break
        case "fr":
            promptTxt.textContent = "Je veux te dire quelque chose"
            hwdTxt.textContent = "joyeuse journée de la femme"
            break
        case "ch":
            promptTxt.textContent = "我想告诉你一件事"
            hwdTxt.textContent = "妇女节快乐"
    }
    if (lang != 'en' && ['ar', 'fr', 'ch'].includes(lang)){
        promptTxt.textContent += " . . ."
    }
}
if (reciever) {
    noteTxt.textContent = specialNotes[reciever]
}

function openEnvelop() {
    if (isopen) return
    isopen = true;
    document.body.className = "clicked"

    setTimeout(openAnimation, 2000)
}
function openAnimation() {
    document.body.className = "open"
    envelopIco.src = "assets/open.png";
    envelopIco.style.animation = 'none';

    promptTxt.style.display = 'none';
    hwdTxt.style.visibility = "visible";
    if (noteTxt.textContent) {
        noteTxt.style.visibility = "visible";
    }
    bouquetImg.style.visibility = "visible"
    setTimeout(() => {
        generateB()
        setInterval(generateB, 500)

        generateH()
        setInterval(generateH, 1000)
    }, 2000);
}

function generateB() {
    if (butterfliesContainer.children.length >= 8) return

    let bx = Math.random() < 0.5 ? -spriteWidth + 8 : xmax - 8;
    let by = Math.random() * ymax - spriteWidth;
    const tox = bx > xmax / 2 ? -spriteWidth - 1 : xmax + 1;
    const toy = by - (Math.random() * (ymax - by));
    const distance = Math.sqrt(Math.pow(bx - tox, 2) + Math.pow(by - toy, 2))
    const angle = Math.atan2(bx - tox, by - toy) * (180 / Math.PI);
    const xspeed = ((tox - bx) / distance) * bstep;
    const yspeed = ((toy - by) / distance) * bstep;
    let waves = [];

    const newB = document.createElement("img");
    newB.style.top = `${by}px`;
    newB.style.left = `${bx}px`;
    newB.src = `assets/b${Math.floor(Math.random() * 3) + 1}.png`;
    newB.style.rotate = `${angle * -1}deg`;
    butterfliesContainer.appendChild(newB)
    const updateFrame = setInterval(() => {
        bx += xspeed
        by += yspeed
        if (waves.length) {
            by -= yspeed;
            by += waves[0]
            waves = waves.filter((w, i) => i != 0)
        }
        newB.style.left = `${bx}px`;
        newB.style.top = `${by}px`;
        const ex = newB.getBoundingClientRect().left;
        const ey = newB.getBoundingClientRect().top;
        if (
            ex + spriteWidth < 0
            ||
            ex > xmax
            ||
            ey + spriteWidth < 0
            ||
            ey > ymax
        ) {
            newB.remove()
            clearInterval(updateFrame)
        }
    }, 1000 / fps)
    const idleSrc = newB.src;
    const flapSrc = idleSrc.slice(0, idleSrc.indexOf(".png")) + 'f.png';
    const flapSprite = () => {
        newB.src = flapSrc;
        for (let i = 0; i < bstep; i++) {
            waves.push(Math.random() * bstep * (Math.abs(yspeed) / yspeed))
        }
        setTimeout(() => {
            idleSprite()
        }, 250);
    }
    const idleSprite = () => {
        newB.src = idleSrc;
        for (let i = 0; i < bstep; i++) {
            waves.push(Math.random() * bstep / 2 * (Math.abs(yspeed) / yspeed) * -1)
        }
        setTimeout(() => {
            flapSprite()
        }, 1000);
    }
    idleSprite()
}

function generateH() {
    if (heartsContainer.children.length >= 3) return
    const hx = (xmax - spriteWidth) / 2 + Math.random() * 50 - 25;
    const hy = ymax - spriteWidth * 6;
    const heartRange = 250
    const xrange = Math.random() * heartRange - heartRange / 2
    const yrange = -(spriteWidth * 5 + Math.random() * 5 * spriteWidth);

    const newH = document.createElement("img");
    newH.style.left = `${hx}px`;
    newH.style.top = `${hy}px`;
    newH.style.setProperty("--xrange", `${xrange}px`)
    newH.style.setProperty("--yrange", `${yrange}px`)
    newH.src = `assets/heart.png`;
    heartsContainer.appendChild(newH)
    setTimeout(() => {
        newH.remove()
    }, 3000);
}