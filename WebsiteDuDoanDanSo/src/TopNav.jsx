// TopNav.jsx
import React, { useState, useEffect } from "react";
import "./App.css";

function TopNav() {
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Khi modal được mở, fetch thông báo từ API
  useEffect(() => {
    if (modalVisible) {
      fetch("http://localhost:5003/notifications")
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data);
          // Nếu có thông báo thì đánh dấu có thông báo mới
          setHasNewNotifications(data && data.length > 0);
        })
        .catch((error) =>
          console.error("Error fetching notifications:", error)
        );
    }
  }, [modalVisible]);

  // Hàm chuyển đổi trạng thái hiển thị modal;
  // nếu mở modal, đánh dấu các thông báo là đã xem (badge ẩn đi)
  const toggleModal = () => {
    if (!modalVisible) {
      setHasNewNotifications(false);
    }
    setModalVisible(!modalVisible);
  };

  // Hàm xóa thông báo khỏi state khi nhấn nút X
  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) => {
      const filtered = prevNotifications.filter(
        (notification) => notification.id !== id
      );
      // Nếu đã xóa hết, đánh dấu không còn thông báo mới
      if (filtered.length === 0) {
        setHasNewNotifications(false);
      }
      return filtered;
    });
  };

  return (
    <>
      <div className="topnav d-flex align-items-center position-relative">
        <a href="#dang-nhap">Đăng nhập</a>
        <a href="#dang-ky">Đăng ký</a>
        <a href="#nap-tien">Nạp tiền</a>
        {/* Nút hiển thị biểu tượng chuông */}
        <button
          onClick={toggleModal}
          className="btn btn-link ms-auto position-relative"
          style={{ border: "none", background: "none" }}
        >
          <i className="fa fa-bell" style={{ fontSize: "24px" }}></i>
          {/* Nếu có thông báo mới, hiển thị badge đỏ */}
          {hasNewNotifications && (
            <span
              className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
              style={{ width: "10px", height: "10px" }}
            >
              <span className="visually-hidden">New alerts</span>
            </span>
          )}
        </button>
      </div>

      {/* Modal hiển thị danh sách thông báo */}
      {modalVisible && (
        <>
          <div
            className="modal show fade"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thông báo hệ thống</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={toggleModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {notifications.length > 0 ? (
                    <ul className="list-unstyled">
                      {notifications.map((note) => (
                        <li
                          key={note.id}
                          className="d-flex justify-content-between align-items-center mb-2"
                        >
                          <div>
                            <strong>{note.title}</strong>: {note.message}
                            <br />
                            <small>
                              {new Date(note.date).toLocaleString("vi-VN")}
                            </small>
                          </div>
                          <button
                            className="btn btn-sm btn-danger ms-2"
                            onClick={() => handleDeleteNotification(note.id)}
                          >
                            X
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có thông báo mới.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={toggleModal}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Overlay của modal */}
          <div className="modal-backdrop fade show" onClick={toggleModal}></div>
        </>
      )}
    </>
  );
}

export default TopNav;
