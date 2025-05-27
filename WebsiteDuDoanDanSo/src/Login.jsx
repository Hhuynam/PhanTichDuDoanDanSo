import React, { useState } from "react";
import "./App.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập đăng nhập: trong thực tế, bạn thay thế bằng logic xác thực (Firebase, API,…)
    // Ví dụ, nếu email và password không rỗng, coi như đăng nhập thành công.
    if (email && password) {
      onLogin({ email }); // Truyền thông tin người dùng qua callback
    } else {
      setError("Vui lòng điền đầy đủ thông tin đăng nhập.");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
          />
        </div>
        <div>
          <label>Mật khẩu: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
