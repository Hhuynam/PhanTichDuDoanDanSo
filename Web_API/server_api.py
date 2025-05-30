from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
import os
import json
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

app = Flask(__name__)
CORS(app)  # Cho phép CORS để frontend có thể thực hiện request

# Đường dẫn tuyệt đối tới file JSON dự báo
JSON_FORECAST_PATH = r"D:\HocKy3_2024-2025\KhoaHocDuLieu\PhanTichDuDoanDanSo\Model\arima_population_forecast.json"
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

# NEW: Endpoint POST /run_prediction để chạy mô hình ARIMA và trả về kết quả dự báo
@app.route('/run_prediction', methods=['POST'])
def run_prediction():
    try:
        # Nhận các tham số dự báo từ request body
        data = request.json or {}
        p = int(data.get("p", 2))
        d = int(data.get("d", 1))
        q = int(data.get("q", 2))
        forecast_steps = int(data.get("forecastSteps", 10))
        
        # Step 1: Tạo DataFrame từ dữ liệu dân số
        data_dict = {
            'Year': [1990, 2000, 2010, 2015, 2020, 2022],
            'Population': [1069473, 1375564, 19542982, 28189672, 38972330, 41128771]
        }
        df = pd.DataFrame(data_dict)
        df.set_index("Year", inplace=True)
        
        # Step 2: Kiểm tra tính dừng (ADF Test) - (in ra console, bỏ qua xử lý phức tạp)
        result = adfuller(df["Population"])
        print("ADF Statistic:", result[0])
        print("p-value:", result[1])
        
        # Step 4: Huấn luyện mô hình ARIMA
        model = ARIMA(df["Population"], order=(p, d, q))
        model_fit = model.fit()
        print(model_fit.summary())
        
        # Step 5: Dự báo dân số
        future_years = list(range(df.index[-1] + 1, df.index[-1] + forecast_steps + 1))
        forecast = model_fit.forecast(steps=forecast_steps)
        df_forecast = pd.DataFrame({"Year": future_years, "Predicted Population": forecast})
        df_forecast.set_index("Year", inplace=True)
        
        # Step 6: Thiết lập folder để lưu kết quả
        output_folder = r"D:\HocKy3_2024-2025\KhoaHocDuLieu\PhanTichDuDoanDanSo\Model"
        os.makedirs(output_folder, exist_ok=True)
        
        csv_filepath = os.path.join(output_folder, "arima_population_forecast.csv")
        png_acf_pacf_filepath = os.path.join(output_folder, "acf_pacf_chart.png")
        png_forecast_filepath = os.path.join(output_folder, "forecast_chart.png")
        json_filepath = os.path.join(output_folder, "arima_population_forecast.json")
        
        # Step 7: Lưu figure ACF/PACF vào file PNG
        fig_acf_pacf, axes = plt.subplots(1, 2, figsize=(12, 5))
        sm.graphics.tsa.plot_acf(df["Population"].diff().dropna(), ax=axes[0])
        sm.graphics.tsa.plot_pacf(df["Population"].diff().dropna(), ax=axes[1])
        fig_acf_pacf.savefig(png_acf_pacf_filepath)
        plt.close(fig_acf_pacf)
        
        # Step 8: Trực quan hóa kết quả dự báo và lưu file ảnh PNG
        fig_forecast = plt.figure(figsize=(10, 5))
        plt.plot(df["Population"], label="Actual Population", marker="o")
        plt.plot(df_forecast.index, df_forecast["Predicted Population"], label="Forecasted Population", linestyle="--", marker="s")
        plt.xlabel("Year")
        plt.ylabel("Population")
        plt.title("Population Forecast using ARIMA Model")
        plt.legend()
        fig_forecast.savefig(png_forecast_filepath)
        plt.close(fig_forecast)
        
        # Step 9: Lưu kết quả dự báo vào file CSV và JSON
        df_forecast.to_csv(csv_filepath)
        df_json = df_forecast.reset_index()
        df_json.to_json(json_filepath, orient="records", indent=2)
        
        return jsonify({
            "message": "Prediction completed",
            "forecast": df_forecast.to_dict(orient="index")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5004, debug=True)
