# IsFlick

**A flick pick that's slick.**

IsFlick is a desktop movie finder built with Electron. Search for any movie,
view its details and ratings, get recommendations for similar top-rated films,
and keep a personal watchlist.

> Solo project.

## Features

- Search movies by title, with infinite scroll for more results
- Movie details page: plot, release date, genre, director, writers, cast, ratings
- "Top rated similar movies" recommendations, ranked by IMDb rating
- Personal watchlist, saved locally on your device

## Tech stack

- **Framework:** Electron 25 (desktop app with HTML, CSS, JavaScript)
- **Data:** OMDb API (movie data and ratings)
- **Packaging:** Electron Forge (Windows, macOS, Linux builds)

## Running locally

```bash
git clone https://github.com/Iskndxr/IsFlick.git
cd IsFlick
cp src/config.example.js src/config.js
npm install
npm start
```

Add your free OMDb API key (from [omdbapi.com](https://www.omdbapi.com/apikey.aspx))
to `src/config.js` before starting.

To build an installer for your platform:

```bash
npm run make
```
