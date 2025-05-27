import React, { useEffect, useState } from "react";

const UserInfo = () => {
  // Giả lập thông tin người dùng; trong thực tế, bạn sẽ lấy từ Firebase (auth) sau khi đăng nhập.
  const [user, setUser] = useState({
    uid: "123456",
    displayName: "John Doe",
    photoURL: "https://via.placeholder.com/50"
  });

  // Cập nhật thời gian hệ thống
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="user-info">
      <img src={user.photoURL} alt="User Avatar" className="user-avatar" />
      <div className="user-details">
        <p>Xin chào, {user.displayName}</p>
        <p>ID: {user.uid}</p>
        <p>{currentTime}</p>
      </div>
    </div>
  );
};

export default UserInfo;
