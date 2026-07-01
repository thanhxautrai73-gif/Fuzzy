import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');

    if (!id) return;
    setLoading(true);
    apiRequest(`/orders?id=${id}`)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải thông tin theo dõi đơn hàng:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-5">
        <h4>Không tìm thấy đơn hàng cần theo dõi!</h4>
        <Link to="/orders" className="btn btn-dark btn-sm rounded-pill mt-3 px-4">Quay lại Lịch sử đơn hàng</Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('vi-VN');

  // Ánh xạ trạng thái đơn hàng để hiển thị trên timeline
  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    if (stepIndex === 0) return 'completed'; // Nhận đơn
    if (stepIndex === 1) {
      if (currentStatus === 'PENDING') return 'ongoing';
      return 'completed'; // Đang chuẩn bị
    }
    if (stepIndex === 2) {
      if (currentStatus === 'PENDING') return '';
      if (currentStatus === 'PREPARING') return 'ongoing';
      return 'completed'; // Sẵn sàng giao
    }
    if (stepIndex === 3) {
      if (currentStatus === 'PENDING' || currentStatus === 'PREPARING') return '';
      if (currentStatus === 'SHIPPING') return 'ongoing';
      return 'completed'; // Đang vận chuyển
    }
    if (stepIndex === 4) {
      if (currentStatus === 'COMPLETED') return 'completed'; // Đã giao hàng
      return '';
    }
    return '';
  };

  const renderStepIcon = (status: string, pendingIcon: string) => {
    if (status === 'completed') {
      return <img className="process-icon" src="/images/svg/chack.svg" alt="check" />;
    }
    if (status === 'ongoing') {
      return <i className="iconsax process-icon text-warning" data-icon="box-time" style={{ fontSize: '20px' }}></i>;
    }
    return <i className="iconsax pending-icon text-muted" data-icon={pendingIcon} style={{ fontSize: '20px' }}></i>;
  };

  return (
    <div className="text-start">
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/orders">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Theo dõi đơn hàng</h3>
          </div>
        </div>
      </header>

      <section className="pt-0">
        <div className="custom-container">
          <h4 className="light-text fw-normal">Đặt ngày: {formattedDate}</h4>
          <div className="order-id d-flex justify-content-between gap-2 mt-2">
            <h4 className="theme-color fw-medium" style={{ fontSize: '13px' }}>Mã đơn: #{order.id.toUpperCase()}</h4>
            <h4 className="theme-color fw-semibold" style={{ fontSize: '13px' }}><span className="light-text fw-normal">Tổng: </span> ${order.totalPrice}</h4>
          </div>

          <div className="order-tracking bg-white shadow-sm p-4 rounded-3 mt-4" style={{ borderRadius: '15px' }}>
            <h2 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>Hành trình giao hàng</h2>
            <ul className="ps-0 mb-0">
              {/* Step 1 */}
              <li className={`order-process ${getStepStatus(0, order.status)}`}>
                <div className="d-flex gap-3 w-100">
                  <span>{renderStepIcon(getStepStatus(0, order.status), 'document-text')}</span>
                  <div className="process-details">
                    <h4>Đơn hàng đã được xác nhận</h4>
                    <h5>{formattedDate}</h5>
                  </div>
                </div>
              </li>
              {/* Step 2 */}
              <li className={`order-process ${getStepStatus(1, order.status)}`}>
                <div className="d-flex gap-3 w-100">
                  <span>{renderStepIcon(getStepStatus(1, order.status), 'box-time')}</span>
                  <div className="process-details">
                    <h4>Người bán đang chuẩn bị hàng</h4>
                    <h5>{order.status !== 'PENDING' ? formattedDate : 'Đang xử lý'}</h5>
                  </div>
                </div>
              </li>
              {/* Step 3 */}
              <li className={`order-process ${getStepStatus(2, order.status)}`}>
                <div className="d-flex gap-3 w-100">
                  <span>{renderStepIcon(getStepStatus(2, order.status), 'truck-fast')}</span>
                  <div className="process-details">
                    <h4>Hàng sẵn sàng gửi đi</h4>
                    <h5>{['SHIPPING', 'COMPLETED'].includes(order.status) ? formattedDate : 'Đang xử lý'}</h5>
                  </div>
                </div>
              </li>
              {/* Step 4 */}
              <li className={`order-process ${getStepStatus(3, order.status)}`}>
                <div className="d-flex gap-3 w-100">
                  <span>{renderStepIcon(getStepStatus(3, order.status), 'house')}</span>
                  <div className="process-details">
                    <h4>Đang trung chuyển qua kho phân phối</h4>
                    <h5>{['SHIPPING', 'COMPLETED'].includes(order.status) ? formattedDate : 'Đang xử lý'}</h5>
                  </div>
                </div>
              </li>
              {/* Step 5 */}
              <li className={`order-process ${getStepStatus(4, order.status)}`}>
                <div className="d-flex gap-3 w-100">
                  <span>{renderStepIcon(getStepStatus(4, order.status), 'gift')}</span>
                  <div className="process-details">
                    <h4>Đã giao hàng thành công</h4>
                    <h5>{order.status === 'COMPLETED' ? formattedDate : 'Chờ giao hàng'}</h5>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bill-details section-b-space pt-0 mt-2">
        <div className="custom-container">
          <div className="total-detail bg-white shadow-sm p-4 rounded-3" style={{ borderRadius: '15px' }}>
            <h4 className="fw-semibold mb-3 text-dark" style={{ fontSize: '15px' }}>Tóm tắt thanh toán:</h4>
            <div className="sub-total d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
              <h5 className="light-text m-0">Tạm tính</h5>
              <h4 className="fw-medium text-dark m-0">${order.totalPrice}</h4>
            </div>
            <div className="sub-total d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
              <h5 className="light-text m-0">Phí giao hàng</h5>
              <h4 className="fw-medium text-success m-0">Miễn phí</h4>
            </div>
            <hr />
            <div className="grand-total pt-2 d-flex justify-content-between">
              <h5 className="fw-bold m-0" style={{ fontSize: '15px' }}>Tổng thanh toán</h5>
              <h4 className="fw-bold amount m-0" style={{ fontSize: '18px', color: 'var(--theme-color)' }}>${order.totalPrice}</h4>
            </div>
          </div>
          <Link to="/shop" className="btn btn-dark w-100 py-3 rounded-pill fw-semibold mt-4">Tiếp tục mua sắm</Link>
        </div>
      </section>
    </div>
  );
};

export default OrderTracking;

