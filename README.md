# 🌤️ Previsão do Tempo

Aplicação web simples e elegante que consome uma API de clima para exibir a previsão em tempo real de qualquer cidade.

---

## 🚀 Funcionalidades

* 🔍 Busca de cidade
* 🌡️ Exibição da temperatura atual
* 📅 Exibição da previsão dos próximos dias
* 🌙 Tema automático (dia/noite)
* 🎨 Fundo dinâmico baseado no clima
* ⚠️ Tratamento de erros (cidade inválida, falha de API, etc.)
* 🧪 Testes automatizados com Jest

---

## 🛠️ Tecnologias utilizadas

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" width="40" />
</p>

* HTML5
* CSS3
* JavaScript (ES6+)
* Jest (testes)

---

## 🌐 API utilizada

* Open-Meteo (Geocoding + Weather API)

---

## 📂 Estrutura do projeto

```bash
📦 previsao-do-tempo
 ┣ 📂 assets
 ┃ ┣ 📂 css
 ┃ ┃ ┗ style.css
 ┃ ┣ 📂 js
 ┃ ┃ ┣  api.js  
 ┃ ┃ ┗ climaService.js   # lógica da API (service)
 ┃ ┗ 📂 icons
 ┣ 📂 test
 ┃ ┣ climaService.test.js
 ┃ ┗ climaService.node.js  # versão para testes (CommonJS)
 ┃              # manipulação do DOM e UI
 ┣ index.html
 ┣ package.json
```

---

## 🧠 Arquitetura

O projeto foi estruturado seguindo o princípio de **separação de responsabilidades**:

* `api.js` → responsável pela interface (DOM e eventos)
* `climaService.js` → responsável pela lógica e consumo da API
* `test/` → testes unitários da lógica

Essa separação facilita:

* manutenção
* escalabilidade
* testabilidade

---

## 🧪 Testes implementados

Foram criados testes para cenários reais:

1. Cidade válida retorna dados
2. Cidade inexistente lança erro
3. Entrada vazia é validada
4. Falha da API é tratada
5. Limite de requisições
6. Timeout de conexão
7. Mudança no formato da API

---

## 📸 Preview

<img src="./assets/img/Screenshot 2026-03-31 120823.png" alt="">

----

## 💡 Melhorias futuras

* Previsão para vários dias
* Geolocalização automática
* Animações mais avançadas
* Deploy online

---

## 👩‍💻 Autora

Desenvolvido por **Larissa Mendonça** 💙
