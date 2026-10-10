/* Da qui in poi è il "motore": non serve toccarlo. */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const caso = (n) => Math.floor(Math.random() * n);
const fine = new Date(document.body.dataset.fine);
const totale = +document.body.dataset.cuori;
const anteprima = location.search.includes("anteprima"); // aggiungi ?anteprima all'indirizzo per saltare il conto alla rovescia
let presi = 0,
  timer;

/* conto alla rovescia */
function aggiorna() {
  const d = fine - new Date();
  if (d <= 0 || anteprima) {
    rivela();
    return;
  }
  $(".n-giorni").textContent = Math.floor(d / 864e5);
  $(".n-ore").textContent = Math.floor(d / 36e5) % 24;
  $(".n-minuti").textContent = Math.floor(d / 6e4) % 60;
  $(".n-secondi").textContent = Math.floor(d / 1e3) % 60;
}
function rivela() {
  clearInterval(tic);
  document.body.classList.remove("attesa");
  $(".cielo").classList.add("vivo");
}
const tic = setInterval(aggiorna, 1000);
aggiorna();

/* contenuti che compaiono scorrendo */
const osserva = new IntersectionObserver(
  (el) =>
    el.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visibile");
    }),
  { threshold: 0.2 },
);
$$(".da-sotto").forEach((e) => osserva.observe(e));
$(".freccia").onclick = () =>
  $(".sotto").scrollIntoView({ behavior: "smooth" });

/* finestra */
function apri(html) {
  $(".contenuto").innerHTML = html;
  $(".finestra").classList.remove("nascosto");
}
$(".finestra .chiudi").onclick = () => $(".finestra").classList.add("nascosto");
$(".finestra").onclick = (e) => {
  if (e.target === $(".finestra")) $(".finestra").classList.add("nascosto");
};

/* stelle */
$$(".stella").forEach(
  (s) =>
    (s.onclick = () => {
      let h = "";
      if (s.dataset.foto)
        h += `<img src="${s.dataset.foto}" alt="" onerror="this.classList.add('rotta')">`;
      h += `<h2 class="nome">${s.title}</h2><p>${s.dataset.testo || ""}</p>`;
      apri(h);
      s.classList.add("letta");
    }),
);

/* luna e gioco (si può rigiocare quante volte si vuole) */
function lettera() {
  apri('<div class="lettera">' + $(".testo-lettera").innerHTML + "</div>");
}
function chiudiGioco() {
  clearInterval(timer);
  $(".campo").innerHTML = "";
  $(".gioco").classList.add("nascosto");
}
function avvia() {
  clearInterval(timer);
  presi = 0;
  $(".n-presi").textContent = 0;
  $(".n-totale").textContent = totale;
  $(".campo").classList.remove("fine");
  $(".campo").innerHTML = "";
  $(".gioco").classList.remove("nascosto");
  timer = setInterval(nuovoCuore, 600);
}
function nuovoCuore() {
  const c = document.createElement("button");
  c.className = `cuore corsia-${caso(10)} vel-${caso(3)}`;
  c.textContent = "♥";
  c.onpointerdown = () => {
    c.remove();
    $(".n-presi").textContent = ++presi;
    if (presi >= totale) vittoria();
  };
  c.onanimationend = () => c.remove();
  $(".campo").appendChild(c);
}
function vittoria() {
  clearInterval(timer);
  $(".campo").classList.add("fine");
  $(".campo").innerHTML =
    `<span class="busta">💌</span><p class="vittoria">Ce l'hai fatta! Hai ottenuto un regalo!</p>
    <button class="bottone apri">Apri</button><button class="bottone ancora">Gioca ancora</button>`;
}
$(".luna").onclick = avvia;
$(".esci").onclick = chiudiGioco;
$(".campo").onclick = (e) => {
  if (e.target.matches(".apri")) {
    chiudiGioco();
    lettera();
  }
  if (e.target.matches(".ancora")) avvia();
};

/* musica: parte al primo tocco, il pulsante ♪ la ferma e la riaccende */
const musica = $(".musica"),
  suono = $(".suono");
let voluta = true;
document.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".suono") || document.body.classList.contains("attesa"))
    return;
  if (voluta && musica.paused) musica.play();
});
suono.onclick = () => {
  voluta = musica.paused;
  voluta ? musica.play() : musica.pause();
  suono.classList.toggle("spento", !voluta);
};

