document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    const resultMessage = document.querySelector('.result-message');
    const navbar = document.querySelector('.navbar');
    let prevScrollPos = window.pageYOffset;
    let currentPage = 1;
    let totalPages = 0;
    let allResults = [];
  
    window.addEventListener('scroll', handleScroll);
  
    function handleScroll() {
      const currentScrollPos = window.pageYOffset;
  
      if (prevScrollPos > currentScrollPos) {
        navbar.style.top = '0';
      } else {
        navbar.style.top = '-60px';
      }
  
      prevScrollPos = currentScrollPos;
  
      const scrollEnd = window.innerHeight + window.pageYOffset;
      const documentHeight = document.documentElement.offsetHeight;
  
      if (scrollEnd >= documentHeight && currentPage < totalPages) {
        currentPage++;
        performSearch();
      }
    }
  
    async function performSearch() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm === '') {
        return;
      }
  
      allResults = [];
  
      try {
  
        for (let page = 1; page <= 5; page++) {
          const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&s=*${encodeURIComponent(searchTerm)}*&page=${page}&type=movie`;
  
          const response = await fetch(apiUrl);
          const data = await response.json();
  
          if (data.Response === 'True') {
            allResults.push(...data.Search);
            if (allResults.length >= 50) {
              break;
            }
          } else {
            displayError(data.Error);
            return;
          }
        }
  
        displayResults(allResults, searchTerm);
        totalPages = Math.ceil(allResults.length / 10);
      } catch (error) {
        displayError('An error occurred while fetching data. Please try again later.');
        console.error(error);
      } 
    }
  
    searchButton.addEventListener('click', performSearch);
  
    function displayResults(results, searchTerm) {
      resultsContainer.innerHTML = '';
      resultMessage.textContent = `Search results for: ${searchTerm}`;
      resultMessage.classList.add('result-message');
  
      results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
  
        const poster = document.createElement('img');
        poster.alt = movie.Title;
        poster.classList.add('movie-poster');
        poster.src = movie.Poster !== 'N/A' ? movie.Poster : 'poster.png';
  
        const title = document.createElement('h3');
        title.textContent = movie.Title;
        title.classList.add('movie-title');
  
        const year = document.createElement('p');
        year.textContent = movie.Year;
        year.classList.add('movie-year');
  
        const movieId = document.createElement('p');
        movieId.textContent = `ID: ${movie.imdbID}`;
  
        movieCard.addEventListener('click', () => {
          window.location.href = `movie-details.html?movieId=${movie.imdbID}`;
        });
  
        movieCard.appendChild(poster);
        movieCard.appendChild(title);
        movieCard.appendChild(year);
        movieCard.appendChild(movieId);
        resultsContainer.appendChild(movieCard);
      });
  
      searchInput.value = '';
    }
  
    function displayError(message) {
      resultsContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }
  });
  