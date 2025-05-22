import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA

# 📌 1️⃣ Tạo DataFrame từ dữ liệu dân số
data = {
    'Year': [1990, 2000, 2010, 2015, 2020, 2022], 
    'Population': [1069473, 1375564, 19542982, 28189672, 38972330, 41128771]
}

df = pd.DataFrame(data)
df.set_index("Year", inplace=True)

# 📌 2️⃣ Kiểm tra tính dừng của dữ liệu (ADF Test)
def check_stationarity(timeseries):
    result = adfuller(timeseries)
    print("ADF Statistic:", result[0])
    print("p-value:", result[1])
    if result[1] <= 0.05:
        print("✅ Dữ liệu có tính dừng")
    else:
        print("❌ Dữ liệu không dừng, cần lấy sai phân")

check_stationarity(df["Population"])

# Nếu dữ liệu không dừng, lấy sai phân
df["Population_diff"] = df["Population"].diff().dropna()

# 📌 3️⃣ Xác định tham số mô hình ARIMA (p, d, q)
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
sm.graphics.tsa.plot_acf(df["Population_diff"].dropna(), ax=axes[0])
sm.graphics.tsa.plot_pacf(df["Population_diff"].dropna(), ax=axes[1])
plt.show()

# Chọn tham số dựa trên biểu đồ ACF/PACF
p, d, q = 2, 1, 2  # Điều chỉnh tùy theo dữ liệu

# 📌 4️⃣ Huấn luyện mô hình ARIMA
model = ARIMA(df["Population"], order=(p, d, q))
model_fit = model.fit()

# Hiển thị thông tin mô hình
print(model_fit.summary())

# 📌 5️⃣ Dự báo dân số cho 10 năm tiếp theo
forecast_steps = 10
forecast = model_fit.forecast(steps=forecast_steps)

# Tạo DataFrame cho kết quả dự báo
future_years = list(range(df.index[-1] + 1, df.index[-1] + forecast_steps + 1))
df_forecast = pd.DataFrame({"Year": future_years, "Predicted Population": forecast})
df_forecast.set_index("Year", inplace=True)

# 📌 6️⃣ Trực quan hóa kết quả dự báo
plt.figure(figsize=(10, 5))
plt.plot(df["Population"], label="Dân số thực tế", marker="o")
plt.plot(df_forecast["Predicted Population"], label="Dự báo dân số", linestyle="--", marker="s")
plt.xlabel("Năm")
plt.ylabel("Dân số")
plt.title("Dự báo dân số bằng mô hình ARIMA")
plt.legend()
plt.show()

# 📌 7️⃣ Lưu kết quả vào CSV
df_forecast.to_csv("arima_population_forecast.csv")
print("🎯 Kết quả dự báo đã lưu vào 'arima_population_forecast.csv'")
