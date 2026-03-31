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

  // 📥 Esconde tela inicial
  document.getElementById("tela-inicial").classList.add("hidden");

  // 💡 Mostra o resultado
  document.getElementById("tela-resultado").classList.remove("hidden");

  try {
  const { temperature, weathercode } = await obterClima(cidade);

  const climaInfo = traduzirClima(weathercode);
  const icone = pegarIcone(weathercode);

  document.body.style.background = "";
  document.body.style.backgroundImage = climaInfo.cor;

  resultado.innerHTML = `
    <div style="
      background: rgba(255,255,255,0.2);
      padding: 20px;
      border-radius: 15px;
    ">
      <div class="card-temp">
        <h1 class="temperatura">${temperature}°C</h1>
      </div>
    </div>

    <h2>${formatarCidade(cidade)}</h2>
    <img src="${icone}" class="icone-clima">

    <div class="clima-info">
      <p>${climaInfo.descricao}</p>
    </div>
  `;

} catch (erro) {
  resultado.innerHTML = erro.message;
}
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

// 🚀 Inicialização
aplicarTemaPorHorario();

window.buscarClima = buscarClima;
window.voltar = voltar;
document.getElementById("btn-buscar").addEventListener("click", buscarClima);
document.getElementById("btn-voltar").addEventListener("click", voltar);