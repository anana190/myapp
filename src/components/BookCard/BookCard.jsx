import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";

const BookCard = ({ book, isFavoritePage, removeFavorite }) => {
  const navigate = useNavigate();

  if (!book?.volumeInfo) {
    return null;
  }

  const { volumeInfo, id } = book;
  const {
    title = "Untitled",
    authors = [],
    publishedDate = "Date unknown",
    imageLinks,
    averageRating = "No rating",
  } = volumeInfo;

  const handleSeeDetails = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="book-card">
      <img
        src={imageLinks?.thumbnail || "/assets/images/book-placeholder.svg"}
        alt={`${title} cover`}
        className="book-image"
      />
      <h3 className="book-title">{title}</h3>
      <p className="book-authors">
        {authors.length ? authors.join(", ") : "Author unknown"}
      </p>
      <p className="book-date">{publishedDate}</p>
      <p className="book-rating">
        Rating:{" "}
        {averageRating === "No rating"
          ? "No ratings available"
          : `${averageRating} / 5`}
      </p>
      <button onClick={handleSeeDetails}>See Details</button>
      {isFavoritePage && (
        <button onClick={() => removeFavorite(id)} className="remove-button">
          Remove from Favorites
        </button>
      )}
    </div>
  );
};

export default BookCard;
