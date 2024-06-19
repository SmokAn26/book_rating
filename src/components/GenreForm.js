import React, { useState } from "react";

const GenreForm = ({ onSubmit, genre = {} }) => {
  const [nazvanie, setNazvanie] = useState(genre.nazvanie || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGenre = {
      nazvanie,
    };
    onSubmit(newGenre);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nazvanie">Название жанра</label>
        <input
          type="text"
          className="form-control"
          id="nazvanie"
          value={nazvanie}
          onChange={(e) => setNazvanie(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Сохранить
      </button>
    </form>
  );
};

export default GenreForm;
