import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';

const FIREBASE_URL =
  'https://react-http-ac3a7-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMoviesHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(FIREBASE_URL);

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          ...data[key],
          id: key,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoviesHandler();

    return () => {
      setMovies([]);
    };
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(FIREBASE_URL, {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log(data);
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{renderContent()}</section>
    </React.Fragment>
  );
}

export default App;
