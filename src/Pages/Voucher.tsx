import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Voucher = () => {
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
        <h3 className="m-0 fw-bold">Ví Voucher</h3>
      </div>
      
      <div className="d-flex flex-column gap-3">
        <div className="card p-3 border-0 shadow-sm rounded-3" style={{ background: 'linear-gradient(135deg, #ffedeb, #ffdcd8)' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold text-danger m-0">Giảm $10</h5>
              <p className="text-muted m-0 mt-1" style={{ fontSize: '11px' }}>Cho đơn hàng từ $50 trở lên</p>
            </div>
            <span className="badge bg-danger">HSD: 30/12</span>
          </div>
        </div>

        <div className="card p-3 border-0 shadow-sm rounded-3" style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold text-primary m-0">Miễn phí vận chuyển</h5>
              <p className="text-muted m-0 mt-1" style={{ fontSize: '11px' }}>Cho đơn hàng đầu tiên</p>
            </div>
            <span className="badge bg-primary">HSD: 15/12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
