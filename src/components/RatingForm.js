import React, { useState, useEffect } from "react";
import axios from "axios";

const RatingForm = ({ onSubmit, rating = {} }) => {
  const [ocenka, setOcenka] = useState(rating.ocenka || "");
  const [comment_id, setComment_id] = useState(rating.comment_id || "");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/comments");
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRating = {
      ocenka,
      comment_id,
    };
    onSubmit(newRating);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="ocenka">Оценка</label>
        <input
          type="number"
          className="form-control"
          id="ocenka"
          value={ocenka}
          onChange={(e) => setOcenka(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="comment_id">Комментарий</label>
        <select
          className="form-control"
          id="comment_id"
          value={comment_id}
          onChange={(e) => setComment_id(e.target.value)}
        >
          <option value="">Выберите комментарий</option>
          {comments.map((comment) => (
            <option key={comment.id} value={comment.id}>
              {comment.text}
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

export default RatingForm;
