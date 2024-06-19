import React, { useState, useEffect } from "react";
import axios from "axios";

const BookForm = ({ onSubmit, book = {} }) => {
  const [book_name, setBook_name] = useState(book.book_name || "");
  const [janr_id, setJanr_id] = useState(book.janr_id || "");
  const [genres, setGenres] = useState([]);
  const [avtors, setAvtors] = useState([]);
  const [selectedAvtors, setSelectedAvtors] = useState(book.avtors || []);
  const [image, setImage] = useState(null);

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

  useEffect(() => {
    const fetchAvtors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/authors");
        setAvtors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    fetchAvtors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("book_name", book_name);
    formData.append("janr_id", janr_id);
    formData.append("image", image);
    selectedAvtors.forEach((avtorId) => {
      formData.append("avtors[]", avtorId);
    });
    onSubmit(formData);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAvtorChange = (e) => {
    const avtorId = parseInt(e.target.value, 10);
    if (selectedAvtors.includes(avtorId)) {
      setSelectedAvtors(selectedAvtors.filter((id) => id !== avtorId));
    } else {
      setSelectedAvtors([...selectedAvtors, avtorId]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="book_name">Название книги</label>
        <input
          type="text"
          className="form-control"
          id="book_name"
          value={book_name}
          onChange={(e) => setBook_name(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="janr_id">Жанр</label>
        <select
          className="form-control"
          id="janr_id"
          value={janr_id}
          onChange={(e) => setJanr_id(e.target.value)}
        >
          <option value="">Выберите жанр</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.nazvanie}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="avtors">Авторы</label>
        <select
          className="form-control"
          id="avtors"
          multiple
          value={selectedAvtors}
          onChange={handleAvtorChange}
        >
          {avtors.map((avtor) => (
            <option key={avtor.id} value={avtor.id}>
              {avtor.fio}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="image">Изображение</label>
        <input
          type="file"
          className="form-control-file"
          id="image"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Сохранить
      </button>
    </form>
  );
};

export default BookForm;
