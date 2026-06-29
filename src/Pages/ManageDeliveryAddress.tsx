import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageDeliveryAddress = () => {
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
        <h3 className="m-0 fw-bold">Quản lý địa chỉ giao hàng</h3>
      </div>

      <div className="d-flex flex-column gap-3 mb-4">
        <div className="card p-3 border-0 shadow-sm rounded-3">
          <h5 className="fw-semibold m-0" style={{ fontSize: '14px' }}>Nhà riêng (Mặc định)</h5>
          <p className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>Số 123, Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội</p>
          <p className="text-muted m-0" style={{ fontSize: '11px' }}>SĐT: 0987654321</p>
        </div>
      </div>

      <button className="btn btn-dark w-100 py-3 rounded-pill fw-semibold" style={{ fontSize: '14px' }}>+ Thêm địa chỉ mới</button>
    </div>
  );
};

export default ManageDeliveryAddress;
