const filters = {
  periodo: "",
  subgenero: "",
  ambiente: "",
  acontecimento: "",
};

document.addEventListener("DOMContentLoaded", async () => {
  const savedFilters = JSON.parse(localStorage.getItem("movieFilters")) || {};
  Object.assign(filters, savedFilters);

  console.log("Filtros carregados:", filters);

  if (document.querySelector("#movie-results")) {
    await fetchMovies();
  }

  setupFilterButtons();
});

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterType = btn.getAttribute("data-filter");
      const filterValue = btn.getAttribute("data-value");

      // Armazena o filtro selecionado
      filters[filterType] = filterValue;
      localStorage.setItem("movieFilters", JSON.stringify(filters));

      // Atualiza o estilo do botão selecionado
      const buttonsInGroup = document.querySelectorAll(
        `[data-filter="${filterType}"]`
      );
      buttonsInGroup.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      console.log("Filtros atualizados:", filters);
    });
  });
}
//Função para a API
async function fetchMovies() {
  try {
    const apiUrl = "http://localhost:3000/api/filmes/filtro-multiplas";

    // Criando os parametros que vai buscar dentro da API
    const queryParams = new URLSearchParams({
      periodo: filters.periodo || "",
      subgenero: filters.subgenero || "",
      ambiente: filters.ambiente || "",
      acontecimento: filters.acontecimento || "",
      acontecimento: filters.quantidade || "",
    });

    console.log("URL da requisição:", `${apiUrl}?${queryParams}`);

    // Faz a requisição dentro da API
    const response = await fetch(`${apiUrl}?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Filmes recebidos da API:", data); // Resposta dos filmes

    displayMovies(data); // Exibir os filmes na tela
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    document.querySelector("#movie-results").innerHTML =
      "<p>Erro ao buscar filmes. Tente novamente.</p>";
  }
}

// Função para os filmes que serão retornados pela API
function displayMovies(movies) {
  const movieResults = document.querySelector("#movie-results");
  movieResults.innerHTML = ""; // Limpar resultados anteriores

  console.log("Tentando exibir filmes na tela:", movies); // Conferem se os filmes retornaram

  if (movies && movies.length > 0) {
    movies.forEach((movie) => {
      console.log("Filme sendo exibido:", movie);

      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.innerHTML = `
              <h3>${movie.titulo}</h3>
              <p>Ano: ${movie.ano}</p>
              <p>Gênero: ${
                movie.subgenero ? movie.subgenero.join(", ") : "N/A"
              }</p>
              <p>Ambiente: ${
                movie.ambiente ? movie.ambiente.join(", ") : "N/A"
              }</p>
              <p>Acontecimento: ${
                movie.acontecimento ? movie.acontecimento.join(", ") : "N/A"
              }</p>
              <img src="${movie.capa}" alt="${
        movie.titulo
      }" style="max-width: 200px;">
          `;
      movieResults.appendChild(movieCard);
    });
  } else {
    movieResults.innerHTML = "<p>Nenhum filme encontrado.</p>";
  }
}
