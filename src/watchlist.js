document.addEventListener('DOMContentLoaded', () => {
  const watchlistContainer = document.getElementById('watchlist-container');
  const watchedContainer = document.getElementById('watched-container');

  const movies = JSON.parse(localStorage.getItem('movie')) || [];

  movies.forEach(movieId => {
    retrieveMovieDetails(movieId)
      .then(movie => displayMovie(movie, watchlistContainer))
      .catch(error => console.error('An error occurred while retrieving movie details:', error));
  });

  watchlistContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
      const movieItem = event.target.closest('.movie-card');
      const movieId = movieItem.dataset.movieId;
      deleteMovieFromWatchlist(movieId);
      movieItem.remove();
    } else if (event.target.classList.contains('watched-button')) {
      const movieItem = event.target.closest('.movie-card');
      const movieId = movieItem.dataset.movieId;
      markAsWatched(movieId);
      deleteMovieFromWatchlist(movieId);
      movieItem.remove();
      retrieveMovieDetails(movieId)
        .then(movie => displayWatchedMovies(movie, watchedContainer))
        .catch(error => console.error('An error occurred while retrieving watched movie details:', error));
    }
  });

  const watchedMovieIds = JSON.parse(localStorage.getItem('watchedMovies')) || [];
  watchedMovieIds.forEach(movieId => {
    retrieveMovieDetails(movieId)
      .then(movie => displayWatchedMovies(movie, watchedContainer))
      .catch(error => console.error('An error occurred while retrieving watched movie details:', error));
  });

  watchedContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
      const movieItem = event.target.closest('.movie-card');
      const movieId = movieItem.dataset.movieId;
      deleteMovieFromWatched(movieId);
      movieItem.remove();
    }
  });
});

function retrieveMovieDetails(movieId) {
  const apiUrl = `https://www.omdbapi.com/?apikey=5996182c&i=${movieId}`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        return data;
      } else {
        throw new Error(data.Error);
      }
    });
}

function displayMovie(movie, container) {
  const movieItem = document.createElement('div');
  movieItem.classList.add('movie-card');
  movieItem.dataset.movieId = movie.imdbID;

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

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.innerHTML = '<i class="fas fa-trash"></i> Remove';
  
  const watchedButton = document.createElement('button');
  watchedButton.classList.add('watched-button');
  watchedButton.innerHTML = '<i class="fas fa-check"></i> Watched';  

  movieItem.addEventListener('click', () => {
    window.location.href = `movie-details.html?movieId=${movie.imdbID}`;
  });

  movieItem.appendChild(poster);
  movieItem.appendChild(title);
  movieItem.appendChild(deleteButton);
  movieItem.appendChild(watchedButton);
  container.appendChild(movieItem);
}

function displayWatchedMovies(movie, container) {
  const movieItem = document.createElement('div');
  movieItem.classList.add('movie-card');
  movieItem.dataset.movieId = movie.imdbID;

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

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.innerHTML = '<i class="fas fa-trash"></i> Remove';

  movieItem.addEventListener('click', () => {
    window.location.href = `movie-details.html?movieId=${movie.imdbID}`;
  });

  movieItem.appendChild(poster);
  movieItem.appendChild(title);
  movieItem.appendChild(deleteButton);
  container.appendChild(movieItem);
}

function deleteMovieFromWatchlist(movieId) {
  const movies = JSON.parse(localStorage.getItem('movie')) || [];
  const updatedMovies = movies.filter(id => id !== movieId);
  localStorage.setItem('movie', JSON.stringify(updatedMovies));
}

function markAsWatched(movieId) {
  const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
  watchedMovies.push(movieId);
  localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
}

function deleteMovieFromWatched(movieId) {
  const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
  const updatedMovies = watchedMovies.filter(id => id !== movieId);
  localStorage.setItem('watchedMovies', JSON.stringify(updatedMovies));
}