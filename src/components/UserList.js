import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import verifyRole from '../utils/auth';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

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

  const handleAddUser = async (newUser) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users", newUser);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${updatedUser.id}`,
        updatedUser
      );
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? response.data : user))
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h2>Пользователи</h2>
      {editingUser ? (
        <UserForm onSubmit={handleUpdateUser} user={editingUser} />
      ) : (
        <UserForm onSubmit={handleAddUser} />
      )}
      <table className="table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Логин</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fio}</td>
              <td>{user.login}</td>
              <td>{user.role_id === 1 ? "Администратор" : "Пользователь"}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleEditUser(user)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id)}
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

export default UserList;
