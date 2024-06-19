import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthorForm from "./AuthorForm";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [editingAuthor, setEditingAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/authors");
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    fetchAuthors();
  }, []);

  const handleAddAuthor = async (newAuthor) => {
    try {
      const response = await axios.post("http://localhost:5000/api/authors", newAuthor);
      setAuthors([...authors, response.data]);
    } catch (error) {
      console.error("Error adding author:", error);
    }
  };

  const handleEditAuthor = (author) => {
    setEditingAuthor(author);
  };

  const handleUpdateAuthor = async (updatedAuthor) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/authors/${updatedAuthor.id}`,
        updatedAuthor
      );
      setAuthors(
        authors.map((author) =>
          author.id === updatedAuthor.id ? response.data : author
        )
      );
      setEditingAuthor(null);
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  const handleDeleteAuthor = async (authorId) => {
    try {
      await axios.delete(`http://localhost:5000/api/authors/${authorId}`);
      setAuthors(authors.filter((author) => author.id !== authorId));
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  return (
    <div>
      <h2>Авторы</h2>
      {editingAuthor ? (
        <AuthorForm onSubmit={handleUpdateAuthor} author={editingAuthor} />
      ) : (
        <AuthorForm onSubmit={handleAddAuthor} />
      )}
      <table className="table">
        <thead>
          <tr>
            <th>ФИО автора</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.fio}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleEditAuthor(author)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteAuthor(author.id)}
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

export default AuthorList;
