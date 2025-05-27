import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA

# -------------------------------------------------------
# Step 1: Tạo DataFrame từ dữ liệu dân số
data = {
    'Year': [1990, 2000, 2010, 2015, 2020, 2022], 
    'Population': [1069473, 1375564, 19542982, 28189672, 38972330, 41128771]
}
df = pd.DataFrame(data)
df.set_index("Year", inplace=True)

# -------------------------------------------------------
# Step 2: Kiểm tra tính dừng của dữ liệu (ADF Test)
def check_stationarity(timeseries):
    result = adfuller(timeseries)
    print("ADF Statistic:", result[0])
    print("p-value:", result[1])
    if result[1] <= 0.05:
        print("Data is stationary")
    else:
        print("Data is not stationary, differencing is needed")

check_stationarity(df["Population"])

# Nếu dữ liệu không dừng, lấy sai phân
df["Population_diff"] = df["Population"].diff().dropna()

# -------------------------------------------------------
# Step 3: Xác định tham số mô hình ARIMA (p, d, q)
# Tạo figure cho ACF và PACF
fig_acf_pacf, axes = plt.subplots(1, 2, figsize=(12, 5))
sm.graphics.tsa.plot_acf(df["Population_diff"].dropna(), ax=axes[0])
sm.graphics.tsa.plot_pacf(df["Population_diff"].dropna(), ax=axes[1])

# -------------------------------------------------------
# Step 4: Huấn luyện mô hình ARIMA
p, d, q = 2, 1, 2  # Điều chỉnh theo dữ liệu
model = ARIMA(df["Population"], order=(p, d, q))
model_fit = model.fit()
print(model_fit.summary())

# -------------------------------------------------------
# Step 5: Dự báo dân số cho 10 năm tiếp theo
forecast_steps = 10
forecast = model_fit.forecast(steps=forecast_steps)

# Tạo DataFrame cho kết quả dự báo
future_years = list(range(df.index[-1] + 1, df.index[-1] + forecast_steps + 1))
df_forecast = pd.DataFrame({"Year": future_years, "Predicted Population": forecast})
df_forecast.set_index("Year", inplace=True)

# -------------------------------------------------------
# Step 6: Thiết lập folder để lưu kết quả
output_folder = r"D:\HocKy3_2024-2025\KhoaHocDuLieu\PhanTichDuDoanDanSo\Model"
os.makedirs(output_folder, exist_ok=True)

csv_filepath = os.path.join(output_folder, "arima_population_forecast.csv")
png_acf_pacf_filepath = os.path.join(output_folder, "acf_pacf_chart.png")
png_forecast_filepath = os.path.join(output_folder, "forecast_chart.png")
json_filepath = os.path.join(output_folder, "arima_population_forecast.json")

# -------------------------------------------------------
# Step 7: Lưu figure ACF/PACF vào file PNG
fig_acf_pacf.savefig(png_acf_pacf_filepath)
plt.close(fig_acf_pacf)  # Đóng figure sau khi lưu để giải phóng bộ nhớ

# -------------------------------------------------------
# Step 8: Trực quan hóa kết quả dự báo và lưu file ảnh PNG
fig_forecast = plt.figure(figsize=(10, 5))
plt.plot(df["Population"], label="Actual Population", marker="o")
plt.plot(df_forecast["Predicted Population"], label="Forecasted Population", linestyle="--", marker="s")
plt.xlabel("Year")
plt.ylabel("Population")
plt.title("Population Forecast using ARIMA Model")
plt.legend()
fig_forecast.savefig(png_forecast_filepath)
plt.close(fig_forecast)

# -------------------------------------------------------
# Step 9: Lưu kết quả dự báo vào file CSV và JSON
df_forecast.to_csv(csv_filepath)
print(f"Forecast CSV saved to '{csv_filepath}'")

# Reset index để 'Year' trở thành một cột dữ liệu khi xuất JSON
df_json = df_forecast.reset_index()
df_json.to_json(json_filepath, orient="records", indent=2)
print(f"Forecast JSON saved to '{json_filepath}'")
print(f"ACF/PACF chart saved to '{png_acf_pacf_filepath}'")
print(f"Forecast chart saved to '{png_forecast_filepath}'")