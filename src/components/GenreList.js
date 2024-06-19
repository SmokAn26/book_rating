import React, { useState, useEffect } from "react";
import axios from "axios";
import GenreForm from "./GenreForm";

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [editingGenre, setEditingGenre] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/genres");
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleAddGenre = async (newGenre) => {
    try {
      const response = await axios.post("http://localhost:5000/api/genres", newGenre);
      setGenres([...genres, response.data]);
    } catch (error) {
      console.error("Error adding genre:", error);
    }
  };

  const handleEditGenre = (genre) => {
    setEditingGenre(genre);
  };

  const handleUpdateGenre = async (updatedGenre) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/genres/${updatedGenre.id}`,
        updatedGenre
      );
      setGenres(
        genres.map((genre) =>
          genre.id === updatedGenre.id ? response.data : genre
        )
      );
      setEditingGenre(null);
    } catch (error) {
      console.error("Error updating genre:", error);
    }
  };

  const handleDeleteGenre = async (genreId) => {
    try {
      await axios.delete(`http://localhost:5000/api/genres/${genreId}`);
      setGenres(genres.filter((genre) => genre.id !== genreId));
    } catch (error) {
      console.error("Error deleting genre:", error);
    }
  };

  return (
    <div>
      <h2>Жанры</h2>
      {editingGenre ? (
        <GenreForm onSubmit={handleUpdateGenre} genre={editingGenre} />
      ) : (
        <GenreForm onSubmit={handleAddGenre} />
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Название жанра</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.id}>
              <td>{genre.nazvanie}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleEditGenre(genre)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteGenre(genre.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenreList;
