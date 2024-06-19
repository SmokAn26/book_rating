import React, { useState, useEffect } from "react";
import axios from "axios";
import { hashPassword } from "../utils/auth";

const UserForm = ({ onSubmit, user = {} }) => {
  const [fio, setFio] = useState(user.fio || "");
  const [login, setLogin] = useState(user.login || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role_id || 2);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPassword = await hashPassword(password);
    const newUser = {
      fio,
      login,
      password: hashedPassword,
      role_id: role,
    };
    onSubmit(newUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fio">ФИО</label>
        <input
          type="text"
          className="form-control"
          id="fio"
          value={fio}
          onChange={(e) => setFio(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="login">Логин</label>
        <input
          type="text"
          className="form-control"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="role">Роль</label>
        <select
          className="form-control"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.nazvanie}
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

export default UserForm;
