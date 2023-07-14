document.addEventListener('DOMContentLoaded', () => {
    const movieId = getMovieIdFromUrl();
  
    if (movieId) {
      const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&i=${movieId}&plot=full&type=movie`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.Response === 'True') {
            displayMovieDetails(data);
          } else {
            displayError(data.Error);
          }
        })
        .catch(error => {
          displayError('An error occurred while fetching data. Please try again later.');
          console.error(error);
        });
    }
  
    const topRatedContainer = document.getElementById('simillar-movies');
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
  
    const movieTitlePromise = getMovieTitleFromUrl();
  
    movieTitlePromise.then(movieTitle => {
      if (movieTitle) {
        const words = movieTitle.split(' ');
        const promises = [];
  
        words.forEach(word => {
          const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&s=${encodeURIComponent(word)}&type=movie`;
  
          promises.push(
            fetch(apiUrl)
              .then(response => response.json())
              .then(data => {
                if (data.Response === 'True') {
                  const movies = data.Search.slice(0, 30);
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
            const topRatedMovies = mergedResults
              .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
              .slice(0, 30);
            displayResults(topRatedMovies);
          })
          .catch(error => {
            displayError('An error occurred while fetching data. Please try again later.');
            console.error(error);
          });
      }
    });
  
    function getMovieRatings(movies) {
      const promises = movies.map(movie => {
        const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&i=${movie.imdbID}&type=movie`;
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

      const uniqueMovieIds = new Set();
  
      movies.forEach(movie => {
        if (movie.imdbID === movieId || uniqueMovieIds.has(movie.imdbID) || movie.imdbRating <= 7 || movie.imdbRating === 'N/A') {
          return;
        }
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-card');
  
        const poster = document.createElement('img');
        poster.classList.add('movie-poster');
        poster.alt = movie.Title;
        if (movie.Poster !== 'N/A') {
          poster.src = movie.Poster;
        } else {
          poster.src = 'poster.png';
        }
  
        const title = document.createElement('h3');
        title.classList.add('movie-title');
        title.textContent = movie.Title;
  
        const imdbRating = document.createElement('p');
        imdbRating.classList.add('imdb-rating');
        imdbRating.textContent = `IMDb Rating: ${movie.imdbRating}`;

        movieItem.addEventListener('click', () => {
          window.location.href = `movie-details.html?movieId=${movie.imdbID}&type=movie`;
        });

        movieItem.appendChild(poster);
        movieItem.appendChild(title);
        movieItem.appendChild(imdbRating);
        topRatedContainer.appendChild(movieItem);

        uniqueMovieIds.add(movie.imdbID);
      });
    }
  
    function displayMovieDetails(movie) {
      const poster = document.querySelector('.movie-poster');
      const title = document.querySelector('.movie-title');
      const released = document.querySelector('.released');
      const genre = document.querySelector('.genre');
      const ratings = document.querySelector('.ratings');
      const imdbRatings = document.querySelector('.imdb-ratings');
      const plot = document.querySelector('.plot');
      const director = document.querySelector('.director');
      const actors = document.querySelector('.actors');
      const writer = document.querySelector('.writer');
  
      poster.alt = movie.Title;
      poster.classList.add('movie-poster');
      if (movie.Poster !== 'N/A') {
        poster.src = movie.Poster;
      } else {
        poster.src = 'poster.png';
      }
      title.textContent = movie.Title;
      released.textContent = `${movie.Released}`;
      genre.textContent = `${movie.Genre}`;
      ratings.textContent = `${movie.Ratings.map(rating => `${rating.Source}: ${rating.Value}`).join(', ')}`;
      imdbRatings.textContent = `${movie.imdbRating}`;
      plot.textContent = `${movie.Plot}`;
      director.textContent = `${movie.Director}`;
      actors.textContent = `${movie.Actors}`;
      writer.textContent = `${movie.Writer}`;
    }

    function displayError(message) {
      topRatedContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }
  
    function getMovieIdFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('movieId');
    }
  
    function getMovieTitleFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const movieId = urlParams.get('movieId');
  
      if (movieId) {
        const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&i=${movieId}&plot=full&type=movie`;
  
        return fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            if (data.Response === 'True') {
              return data.Title;
            } else {
              displayError(data.Error);
              return null;
            }
          })
          .catch(error => {
            displayError('An error occurred while fetching data. Please try again later.');
            console.error(error);
            return null;
          });
      }
  
      return null;
    }

    const addToWatchlistButton = document.querySelector('.add-to-watchlist-button');

    addToWatchlistButton.addEventListener('click', () => {
      const movieId = getMovieIdFromUrl();
    
      let movie = JSON.parse(localStorage.getItem('movie')) || []; 
      let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
    
      if (movieId !== null) {
        if (!movie.includes(movieId) && !watchedMovies.includes(movieId)) {
          movie.push(movieId); 
          localStorage.setItem('movie', JSON.stringify(movie));
          alert('Movie added to watchlist!');
        } else {
          alert('Movie is already in the watchlist!');
        }
      } else {
        alert('Movie could not be added to watchlist!');
      }
    });
    
});
  