
const { obterClima, verificarLimite } = require("./climaService.node.js");
const service = require("./climaService.node.js");

global.fetch = jest.fn();

beforeEach(() => {
  service.resetarContador();
  fetch.mockClear();
});

// 1. Cidade válida retorna dados meteorológicos
test("1. Cidade válida retorna dados meteorológicos", async () => {
  fetch
    .mockResolvedValueOnce({
      json: async () => ({
        results: [{ latitude: 10, longitude: 20 }]
      })
    })
    .mockResolvedValueOnce({
      json: async () => ({
        current_weather: { temperature: 25 }
      })
    });

  const data = await obterClima("Rio");

  expect(data.temperature).toBe(25);
});

// 2. Cidade inexistente lança exceção
test("2. Cidade inexistente lança exceção", async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ({})
  });

  await expect(obterClima("CidadeFake"))
    .rejects.toThrow("Cidade não encontrada");
});


//3. Entrada vazia retorna erro
test("3. Entrada vazia retorna erro", async () => {
  await expect(obterClima(""))
    .rejects.toThrow("Cidade obrigatória");
});


//4. Falha da API gera erro
test("4. Falha da API gera erro", async () => {
  fetch.mockRejectedValueOnce(new Error("Erro de rede"));

  await expect(obterClima("Rio"))
    .rejects.toThrow();
});


//5. Excesso de requisições deve ser bloqueado
test("5. Excesso de requisições deve ser bloqueado", () => {
  expect(() => {
    for (let i = 0; i < 6; i++) {
      verificarLimite();
    }
  }).toThrow("Muitas requisições");
});

//6. Conexão lenta deve dar timeout
test("6. Conexão lenta deve dar timeout", async () => {
  fetch.mockImplementation(() =>
    new Promise(resolve => setTimeout(resolve, 3000))
  );

  await expect(obterClima("Rio"))
    .rejects.toThrow();
});

//7. API mudou formato e quebrou retorno
test("7. API mudou formato e quebrou retorno", async () => {
  fetch
    .mockResolvedValueOnce({
      json: async () => ({
        results: [{ latitude: 10, longitude: 20 }]
      })
    })
    .mockResolvedValueOnce({
      json: async () => ({
      })
    });

  await expect(obterClima("Rio"))
    .rejects.toThrow("Erro na API");
});