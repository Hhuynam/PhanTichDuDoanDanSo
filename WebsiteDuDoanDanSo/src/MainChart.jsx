import React from "react";
import Slider from "react-slick"; // Import React Slick slider

// Import style của slick-carousel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const MainChart = () => {
  // Mảng chứa các URL ảnh từ API Python với query string tránh cache
  const imageUrls = [
    `http://localhost:5004/forecast_chart?time=${new Date().getTime()}`,
    `http://localhost:5004/acf_pacf_chart?time=${new Date().getTime()}`
  ];

  // Cấu hình slider
  const settings = {
    dots: true,           // Hiển thị các chấm điều hướng bên dưới slider
    infinite: true,       // Cho phép vòng lặp vô hạn
    speed: 500,           // Tốc độ chuyển slide (ms)
    slidesToShow: 1,      // Hiển thị 1 slide tại một thời điểm
    slidesToScroll: 1,    // Cuộn từng slide một khi chuyển
    arrows: true          // Hiển thị các mũi tên điều hướng
  };

  return (
    <div className="main-chart" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Population Forecast Chart</h2>
      <Slider {...settings}>
        {imageUrls.map((url, index) => (
          <div key={index}>
            <img
              src={url}
              alt={`Slide ${index}`}
              style={{ width: "100%", height: "auto", borderRadius: "5px" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MainChart;
