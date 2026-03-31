import { obterClima } from "./climaService.js";

// 🌙 Detecta se é dia ou noite 
function isDia() {
  const hora = new Date().getHours();
  return hora >= 6 && hora < 18;
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
    0: { descricao: "Céu limpo", cor: "linear-gradient(135deg, #f6d365, #fda085)" },
    1: { descricao: "Quase limpo", cor: "linear-gradient(135deg, #89f7fe, #66a6ff)" },
    2: { descricao: "Parcialmente nublado", cor: "linear-gradient(135deg, #bdc3c7, #2c3e50)" },
    3: { descricao: "Nublado", cor: "linear-gradient(135deg, #757f9a, #d7dde8)" },
    45: { descricao: "Névoa", cor: "linear-gradient(135deg, #606c88, #3f4c6b)" },
    61: { descricao: "Chuva leve", cor: "linear-gradient(135deg, #4b79a1, #283e51)" },
    63: { descricao: "Chuva moderada", cor: "linear-gradient(135deg, #4b79a1, #283e51)" },
    65: { descricao: "Chuva forte", cor: "linear-gradient(135deg, #2c3e50, #4ca1af)" },
    80: { descricao: "Pancadas de chuva", cor: "linear-gradient(135deg, #3a7bd5, #3a6073)" },
    95: { descricao: "Tempestade", cor: "linear-gradient(135deg, #141e30, #243b55)" }
  };

  return mapa[code] || {
    descricao: "Clima desconhecido",
    cor: "linear-gradient(135deg, #434343, #000000)"
  };
}

// 🌦️ Escolhe ícone baseado no clima + horário
function pegarIcone(code) {
  const dia = isDia();

  const mapa = {
    0: dia ? "./assets/icons/wi-day-sunny.svg" : "./assets/icons/wi-night-clear.svg",

    1: dia ? "./assets/icons/wi-day-cloudy.svg" : "./assets/icons/wi-night-alt-cloudy.svg",
    2: dia ? "./assets/icons/wi-day-cloudy.svg" : "./assets/icons/wi-night-alt-cloudy.svg",
    3: "./assets/icons/wi-cloudy.svg",

    45: "./assets/icons/wi-fog.svg",

    61: "./assets/icons/wi-rain.svg",
    63: "./assets/icons/wi-rain.svg",
    65: "./assets/icons/wi-rain.svg",

    80: "./assets/icons/wi-showers.svg",

    95: "./assets/icons/wi-thunderstorm.svg"
  };

  return mapa[code] || "./assets/icons/wi-na.svg";
}

// 🔍 Função principal
async function buscarClima() {
  const cidade = document.getElementById("cidade").value.trim();
  const resultado = document.getElementById("resultado");
  const loader = document.getElementById("loader");
   console.log("CLIQUEI");
  loader.classList.remove("hidden");
  resultado.innerHTML = "";

  // 📥 Esconde tela inicial
  document.getElementById("tela-inicial").classList.add("hidden");

  // 💡 Mostra o resultado
  document.getElementById("tela-resultado").classList.remove("hidden");
  try {
  const {
  temperature,
  weathercode,
  temp_max,
  temp_min,
  umidade,
  precipitacao,
  windspeed,
  time
} = await obterClima(cidade);

document.getElementById("efeito-clima").innerHTML = "";

if (weathercode >= 95) {
  criarChuva();
  criarRaio();
} else if (weathercode >= 60) {
  criarChuva();
} else if (!isDia()) {
  criarEstrelas();
  criarLua();
} else {
  criarSol();
}
  const climaInfo = traduzirClima(weathercode);
  const icone = pegarIcone(weathercode);

  document.body.style.background = "";
  document.body.style.backgroundImage = climaInfo.cor;

  resultado.innerHTML = `
  <div class="weather-card">

    <h1 class="temperatura">${temperature}°C</h1>
    <h2>${formatarCidade(cidade)}</h2>

    <img src="${icone}" class="icone-clima">

    <p class="descricao">${climaInfo.descricao}</p>
    <p class="data">${formatarData(time)}</p>

    <div class="weather-grid">

      <div class="top">
        <div class="item">
          <span>
            <img src="./assets/icons/wi-tempup.svg" class="icon-small">
            Máx
          </span>
          <strong>${temp_max}°C</strong>
        </div>

        <div class="item">
          <span>
            <img src="./assets/icons/wi-tempdown.svg" class="icon-small">
            Mín
          </span>
          <strong>${temp_min}°C</strong>
        </div>
      </div>

      <div class="bottom">
        <div class="item">
          <span>
            <img src="./assets/icons/wi-raindrop.svg" class="icon-small">
            Umidade
          </span>
          <strong>${umidade}%</strong>
        </div>

        <div class="item">
          <span>
            <img src="./assets/icons/wi-rain.svg" class="icon-small">
            Chuva
          </span>
          <strong>${precipitacao}mm</strong>
        </div>

        <div class="item">
          <span>
            <img src="./assets/icons/wi-windy.svg" class="icon-small">
            Vento
          </span>
          <strong>${windspeed} km/h</strong>
        </div>
      </div>

    </div>
  </div>
`;

} catch (erro) {
  resultado.innerHTML = erro.message;
}
}


// Exibir a data
function formatarData(dataISO) {
  const data = new Date(dataISO);

  return data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// 📃 Formatação das palavras
function formatarCidade(cidade) {
  return cidade
    .toLowerCase()
    .split(" ")
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

// ⏎ Buscar com ENTER
document.getElementById("cidade").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    buscarClima();
  }
});

//↩ Função voltar
function voltar() {
  document.getElementById("tela-inicial").classList.remove("hidden");
  document.getElementById("tela-resultado").classList.add("hidden");
}

/* EFEITOS DE CLIMAS */
function criarChuva() {
  const container = document.getElementById("efeito-clima");
  container.innerHTML = "";
  container.className = "chuva";

  for (let i = 0; i < 100; i++) {
    const gota = document.createElement("span");
    gota.style.left = Math.random() * 100 + "vw";
    gota.style.animationDuration = (Math.random() * 0.5 + 0.5) + "s";
    gota.style.left = Math.random() * 100 + "vw";
    gota.style.transform = `rotate(${Math.random() * 20}deg)`;
    container.appendChild(gota);
  }
}

function criarEstrelas() {
  const container = document.getElementById("efeito-clima");
  container.innerHTML = "";
  container.className = "estrelas";

  for (let i = 0; i < 80; i++) {
    const estrela = document.createElement("span");
    estrela.style.top = Math.random() * 100 + "vh";
    estrela.style.left = Math.random() * 100 + "vw";
    container.appendChild(estrela);
  }
}

function criarSol() {
  const container = document.getElementById("efeito-clima");
  container.innerHTML = "";
  container.className = "sol";
}

function criarRaio() {
  const container = document.getElementById("efeito-clima");
  const raio = document.createElement("div");
  raio.className = "raio";
  container.appendChild(raio);
}


function criarLua() {
  const container = document.getElementById("efeito-clima");

  const lua = document.createElement("div");
  lua.style.position = "absolute";
  lua.style.top = "10%";
  lua.style.right = "10%";
  lua.style.width = "80px";
  lua.style.height = "80px";
  lua.style.borderRadius = "50%";
  lua.style.background = "radial-gradient(circle, #fff, #ccc)";
  lua.style.boxShadow = "0 0 20px rgba(255,255,255,0.8)";

  container.appendChild(lua);
}

// 🚀 Inicialização
aplicarTemaPorHorario();

window.buscarClima = buscarClima;
window.voltar = voltar;

document.getElementById("btn-buscar").addEventListener("click", buscarClima);
document.getElementById("btn-voltar").addEventListener("click", voltar);