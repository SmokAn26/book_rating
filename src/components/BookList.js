import React, { useState, useEffect } from "react";
import axios from "axios";
import BookForm from "./BookForm";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [janrs, setJanrs] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get("http://localhost:5000/api/books");
        const janrsResponse = await axios.get("http://localhost:5000/api/janrs");
        setBooks(booksResponse.data);
        setJanrs(janrsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddBook = async (formData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setBooks([...books, response.data]);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
  };

  const handleUpdateBook = async (formData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/books/${editingBook.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBooks(
        books.map((book) => (book.id === editingBook.id ? response.data : book))
      );
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`);
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div>
      <h2>Книги</h2>
      {editingBook ? (
        <BookForm onSubmit={handleUpdateBook} book={editingBook} />
      ) : (
        <BookForm onSubmit={handleAddBook} />
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Жанр</th>
            <th>Авторы</th>
            <th>Изображение</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
        {books.map((book) => {
            const janr = janrs.find((j) => j.id === book.janr_id);
            return (
              <tr key={book.id}>
                <td>{book.book_name}</td>
                <td>{janr ? janr.nazvanie : "Нет жанра"}</td>
              <td>
                {book.avtors.map((avtor) => (
                  <p key={avtor.id}>{avtor.fio}</p>
                ))}
              </td>
              <td>
                {book.image && (
                  <img
                    src={`data:image/jpeg;base64,${book.image}`}
                    alt={book.book_name}
                    style={{ maxWidth: "100px" }}
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleEditBook(book)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Удалить
                </button>
              </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
