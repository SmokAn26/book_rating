import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentForm = ({ onSubmit, comment = {} }) => {
  const [text, setText] = useState(comment.text || "");
  const [time, setTime] = useState(comment.time || "");
  const [user_id, setUser_id] = useState(comment.user_id || "");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      text,
      time,
      user_id,
    };
    onSubmit(newComment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="text">Текст комментария</label>
        <input
          type="text"
          className="form-control"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="time">Время</label>
        <input
          type="time"
          className="form-control"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="user_id">Пользователь</label>
        <select
          className="form-control"
          id="user_id"
          value={user_id}
          onChange={(e) => setUser_id(e.target.value)}
        >
          <option value="">Выберите пользователя</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fio}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Сохранить
      </button>
    </form>
  );
};

export default CommentForm;
