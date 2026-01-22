import React, { useState, useCallback } from "react";
import BookCard from "../components/BookCard/BookCard";
import Modal from "../components/Modal/Modal";
import "./Home.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const handleRemoveClick = useCallback((id) => {
    setSelectedBookId(id);
    setModalOpen(true);
  }, []);

  const confirmRemove = useCallback(() => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter(
        (fav) => fav.id !== selectedBookId
      );
      try {
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
      return updatedFavorites;
    });
    setModalOpen(false);
    setSelectedBookId(null);
  }, [selectedBookId]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedBookId(null);
  }, []);

  return (
    <div className="favorites-page">
      <h1>Favorites page</h1>
      <div className="book-cards-container">
        {favorites.length > 0 ? (
          favorites.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isFavoritePage={true}
              removeFavorite={handleRemoveClick}
            />
          ))
        ) : (
          <p>No favorites added yet.</p>
        )}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmRemove}
        message="Are you sure you want to remove this book from your favorites?"
      />
    </div>
  );
};

export default Favorites;
