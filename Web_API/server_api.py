from flask import Flask, jsonify, send_file
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)  # Cho phép CORS để frontend có thể thực hiện request

# Đường dẫn tuyệt đối tới file JSON dự báo
JSON_FORECAST_PATH = r"D:\HocKy3_2024-2025\KhoaHocDuDoanDanSo\Model\arima_population_forecast.json"
# Đường dẫn file biểu đồ ACF/PACF
CHART_PATH_1 = r"D:\HocKy3_2024-2025\KhoaHocDuLieu\PhanTichDuDoanDanSo\Model\acf_pacf_chart.png"
# Đường dẫn file biểu đồ dự báo
CHART_PATH_2 = r"D:\HocKy3_2024-2025\KhoaHocDuLieu\PhanTichDuDoanDanSo\Model\forecast_chart.png"

@app.route('/forecast', methods=['GET'])
def get_forecast():
    """
    Endpoint này đọc file JSON chứa dữ liệu dự báo và trả về JSON.
    """
    if os.path.exists(JSON_FORECAST_PATH):
        try:
            with open(JSON_FORECAST_PATH, 'r') as f:
                data = json.load(f)
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": f"Error reading JSON file: {str(e)}"}), 500
    else:
        return jsonify({"error": "JSON file not found"}), 404

@app.route('/acf_pacf_chart', methods=['GET'])
def get_acf_pacf_chart():
    """
    Endpoint này trả về ảnh biểu đồ ACF/PACF dưới dạng PNG.
    """
    if os.path.exists(CHART_PATH_1):
        return send_file(CHART_PATH_1, mimetype="image/png")
    else:
        return jsonify({"error": "ACF/PACF chart not found"}), 404

@app.route('/forecast_chart', methods=['GET'])
def get_forecast_chart():
    """
    Endpoint này trả về ảnh biểu đồ dự báo dân số dưới dạng PNG.
    """
    if os.path.exists(CHART_PATH_2):
        return send_file(CHART_PATH_2, mimetype="image/png")
    else:
        return jsonify({"error": "Forecast chart not found"}), 404

if __name__ == '__main__':
    app.run(port=5004, debug=True)