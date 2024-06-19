import React, { useState, useEffect } from "react";
import axios from "axios";
import RatingForm from "./RatingForm";

const RatingList = () => {
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  const [editingRating, setEditingRating] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ratingsResponse = await axios.get("http://localhost:5000/api/ratings");
        const commentsResponse = await axios.get("http://localhost:5000/api/comments");
        setRatings(ratingsResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddRating = async (newRating) => {
    try {
      const response = await axios.post("http://localhost:5000/api/ratings", newRating);
      setRatings([...ratings, response.data]);
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  const handleEditRating = (rating) => {
    setEditingRating(rating);
  };

  const handleUpdateRating = async (updatedRating) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/ratings/${updatedRating.id}`,
        updatedRating
      );
      setRatings(
        ratings.map((rating) =>
          rating.id === updatedRating.id ? response.data : rating
        )
      );
      setEditingRating(null);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/ratings/${ratingId}`);
      setRatings(ratings.filter((rating) => rating.id !== ratingId));
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  return (
    <div>
      <h2>Рейтинги</h2>
      {editingRating ? (
        <RatingForm onSubmit={handleUpdateRating} rating={editingRating} />
      ) : (
        <RatingForm onSubmit={handleAddRating} />
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Оценка</th>
            <th>Комментарий</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
        {ratings.map((rating) => {
            const comment = comments.find((c) => c.id === rating.comment_id);
            return (
              <tr key={rating.id}>
                <td>{rating.ocenka}</td>
                <td>{comment ? comment.text : "Нет комментария"}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleEditRating(rating)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteRating(rating.id)}
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

export default RatingList;
