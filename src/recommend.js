document.addEventListener('DOMContentLoaded', () => {
    const topRatedContainer = document.querySelector('.simillar-movies');
    const navbar = document.querySelector('.navbar');
    let prevScrollPos = window.pageYOffset;
    let currentPage = 1;
    let totalPages = 0;

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
    
    const movieTitle = getMovieTitleFromUrl();
    if (movieTitle) {
      const words = movieTitle.split(' ');
      const promises = [];
  
      words.forEach(word => {
        const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&s=${encodeURIComponent(word)}`;
  
        promises.push(fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            if (data.Response === 'True') {
              const movies = data.Search.slice(0, 10);
              return getMovieRatings(movies);
            } else {
              displayError(data.Error);
              return [];
            }
          })
        );
      });
  
      Promise.all(promises)
        .then(results => {
          const mergedResults = [].concat(...results);
          const topRatedMovies = mergedResults.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating)).slice(0, 30);
          displayResults(topRatedMovies);
        })
        .catch(error => {
          displayError('An error occurred while fetching data. Please try again later.');
          console.error(error);
        });
    }
  
    function getMovieRatings(movies) {
      const promises = movies.map(movie => {
        const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&i=${movie.imdbID}`;
        return fetch(apiUrl)
          .then(response => response.json())
          .then(data => data)
          .catch(error => {
            console.error(error);
            return null;
          });
      });
  
      return Promise.all(promises);
    }
  
    function displayResults(movies) {
      topRatedContainer.innerHTML = '';
  
      movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
  
        const poster = document.createElement('img');
        poster.classList.add('poster');
        poster.alt = movie.Title;
        if (movie.Poster !== 'N/A') {
          poster.src = movie.Poster;
        } else {
          poster.src = 'placeholder-image.jpg';
        }
        movieItem.appendChild(poster);
  
        const title = document.createElement('h2');
        title.classList.add('title');
        title.textContent = movie.Title;
        movieItem.appendChild(title);
  
        const imdbRating = document.createElement('p');
        imdbRating.classList.add('imdb-rating');
        imdbRating.textContent = `IMDb Rating: ${movie.imdbRating}`;
        movieItem.appendChild(imdbRating);
  
        topRatedContainer.appendChild(movieItem);
      });
    }
  
    function displayError(message) {
      topRatedContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }
  
    function getMovieTitleFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('movieTitle');
    }
});

    //  async function performSearch() {

    //     try {
                
    //             for (let page = 1; page <= 5; page++) {
    //                 const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&s=${}&page=${page}`;
    
    //                 const response = await fetch(apiUrl);
    //                 const data = await response.json();
    
    //                 if (data.Response === 'True') {
    //                     allResults.push(...data.Search);
    //                     if (allResults.length >= 50) {
    //                         break;
    //                     }
    //                 } else {
    //                     displayError(data.Error);
    //                     return;
    //                 }
    //             }
    
    //             displayResults(allResults);
    //             totalPages = Math.ceil(allResults.length / 10);
    //         } catch (error) {
    //             displayError('An error occurred while fetching data. Please try again later.');
    //             console.error(error);
    //         }
    // }   