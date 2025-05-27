import React, { useEffect, useState } from "react";
import "./App.css"
const ForecastTable = () => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    // Giả sử endpoint '/forecast' trả về dữ liệu
    fetch("http://localhost:5004/forecast")
      .then((response) => response.json())
      .then((data) => {
        // data có thể là một mảng các record: { Year: 2025, "Predicted Population": 123456 }
        setForecastData(data);
      })
      .catch((error) =>
        console.error("Error fetching forecast data:", error)
      );
  }, []);

  return (
    <div>
      <h2>Population Forecast Table</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Predicted Population</th>
          </tr>
        </thead>
        <tbody>
          {forecastData.map((record, index) => (
            <tr key={index}>
              <td>{record.Year}</td>
              <td>{record["Predicted Population"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForecastTable;
