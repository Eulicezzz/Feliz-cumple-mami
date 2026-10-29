/* =========================================================
   Feliz Cumpleaños, Mami
   Decoración, sobre, razones, tarta y música de cumpleaños
   ========================================================= */

document.documentElement.classList.add("js");

/* ---------------------------------------------------------
   1. Decoración flotante de la portada (corazones y globos)
   --------------------------------------------------------- */
(function decorarPortada() {
  const contenedor = document.getElementById("decoracion");
  if (!contenedor) return;

  const SVG_CORAZON =
    '<svg viewBox="0 0 32 29" fill="currentColor"><path d="M16 29S0 18.7 0 9.4C0 4.2 4.2 0 9.4 0 12.6 0 15.2 1.7 16 3.4 16.8 1.7 19.4 0 22.6 0 27.8 0 32 4.2 32 9.4 32 18.7 16 29 16 29z"/></svg>';

  const SVG_GLOBO =
    '<svg viewBox="0 0 40 60" fill="none"><ellipse cx="20" cy="20" rx="16" ry="19" fill="currentColor"/><path d="M20 39 l-4 6 h8 z" fill="currentColor"/><path d="M20 45 q6 8 0 14" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/></svg>';

  const total = 14;
  for (let i = 0; i < total; i++) {
    const figura = document.createElement("span");
    figura.className = "figura";

    const esCorazon = i % 3 !== 2;
    figura.innerHTML = esCorazon ? SVG_CORAZON : SVG_GLOBO;

    const tamano = 22 + Math.random() * 34;
    figura.style.width = tamano + "px";
    figura.style.height = tamano + "px";
    figura.style.left = Math.random() * 96 + "%";
    figura.style.color = esCorazon
      ? i % 2 === 0
        ? "rgba(255,247,240,0.9)"
        : "rgba(217,164,65,0.9)"
      : "rgba(255,247,240,0.75)";

    const duracion = 16 + Math.random() * 16;
    figura.style.animation = "flotar " + duracion + "s linear infinite";
    figura.style.animationDelay = -Math.random() * duracion + "s";

    contenedor.appendChild(figura);
  }
})();

/* ---------------------------------------------------------
   2. Confeti (usando canvas-confeti si está disponible)
   --------------------------------------------------------- */
function celebrar(opciones) {
  if (typeof window.confetti !== "function") return;
  const colores = ["#c1121f", "#e63946", "#d9a441", "#fff7f0"];
  const config = Object.assign(
    { particleCount: 120, spread: 75, origin: { y: 0.6 }, colors: colores },
    opciones || {}
  );
  window.confetti(config);
}

/* ---------------------------------------------------------
   3. Botón de la portada: abre el regalo (baja a la carta)
   --------------------------------------------------------- */
(function botonAbrir() {
  const boton = document.getElementById("abrir-regalo");
  if (!boton) return;

  boton.addEventListener("click", function () {
    celebrar({ particleCount: 90, spread: 60, origin: { y: 0.7 } });
    const carta = document.querySelector(".seccion-carta");
    if (carta) carta.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();

/* ---------------------------------------------------------
   4. Sobre con la carta que se abre al tocarlo
   --------------------------------------------------------- */
(function sobreCarta() {
  const sobre = document.getElementById("sobre");
  const carta = document.getElementById("carta");
  if (!sobre || !carta) return;

  function alternar() {
    const abierta = sobre.classList.toggle("abierto");
    if (abierta) {
      setTimeout(function () {
        carta.classList.add("abierta");
        celebrar({ particleCount: 60, spread: 55, origin: { y: 0.65 } });
      }, 450);
    } else {
      carta.classList.remove("abierta");
    }
  }

  sobre.addEventListener("click", alternar);
  sobre.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      alternar();
    }
  });
})();

/* ---------------------------------------------------------
   5. Aparición de las tarjetas al hacer scroll
   --------------------------------------------------------- */
(function revelarAlScroll() {
  const elementos = document.querySelectorAll(".revelar");
  if (!elementos.length) return;

  if (!("IntersectionObserver" in window)) {
    elementos.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elementos.forEach(function (el, indice) {
    el.style.transitionDelay = (indice % 3) * 0.12 + "s";
    observador.observe(el);
  });
})();

/* ---------------------------------------------------------
   6. Tarta: apagar velas y mensaje final
   --------------------------------------------------------- */
(function tarta() {
  const velas = Array.prototype.slice.call(document.querySelectorAll(".vela"));
  const mensaje = document.getElementById("mensaje-final");
  if (!velas.length) return;

  velas.forEach(function (vela) {
    vela.addEventListener("click", function () {
      if (vela.classList.contains("apagada")) return;
      vela.classList.add("apagada");
      vela.setAttribute("aria-label", "Vela apagada");

      const apagadas = document.querySelectorAll(".vela.apagada").length;
      if (apagadas === velas.length && mensaje) {
        setTimeout(function () {
          mensaje.classList.add("visible");
          celebrar({ particleCount: 180, spread: 90, startVelocity: 45, origin: { y: 0.55 } });
          setTimeout(function () {
            celebrar({ particleCount: 100, spread: 120, origin: { x: 0.2, y: 0.6 } });
            celebrar({ particleCount: 100, spread: 120, origin: { x: 0.8, y: 0.6 } });
          }, 450);
          mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    });
  });
})();

/* ---------------------------------------------------------
   7. Música de cumpleaños
   - Si existe "musica/cancion.mp3" se reproduce ese archivo.
   - Si no, se genera la melodía clásica con Web Audio
     (bucle con opción de silenciar).
   --------------------------------------------------------- */
(function musica() {
  const boton = document.getElementById("boton-musica");
  if (!boton) return;

  // --- Archivo MP3 opcional ---
  const audioReal = new Audio();
  audioReal.loop = true;
  audioReal.volume = 0.5;
  audioReal.preload = "auto";
  let archivoListo = false;

  audioReal.addEventListener("canplaythrough", function () {
    archivoListo = true;
  });
  audioReal.addEventListener("error", function () {
    archivoListo = false;
  });
  audioReal.src = "musica/cancion.mp3";

  // --- Melodía sintetizada (Happy Birthday, dominio público) ---
  // [frecuencia en Hz, duración en tiempos]
  const MI_TIEMPO = 0.48;

  const MELODIA = [
    // Feliz cumpleaños para ti
    [392.0, 0.5], [392.0, 0.5], [440.0, 1], [392.0, 1], [523.25, 1], [493.88, 2],
    // Feliz cumpleaños para ti
    [392.0, 0.5], [392.0, 0.5], [440.0, 1], [392.0, 1], [587.33, 1], [523.25, 2],
    // Feliz cumpleaños querida mami
    [392.0, 0.5], [392.0, 0.5], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440.0, 2],
    // Feliz cumpleaños para ti
    [698.46, 0.5], [698.46, 0.5], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2],
  ];

  let contexto = null;
  let salida = null;
  let temporizador = null;
  let proximaVuelta = 0;
  let sonando = false;
  let usandoArchivo = false;

  function prepararContexto() {
    if (!contexto) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      contexto = new AudioContext();
      salida = contexto.createGain();
      salida.gain.value = 0.45;
      salida.connect(contexto.destination);
    }
    if (contexto.state === "suspended") contexto.resume();
    return true;
  }

  function tocarNota(frecuencia, inicio, duracion) {
    const oscilador = contexto.createOscillator();
    const ganancia = contexto.createGain();

    oscilador.type = "triangle";
    oscilador.frequency.setValueAtTime(frecuencia, inicio);

    ganancia.gain.setValueAtTime(0.0001, inicio);
    ganancia.gain.exponentialRampToValueAtTime(0.9, inicio + 0.03);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion * 0.95);

    oscilador.connect(ganancia);
    ganancia.connect(salida);
    oscilador.start(inicio);
    oscilador.stop(inicio + duracion + 0.05);
  }

  function programarBucle() {
    const inicio = Math.max(proximaVuelta, contexto.currentTime + 0.06);
    let tiempo = inicio;

    MELODIA.forEach(function (nota) {
      const duracion = nota[1] * MI_TIEMPO;
      tocarNota(nota[0], tiempo, duracion);
      tiempo += duracion;
    });

    proximaVuelta = tiempo + 1.4;

    const espera = Math.max(300, (proximaVuelta - contexto.currentTime - 1.2) * 1000);
    temporizador = setTimeout(programarBucle, espera);
  }

  function arrancarSynth() {
    if (!prepararContexto()) return;
    if (temporizador) clearTimeout(temporizador);
    proximaVuelta = contexto.currentTime + 0.1;
    salida.gain.value = 0.45;
    programarBucle();
  }

  function detenerSynth() {
    if (temporizador) clearTimeout(temporizador);
    temporizador = null;
  }

  function iniciar() {
    if (archivoListo) {
      usandoArchivo = true;
      const promesa = audioReal.play();
      if (promesa && typeof promesa.catch === "function") {
        promesa.catch(function () {
          usandoArchivo = false;
          arrancarSynth();
        });
      }
    } else {
      usandoArchivo = false;
      arrancarSynth();
    }
  }

  function detener() {
    if (usandoArchivo) {
      audioReal.pause();
    } else {
      detenerSynth();
    }
  }

  boton.addEventListener("click", function () {
    sonando = !sonando;
    if (sonando) {
      iniciar();
      boton.textContent = "Silenciar música";
      boton.setAttribute("aria-pressed", "true");
    } else {
      detener();
      boton.textContent = "Reproducir música";
      boton.setAttribute("aria-pressed", "false");
    }
  });
})();
