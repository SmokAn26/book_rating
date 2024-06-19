import React, { useState } from "react";
import axios from "axios";

const AuthorForm = ({ onSubmit, author = {} }) => {
  const [fio, setFio] = useState(author.fio || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAuthor = {
      fio,
    };
    onSubmit(newAuthor);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fio">ФИО автора</label>
        <input
          type="text"
          className="form-control"
          id="fio"
          value={fio}
          onChange={(e) => setFio(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Сохранить
      </button>
    </form>
  );
};

export default AuthorForm;
