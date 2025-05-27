import React, { useState, useRef } from "react";
import "./App.css";

const Sidebar = () => {
  // State lưu các tham số model ARIMA
  const [p, setP] = useState(1);
  const [d, setD] = useState(1);
  const [q, setQ] = useState(1);
  const [forecastSteps, setForecastSteps] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // State lưu file đã chọn
  const [selectedFile, setSelectedFile] = useState(null);

  // Tham chiếu tới <input type="file">
  const fileInputRef = useRef();

  // Hàm xử lý khi nhấn nút "Tải file dữ liệu csv"
  const handleUploadFile = () => {
    console.log("Chức năng tải file được gọi.");
    // Mở hộp thoại chọn file
    fileInputRef.current.click();
  };

  // Khi file được chọn
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      console.log("File được chọn:", file);
      // Bạn có thể tiến hành upload file ngay ở đây hoặc khi người dùng nhấn nút khác.
    }
  };

  // Hàm xử lý khi nhấn nút "Dự đoán ngay"
  const handlePredict = async () => {
    // Tạo object chứa các tham số
    const params = {
      p: Number(p),
      d: Number(d),
      q: Number(q),
      forecastSteps: Number(forecastSteps)
    };

    console.log("Gửi yêu cầu dự đoán với params:", params);
    setLoading(true);
    setError("");
    try {
      // Gửi POST request đến endpoint backend /run_prediction
      const response = await fetch("http://localhost:5005/run_prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg);
      }
      const result = await response.json();
      console.log("Dự đoán hoàn thành, kết quả:", result);
      alert("Dự đoán xong! Vui lòng kiểm tra kết quả mới trên giao diện.");
    } catch (err) {
      console.error("Lỗi khi dự đoán:", err);
      setError("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="column side sidebar">
      <h2>Control Panel - Menu</h2>
      <ul>
        <li>
          <button type="button" onClick={handleUploadFile}>
            Tải file dữ liệu csv
          </button>
          {/* Ẩn input file, nó sẽ được kích hoạt khi gọi fileInputRef.current.click() */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleFileChange}
          />
        </li>
        <li>
          <div style={{ marginTop: "10px" }}>
            <label>Tham số p: </label>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(e.target.value)}
              style={{ width: "50px", marginRight: "10px" }}
            />
          </div>
          <div>
            <label>Tham số d: </label>
            <input
              type="number"
              value={d}
              onChange={(e) => setD(e.target.value)}
              style={{ width: "50px", marginRight: "10px" }}
            />
          </div>
          <div>
            <label>Tham số q: </label>
            <input
              type="number"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: "50px", marginRight: "10px" }}
            />
          </div>
          <div>
            <label>Số năm dự báo: </label>
            <input
              type="number"
              value={forecastSteps}
              onChange={(e) => setForecastSteps(e.target.value)}
              style={{ width: "60px", marginRight: "10px" }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <button type="button" onClick={handlePredict} disabled={loading}>
              {loading ? "Đang dự đoán..." : "Dự đoán ngay"}
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
