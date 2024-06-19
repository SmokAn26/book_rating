import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import BookList from "./components/BookList";
import AuthorList from "./components/AuthorList";
import GenreList from "./components/GenreList";
import CommentList from "./components/CommentList";
import RatingList from "./components/RatingList";
import UserList from "./components/UserList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error authenticating user:", error);
        });
    }
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/books"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <BookList />
              </PrivateRoute>
            }
          />
          <Route
            path="/authors"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <AuthorList />
              </PrivateRoute>
            }
          />
          <Route
            path="/genres"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <GenreList />
              </PrivateRoute>
            }
          />
          <Route
            path="/comments"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <CommentList />
              </PrivateRoute>
            }
          />
          <Route
            path="/ratings"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <RatingList />
              </PrivateRoute>
            }
          />
          {isAuthenticated && user.role_id === 1 && (
            <Route
              path="/users"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <UserList />
                </PrivateRoute>
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
