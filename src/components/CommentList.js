import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);

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

  const handleAddComment = async (newComment) => {
    try {
      const response = await axios.post("http://localhost:5000/api/comments", newComment);
      setComments([...comments, response.data]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
  };

  const handleUpdateComment = async (updatedComment) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/comments/${updatedComment.id}`,
        updatedComment
      );
      setComments(
        comments.map((comment) =>
          comment.id === updatedComment.id ? response.data : comment
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <h2>Комментарии</h2>
      {editingComment ? (
        <CommentForm onSubmit={handleUpdateComment} comment={editingComment} />
      ) : (
        <CommentForm onSubmit={handleAddComment} />
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Текст</th>
            <th>Время</th>
            <th>Пользователь</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.text}</td>
              <td>{comment.time}</td>
              <td>{comment.fio}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleEditComment(comment)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteComment(comment.id)}
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

export default CommentList;
