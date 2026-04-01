export async function obterClima(cidade) {
  if (!cidade) throw new Error("Cidade obrigatória");

  const cidadeFormatada = encodeURIComponent(cidade);

 
  const geoResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${cidadeFormatada}&format=json&limit=1&accept-language=pt`
  );
  const geoData = await geoResponse.json();

  if (!geoData.length) throw new Error("Cidade não encontrada");

  const { lat: latitude, lon: longitude, display_name } = geoData[0];

  // ✅ pega só o primeiro campo do display_name (nome oficial da cidade)
  const nomeOficial = display_name.split(",")[0].trim();

  const climaResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=relative_humidity_2m,precipitation&timezone=auto`
  );
  const climaData = await climaResponse.json();

  const horaAtualIndex = climaData.hourly.time.findIndex(time =>
    time.startsWith(climaData.current_weather.time.slice(0, 13))
  );
  const indexValido = horaAtualIndex !== -1 ? horaAtualIndex : 0;

  if (!climaData.current_weather) throw new Error("Erro na API");

  return {
    ...climaData.current_weather,
    nomeOficial, // ✅ retorna o nome correto com acento
    temp_max: climaData.daily.temperature_2m_max[0],
    temp_min: climaData.daily.temperature_2m_min[0],
    umidade: climaData.hourly.relative_humidity_2m[indexValido] ?? "--",
    precipitacao: climaData.hourly.precipitation[indexValido] ?? "--",
    time: climaData.daily.time[0],
    previsao: climaData.daily.time.slice(1, 7).map((dia, i) => ({
      data: dia,
      temp_max: climaData.daily.temperature_2m_max[i + 1],
      temp_min: climaData.daily.temperature_2m_min[i + 1],
      weathercode: climaData.daily.weathercode?.[i + 1] ?? 0
    }))
  };
}