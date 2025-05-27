// MainChart.jsx
import React from "react";

const MainChart = () => {
  // Đường dẫn đến hình ảnh được tạo bởi Matplotlib
  const chartImageUrl = "http://localhost:5004/forecast_chart.png";

  return (
    <div className="game-scene">
      <h2>Population Forecast Chart</h2>
      <img
        src={chartImageUrl}
        alt="Population Forecast Chart"
        className="chart-image"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default MainChart;
