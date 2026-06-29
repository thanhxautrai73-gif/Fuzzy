import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OtherSetting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  return (
    <div className="custom-container py-4 text-start">
      <div className="header-panel mb-4 d-flex align-items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn p-0 border-0">
          <i className="iconsax" data-icon="arrow-left" style={{ fontSize: '24px', color: '#000' }} />
        </button>
        <h3 className="m-0 fw-bold">Cài đặt khác</h3>
      </div>

      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
          <div>
            <h5 className="m-0 fw-semibold" style={{ fontSize: '14px' }}>Nhận thông báo đẩy</h5>
            <p className="text-muted m-0" style={{ fontSize: '11px' }}>Thông báo về đơn hàng & khuyến mãi</p>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" defaultChecked />
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
          <div>
            <h5 className="m-0 fw-semibold" style={{ fontSize: '14px' }}>Cập nhật ứng dụng tự động</h5>
            <p className="text-muted m-0" style={{ fontSize: '11px' }}>Luôn tải phiên bản mới nhất</p>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default OtherSetting;
