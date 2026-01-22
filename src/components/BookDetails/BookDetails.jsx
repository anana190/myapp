import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById } from "../../services/api";
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(() => {
    try {
      const cachedBooks = JSON.parse(
        localStorage.getItem("cachedBookDetails") || "{}"
      );
      return cachedBooks[id] ? cachedBooks[id].book : null;
    } catch (error) {
      console.error("Error loading cached book:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(!book); // only show loading if no cached book
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      return favorites.some((fav) => fav.id === id);
    } catch (error) {
      console.error("Error loading favorites:", error);
      return false;
    }
  });

  const cacheBook = useCallback(
    (bookData) => {
      try {
        const cachedBooks = JSON.parse(
          localStorage.getItem("cachedBookDetails") || "{}"
        );
        cachedBooks[id] = {
          book: bookData,
          timestamp: Date.now(),
        };
        // keep last 20 books in cache
        const bookIds = Object.keys(cachedBooks);
        if (bookIds.length > 20) {
          const oldestId = bookIds.sort(
            (a, b) => cachedBooks[a].timestamp - cachedBooks[b].timestamp
          )[0];
          delete cachedBooks[oldestId];
        }
        localStorage.setItem("cachedBookDetails", JSON.stringify(cachedBooks));
      } catch (error) {
        console.error("Error caching book:", error);
      }
    },
    [id]
  );

  const fetchBookDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // check cache first
      const cachedBooks = JSON.parse(
        localStorage.getItem("cachedBookDetails") || "{}"
      );
      const cachedBook = cachedBooks[id];

      if (cachedBook && Date.now() - cachedBook.timestamp < 3600000) {
        // 1 hour cache
        setBook(cachedBook.book);
        setLoading(false);
        return;
      }

      const data = await getBookById(id);
      setBook(data);
      cacheBook(data);
    } catch (err) {
      setError("Failed to load book details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, cacheBook]);

  useEffect(() => {
    if (!book) {
      fetchBookDetails();
    }
  }, [book, fetchBookDetails]);

  const handleFavoriteToggle = useCallback(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

      if (isFavorite) {
        const updatedFavorites = favorites.filter((fav) => fav.id !== id);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      } else {
        const updatedFavorites = [...favorites, book];
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  }, [id, book, isFavorite]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>Book not found</div>;

  const {
    volumeInfo: {
      title,
      authors = [],
      publishedDate,
      description,
      imageLinks,
      categories = [],
      pageCount,
      publisher,
      language,
      averageRating,
      ratingsCount,
    } = {},
  } = book;

  return (
    <div className="product-details">
      <button onClick={handleGoBack} className="back-button">
        ← Go Back
      </button>
      <div className="product-header">
        <img
          src={imageLinks?.thumbnail || "/assets/images/book-placeholder.svg"}
          alt={`${title} cover`}
          className="product-image"
        />
        <div className="product-info">
          <h1>{title}</h1>
          <p className="authors">By {authors.join(", ")}</p>
          <p className="publisher">
            {publisher && `Published by ${publisher}`}
            {publishedDate && ` (${publishedDate})`}
          </p>
          {averageRating && (
            <p className="rating">
              Rating: {averageRating}/5 ({ratingsCount} reviews)
            </p>
          )}
          <button
            onClick={handleFavoriteToggle}
            className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>

      <div className="product-details-content">
        {description && (
          <section>
            <h2>Description</h2>
            <p>{description}</p>
          </section>
        )}

        <section className="additional-info">
          <h2>Additional Information</h2>
          <ul>
            {categories.length > 0 && (
              <li>Categories: {categories.join(", ")}</li>
            )}
            {pageCount && <li>Pages: {pageCount}</li>}
            {language && <li>Language: {language.toUpperCase()}</li>}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default BookDetails;
