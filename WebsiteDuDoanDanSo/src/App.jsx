import React from "react";
import "./App.css";
import Footage from "./Footage";
import Sidebar from "./Sidebar";
import ForecastTable from "./ForecastTable";
import MainChart from "./MainChart";
import UserInfo from "./UserInfo";  // Import thông tin người dùng

function App() {
  return (
    <div className="App">
      <header>
        <h1>Population Insight - Website A.I dự đoán dân số</h1>
        <p>Bạn gửi file - Hệ thống cho bạn dự đoán - Cùng có lợi!</p>
      </header>
      <div className="topnav">
        <a href="#dang-nhap">Đăng nhập</a>
        <a href="#huong-dan">Hướng dẫn</a>
        <a href="#goi-tai-khoan">Gói tài khoản</a>
        <a href="#thong-tin">Thông tin webapp</a>
        <a href="#lien-he">Liên hệ</a>
      </div>
      
      {/* Thêm khối hiển thị thông tin người dùng */}
      <UserInfo />

      <div className="row">
        {/* Left Column: Sidebar */}
        <div className="column left">
          <Sidebar />
        </div>
        {/* Middle Column: Main Scene */}
        <div className="column middle">
          <MainChart />
        </div>
        {/* Right Column: Forecast Table */}
        <div className="column right">
          <ForecastTable />
        </div>
      </div>
      <Footage />
    </div>
  );
}

export default App;
