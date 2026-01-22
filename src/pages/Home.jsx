import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getBooks } from '../services/api';
import BookCard from '../components/BookCard/BookCard';
import './Home.css';

const Home = () => {
  const [books, setBooks] = useState(() => {
    try {
      const cached = localStorage.getItem('cachedBooks');
      return cached ? JSON.parse(cached).books : [];
    } catch (error) {
      console.error('Error loading cached books:', error);
      return [];
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation(); 
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || location.state?.searchQuery || ''
  );
  const [startIndex, setStartIndex] = useState(0);
  const isInitialMount = useRef(true);
  const previousQuery = useRef(searchQuery);

  const cacheBooks = useCallback((booksData, query, index) => {
    try {
      const cacheData = {
        books: booksData,
        query,
        index,
        timestamp: Date.now()
      };
      localStorage.setItem('cachedBooks', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching books:', error);
    }
  }, []);

  const isValidCache = useCallback((timestamp) => {
    const CACHE_DURATION = 60 * 60 * 1000; 
    return Date.now() - timestamp < CACHE_DURATION;
  }, []);

  const fetchBooks = useCallback(async (query, index) => {
    setLoading(true);
    try {
      // check cache for initial load
      if (index === 0) {
        const cached = localStorage.getItem('cachedBooks');
        if (cached) {
          const cacheData = JSON.parse(cached);
          if (
            cacheData.query === query && 
            cacheData.index === index && 
            isValidCache(cacheData.timestamp)
          ) {
            setBooks(cacheData.books);
            setLoading(false);
            return;
          }
        }
      }

      const data = await getBooks(query, index);
      const newBooks = data.items || [];
      
      if (index === 0) {
        setBooks(newBooks);
        cacheBooks(newBooks, query, index);
      } else {
        setBooks(prevBooks => {
          const updatedBooks = [...prevBooks, ...newBooks];
          cacheBooks(updatedBooks, query, index);
          return updatedBooks;
        });
      }
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  }, [cacheBooks, isValidCache]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setStartIndex(0);
      setSearchParams({ search: trimmedQuery });
      fetchBooks(trimmedQuery, 0);
    }
  }, [searchQuery, setSearchParams, fetchBooks]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setStartIndex(0);
    setSearchParams({});
    fetchBooks('', 0);
  }, [setSearchParams, fetchBooks]);

  const handleLoadMore = useCallback(() => {
    const newIndex = startIndex + 20;
    setStartIndex(newIndex);
    fetchBooks(searchQuery, newIndex);
  }, [startIndex, searchQuery, fetchBooks]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const queryFromUrl = searchParams.get('search') || location.state?.searchQuery;
      
      try {
        const cached = localStorage.getItem('cachedBooks');
        if (cached) {
          const cacheData = JSON.parse(cached);
          if (
            (!queryFromUrl || cacheData.query === queryFromUrl) && 
            isValidCache(cacheData.timestamp)
          ) {
            setBooks(cacheData.books);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking cache:', error);
      }

      if (queryFromUrl) {
        setSearchQuery(queryFromUrl);
        fetchBooks(queryFromUrl, 0);
      } else if (!searchQuery) {
        fetchBooks('', 0);
      }
      return;
    }

    const currentQuery = searchParams.get('search') || location.state?.searchQuery;
    if (currentQuery !== previousQuery.current) {
      previousQuery.current = currentQuery;
      if (currentQuery) {
        setSearchQuery(currentQuery);
        fetchBooks(currentQuery, 0);
      } else if (!searchQuery) {
        fetchBooks('', 0);
      }
    }
  }, [searchParams, location.state?.searchQuery, searchQuery, fetchBooks, isValidCache]);

  return (
    <div className="home-page">
      <div>
        <h1>Books</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books..."
            className="search-input"
          />
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className="search-button"
          >
            Search
          </button>
          <button
            type="button"
            disabled={!searchQuery.trim()}
            onClick={handleClear}
            className="clear-button"
          >
            Clear
          </button>
        </form>
      </div>
      {loading && <p>Loading...</p>}
      <div className="book-cards-container">
        {books.map((book, index) => (
          <BookCard 
            key={`${book.id}-${index}`} 
            book={book} 
            searchQuery={searchQuery} 
          />
        ))}
      </div>
      {!loading && books.length > 0 && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} disabled={loading}>
            Load More
          </button>
        </div>
      )}
      {!loading && books.length === 0 && <p>No books found.</p>}
    </div>
  );
};

export default Home;