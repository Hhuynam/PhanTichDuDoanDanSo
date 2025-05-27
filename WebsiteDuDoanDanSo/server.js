import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Tính __dirname cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5003;

app.use(cors());

// Đường dẫn file dự báo JSON
const forecastJsonPath = "D:\\HocKy3_2024-2025\\KhoaHocDuLieu\\PhanTichDuDoanDanSo\\Model\\arima_population_forecast.json";
// Đường dẫn file thông báo JSON
const notificationsJsonPath = "D:\\HocKy3_2024-2025\\KhoaHocDuDoanDanSo\\WebsiteDuDoanDanSo\\src\\assets\\web_notification.json";

// Endpoint GET /forecast: Đọc file JSON dự báo và trả về nội dung JSON
app.get("/forecast", (req, res) => {
  fs.readFile(forecastJsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading forecast JSON file:", err);
      return res.status(500).json({ error: "Error reading forecast file" });
    }
    try {
      const forecastData = JSON.parse(data);
      res.json(forecastData);
    } catch (parseErr) {
      console.error("Error parsing forecast JSON:", parseErr);
      res.status(500).json({ error: "Error parsing forecast JSON" });
    }
  });
});

// Endpoint GET /notifications: Đọc file JSON của thông báo và trả về nội dung JSON
app.get("/notifications", (req, res) => {
  fs.readFile(notificationsJsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading notifications JSON file:", err);
      return res.status(500).json({ error: "Error reading notifications file" });
    }
    try {
      const notificationsData = JSON.parse(data);
      res.json(notificationsData);
    } catch (parseErr) {
      console.error("Error parsing notifications JSON:", parseErr);
      res.status(500).json({ error: "Error parsing notifications JSON" });
    }
  });
});

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
