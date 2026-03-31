
//🔍 Obter os dados do Clima pela API
export async function obterClima(cidade) {
  if (!cidade) {
    throw new Error("Cidade obrigatória");
  }

  const cidadeFormatada = encodeURIComponent(cidade);

  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cidadeFormatada}`
  );
  const geoData = await geoResponse.json();

  if (!geoData.results) {
    throw new Error("Cidade não encontrada");
  }

  const { latitude, longitude } = geoData.results[0];

  const climaResponse = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&hourly=relative_humidity_2m,precipitation`
);

  const climaData = await climaResponse.json();
  const horaAtualIndex = climaData.hourly.time.findIndex(time =>
  time.startsWith(climaData.current_weather.time.slice(0, 13)));

  if (!climaData.current_weather) {
    throw new Error("Erro na API");
  }

  return {
  ...climaData.current_weather,
  temp_max: climaData.daily.temperature_2m_max[0],
  temp_min: climaData.daily.temperature_2m_min[0],
  umidade: climaData.hourly.relative_humidity_2m[horaAtualIndex] ?? "--",
  precipitacao: climaData.hourly.precipitation[horaAtualIndex] ?? "--"
  };
}