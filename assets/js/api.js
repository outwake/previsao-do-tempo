import { obterClima } from "./climaService.js";

// 🌙 Detecta se é dia ou noite (horário local do computador)
function isDia() {
  const hora = new Date().getHours();
  return hora >= 6 && hora < 18;
}

// 🌙 Detecta se é dia ou noite no local pesquisado
function isDiaNoLocal(timezone) {
  const hora = new Date().toLocaleString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  const h = parseInt(hora);
  return h >= 6 && h < 18;
}

// 🌙 Aplica tema automaticamente
function aplicarTemaPorHorario() {
  const hora = new Date().getHours();
  if (hora >= 6 && hora < 18) {
    document.body.classList.remove("dark");
  } else {
    document.body.classList.add("dark");
  }
}

// 🌦️ Tradução + estilo do clima
function traduzirClima(code) {
  const mapa = {
    0: {
      descricao: "Céu limpo",
      cor: "linear-gradient(135deg, #f6d365, #fda085)",
    },
    1: {
      descricao: "Quase limpo",
      cor: "linear-gradient(135deg, #89f7fe, #66a6ff)",
    },
    2: {
      descricao: "Parcialmente nublado",
      cor: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
    },
    3: {
      descricao: "Nublado",
      cor: "linear-gradient(135deg, #757f9a, #d7dde8)",
    },
    45: {
      descricao: "Névoa",
      cor: "linear-gradient(135deg, #606c88, #3f4c6b)",
    },
    61: {
      descricao: "Chuva leve",
      cor: "linear-gradient(135deg, #4b79a1, #283e51)",
    },
    63: {
      descricao: "Chuva moderada",
      cor: "linear-gradient(135deg, #4b79a1, #283e51)",
    },
    65: {
      descricao: "Chuva forte",
      cor: "linear-gradient(135deg, #2c3e50, #4ca1af)",
    },
    80: {
      descricao: "Pancadas de chuva",
      cor: "linear-gradient(135deg, #3a7bd5, #3a6073)",
    },
    95: {
      descricao: "Tempestade",
      cor: "linear-gradient(135deg, #141e30, #243b55)",
    },
  };

  return (
    mapa[code] || {
      descricao: "Clima desconhecido",
      cor: "linear-gradient(135deg, #434343, #000000)",
    }
  );
}

//Sugestão de Lugares
const cidadesSugestao = [
  "Rio de Janeiro",
  "São Paulo",
  "Salvador",
  "Buenos Aires",
  "Santiago",
  "Lisboa",
  "Madrid",
  "Paris",
  "Roma",
  "Londres",
  "Berlim",
  "Amsterdã",
  "Dubai",
  "Tokyo",
  "Seul",
  "Bangkok",
  "Sydney",
  "Toronto",
  "New York",
  "Los Angeles"
  
];

const emojisClima = {
  dia: "☀️",
  noite: "🌙",
  chuva: "🌧️"
};

// 🌦️ Ícone
function pegarIcone(code, dia = isDia()) {
  if (code === undefined || code === null)
    return "./assets/icons/wi-day-sunny.svg";

  const mapa = {
    0: dia
      ? "./assets/icons/wi-day-sunny.svg"
      : "./assets/icons/wi-night-clear.svg",
    1: dia
      ? "./assets/icons/wi-day-cloudy.svg"
      : "./assets/icons/wi-night-alt-cloudy.svg",
    2: dia
      ? "./assets/icons/wi-day-cloudy.svg"
      : "./assets/icons/wi-night-alt-cloudy.svg",
    3: "./assets/icons/wi-cloudy.svg",
    45: "./assets/icons/wi-fog.svg",
    61: "./assets/icons/wi-rain.svg",
    63: "./assets/icons/wi-rain.svg",
    65: "./assets/icons/wi-rain.svg",
    80: "./assets/icons/wi-showers.svg",
    95: "./assets/icons/wi-thunderstorm.svg",
  };

  return mapa[code] || "./assets/icons/wi-day-sunny.svg";
}

// 🔍 BUSCAR CLIMA
async function buscarClima() {
  const cidade = document.getElementById("cidade").value.trim();
  const resultado = document.getElementById("resultado");
  const loader = document.getElementById("loader");

  if (!cidade) {
    resultado.innerHTML = "Digite uma cidade válida";
    return;
  }

  // loading ON
  loader.classList.remove("hidden");
  document.querySelector(".card").style.display = "none";

  resultado.innerHTML = "";

  // troca telas
  document.getElementById("tela-inicial").classList.add("hidden");
  document.getElementById("tela-resultado").classList.remove("hidden");

  try {
    const data = await obterClima(cidade);
    const {
      temperature,
      weathercode,
      temp_max,
      temp_min,
      umidade,
      precipitacao,
      windspeed,
      time,
      previsao,
      nomeOficial,
      timezone,
    } = data;

    // ✅ aplica tema baseado no horário local do local pesquisado
    if (isDiaNoLocal(timezone)) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }

    // efeitos clima
    const efeito = document.getElementById("efeito-clima");
    efeito.innerHTML = "";
    efeito.className = "";

    if (weathercode >= 95) {
      criarChuva();
      criarRaio();
    } else if (weathercode >= 60) {
      criarChuva();
    } else if (!isDiaNoLocal(timezone)) {
      criarEstrelas();
      criarLua();
    } else {
      criarSol();
    }

    const climaInfo = traduzirClima(weathercode);
    const icone = pegarIcone(weathercode, isDiaNoLocal(timezone));

    document.body.style.background = climaInfo.cor;
    document.body.style.animation = "none";

    resultado.innerHTML = `
      <div class="weather-card">

        <h2 style="font-weight: 700px">${nomeOficial}</h2>

        <h1 class="temperatura">${temperature}°C</h1>

        <img src="${icone}" class="icone-clima">

        <p class="descricao" 
        style = "margin-bottom: 4px;
                 font-weight: 800px ">${climaInfo.descricao}</p>
        <p class="data">${formatarData(time)}</p>

        <div class="weather-grid">

          <div class="top">
            <div class="item">
              <span>
              <img src="./assets/icons/wi-tempup.svg" class="icon-small">
              Máx</span>
              <strong>${temp_max}°C</strong>
            </div>

            <div class="item">
              <span>
              <img src="./assets/icons/wi-tempdown.svg" class="icon-small">
              Mín</span>
              <strong>${temp_min}°C</strong>
            </div>
          </div>

          <div class="bottom">
            <div class="item">
              <span>
              <img src="./assets/icons/wi-raindrop.svg" class="icon-small">
                Umidade</span>
              <strong>${umidade}%</strong>
            </div>

            <div class="item">
              <span>
              <img src="./assets/icons/wi-rain.svg" class="icon-small">
              Chuva</span>
              <strong>${precipitacao}mm</strong>
            </div>

            <div class="item">
              <span>
              <img src="./assets/icons/wi-windy.svg" class="icon-small">
              Vento</span>
              <strong>${windspeed} km/h</strong>
            </div>
          </div>

        </div>

        <div class="previsao-container">
          <h3 class="previsao-titulo">Próximos dias</h3>
          <ul class="previsao-lista">
            ${previsao
              .map(
                (dia) => `
              <li class="previsao-item">
                <span class="previsao-dia">${formatarDiaSemana(dia.data)}</span>
                <img src="${pegarIcone(dia.weathercode)}" class="previsao-icone">
                <span class="previsao-temps">
                    <span class="temp-max">↑ ${dia.temp_max}°</span>
                    <span class="temp-min">↓ ${dia.temp_min}°</span>
                </span>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>

        <div class="acoes">
          <button id="btn-voltar" class="btn-secundario">
            <img src="./assets/icons/home-175.svg" alt="">
          </button>
          <button id="btn-fav" class="btn-principal">
            <img src="./assets/icons/favourite.svg" alt="">
          </button>
        </div>
      </div>
    `;

    // eventos após render
    document.getElementById("btn-fav").addEventListener("click", () => {
      salvarFavorito(cidade);
    });

    document.getElementById("btn-voltar").addEventListener("click", voltar);
  } catch (erro) {
    resultado.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1px;">
        <p>Erro ao buscar clima 😢 <br> Tente novamente.</p>
        <div class="acoes" style="justify-content: center;">
          <button id="btn-voltar" class="btn-secundario">
            <img src="./assets/icons/home-175.svg" alt="" style="width:30px;height:30px;filter:brightness(0) invert(1);">
          </button>
        </div>
      </div>`;

    document.getElementById("btn-voltar").addEventListener("click", voltar);
    console.error(erro);
  } finally {
    // loading OFF
    loader.classList.add("hidden");
    document.querySelector(".card").style.display = "block";
  }
}

// 🍞 NOTIFICAÇÃO TOAST
function mostrarToast(mensagem) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensagem;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ⭐ FAVORITOS
function salvarFavorito(cidade) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  if (!favoritos.includes(cidade)) {
    favoritos.push(cidade);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    carregarFavoritos();
    mostrarToast(`⭐ ${cidade} salvo nos favoritos!`);
  } else {
    mostrarToast(`${cidade} já está nos favoritos!`);
  }
}

// Remover FAVORITOS
function removerFavorito(cidade) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.filter((c) => c !== cidade);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  carregarFavoritos();
}

// Carregar favoritos
function carregarFavoritos() {
  const container = document.getElementById("favoritos");
  if (!container) return;

  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  container.innerHTML = favoritos
    .map(
      (cidade) => `
    <div class="fav-item">
      <span class="fav-nome">${cidade}</span>
      <button class="remover" data-cidade="${cidade}">✖</button>
    </div>
  `
    )
    .join("");

  document.querySelectorAll(".fav-nome").forEach((el) => {
    el.addEventListener("click", () => {
      document.getElementById("cidade").value = el.textContent;
      buscarClima();
    });
  });

  document.querySelectorAll(".remover").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      removerFavorito(btn.dataset.cidade);
    });
  });
}

// 📅 FORMATAÇÕES
function formatarData(dataISO) {
  const data = new Date(dataISO + "T12:00:00");
  return data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// 📅 Formatar dias da semana
function formatarDiaSemana(dataISO) {
  const data = new Date(dataISO + "T12:00:00");
  return data.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}



// ↩ VOLTAR
function voltar() {
  document.getElementById("tela-inicial").classList.remove("hidden");
  document.getElementById("tela-resultado").classList.add("hidden");
  aplicarTemaPorHorario(); // ✅ restaura o tema baseado no horário local ao voltar
  document.body.style.background = "";
  document.body.style.animation = "";
  criarBolhasCidades();
}

// 🌧️ EFEITOS
function criarChuva() {
  const c = document.getElementById("efeito-clima");
  c.className = "chuva";
  for (let i = 0; i < 100; i++) {
    const el = document.createElement("span");
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = Math.random() + 0.5 + "s";
    c.appendChild(el);
  }
}

function criarEstrelas() {
  const c = document.getElementById("efeito-clima");
  c.className = "estrelas";
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("span");
    el.style.top = Math.random() * 100 + "vh";
    el.style.left = Math.random() * 100 + "vw";
    c.appendChild(el);
  }
}

function criarSol() {
  document.getElementById("efeito-clima").className = "sol";
}

function criarRaio() {
  const c = document.getElementById("efeito-clima");
  const r = document.createElement("div");
  r.className = "raio";
  c.appendChild(r);
}

function criarLua() {
  const c = document.getElementById("efeito-clima");
  const lua = document.createElement("div");
  lua.style.position = "absolute";
  lua.style.top = "10%";
  lua.style.right = "10%";
  lua.style.width = "80px";
  lua.style.height = "80px";
  lua.style.borderRadius = "50%";
  lua.style.background = "radial-gradient(circle, #fff, #ccc)";
  lua.style.boxShadow = "0 0 20px rgba(255,255,255,0.8)";
  c.appendChild(lua);
}


//Efeito de sugestão de lugares


function criarBolhasCidades() {
  const container = document.getElementById("efeito-clima");
  container.innerHTML = "";
  container.className = "bolhas-cidades";

  for (let i = 0; i < 15; i++) {
    const bolha = document.createElement("span");

    // cidade aleatória
    const cidade = cidadesSugestao[Math.floor(Math.random() * cidadesSugestao.length)];
    bolha.textContent = cidade;
    
    // posição aleatória
    bolha.style.left = Math.random() * 100 + "vw";
    bolha.style.top = Math.random() * 100 + "vh";

    // tempo aleatório
    bolha.style.animationDuration = (Math.random() * 5 + 5) + "s";
    bolha.style.animationDelay = (Math.random() * 5) + "s";

    container.appendChild(bolha);
  }
}



// 🚀 INIT
aplicarTemaPorHorario();
carregarFavoritos();
criarBolhasCidades();

document.getElementById("btn-buscar").addEventListener("click", buscarClima);

document.getElementById("cidade").addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarClima();
});

