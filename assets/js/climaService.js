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
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );

  const climaData = await climaResponse.json();

  if (!climaData.current_weather) {
    throw new Error("Erro na API");
  }

  return climaData.current_weather;
}