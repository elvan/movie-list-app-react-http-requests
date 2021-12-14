import React, { useState } from 'react';
import './App.css';
import MoviesList from './components/MoviesList';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchMoviesHandler() {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('https://swapi.dev/api/films/');

      if (response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movie) => {
        return {
          id: movie.episode_id,
          title: movie.title,
          releaseDate: movie.release_date,
          openingText: movie.opening_crawl,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function renderContent() {
    let content = <p>No movies to show</p>;

    if (error) {
      content = <p>{error}</p>;
    }

    if (movies.length > 0) {
      content = <MoviesList movies={movies} />;
    }

    if (isLoading) {
      content = <p>Loading...</p>;
    }

    return content;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{renderContent()}</section>
    </React.Fragment>
  );
}

export default App;
