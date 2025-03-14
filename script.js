function salvarEscolha(categoria, valor) {
  let escolhas = JSON.parse(localStorage.getItem("escolhas")) || {};
  escolhas[categoria] = valor;
  localStorage.setItem("escolhas", JSON.stringify(escolhas));
  proximaPagina();
}

document.body.classList.add("pagina-sugestoes");

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("pagina-periodo");
});

function proximaPagina() {
  let paginas = [
    "periodo",
    "subgenero",
    "ambiente",
    "acontecimento",
    "quantidade",
    "sugestoes",
  ];

  let atual = window.location.pathname.split("/").pop();

  if (atual === "index.html" || atual === "") {
    window.location.href = "periodo.html";
    return;
  }

  let atualNome = atual.replace(".html", "");
  let proximaIndex = paginas.indexOf(atualNome) + 1;

  if (proximaIndex < paginas.length) {
    let proxima = paginas[proximaIndex] + ".html";
    window.location.href = proxima;
  }
}

function carregarFilmes() {
  fetch("movies.json")
    .then((response) => response.json())
    .then((movies) => {
      let escolhas = JSON.parse(localStorage.getItem("escolhas")) || {};
      let container = document.getElementById("filmes");
      if (!container) {
        return;
      }

      if (
        !escolhas.periodo ||
        !escolhas.subgenero ||
        !escolhas.ambiente ||
        !escolhas.acontecimento ||
        !escolhas.quantidade
      ) {
        container.innerHTML =
          "<p>Por favor, selecione todas as opções antes de prosseguir.</p>";
        return;
      }

      let filmesFiltrados = movies.filter((movie) => {
        let matchCount = 0;
        if (movie.periodo === escolhas.periodo) matchCount++;
        if (movie.subgeneros.includes(escolhas.subgenero)) matchCount++;
        if (movie.ambientes.includes(escolhas.ambiente)) matchCount++;
        if (movie.acontecimentos.includes(escolhas.acontecimento)) matchCount++;
        if (movie.quantidade === escolhas.quantidade) matchCount++;

        return matchCount >= 3;
      });

      container.innerHTML = "";

      if (filmesFiltrados.length > 0) {
        filmesFiltrados.slice(0, 4).forEach((movie) => {
          let div = document.createElement("div");
          div.classList.add("card");
          div.innerHTML = `
              <img src="${movie.capas[0]}" alt="${movie.title}">
              <div class="card-content">
                <h3>${movie.title}</h3>
                <p>${movie.sinopse}</p>
                <a href="#" class="saiba-mais">Saiba Mais</a>
              </div>
            `;
          container.appendChild(div);
        });
      } else {
        let randomMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 4);

        container.innerHTML =
          "<p>Nenhum filme encontrado para essa combinação exata. Aqui estão algumas sugestões aleatórias:</p>";

        randomMovies.forEach((movie) => {
          let div = document.createElement("div");
          div.classList.add("card");
          div.innerHTML = `
              <img src="${movie.capas[0]}" alt="${movie.title}">
              <div class="card-content">
                <h3>${movie.title}</h3>
                <p>${movie.sinopse}</p>
                <a href="#" class="saiba-mais">Saiba Mais</a>
              </div>
            `;
          container.appendChild(div);
        });
      }
    })
    .catch((error) => console.error("Erro ao carregar filmes:", error));
}
