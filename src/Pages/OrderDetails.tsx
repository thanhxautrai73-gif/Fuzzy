import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const OrderDetails = () => {
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
        console.error('Lỗi khi tải chi tiết đơn hàng:', err);
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
        <h4>Không tìm thấy đơn hàng!</h4>
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
            <h3>Chi tiết đơn hàng</h3>
          </div>
        </div>
      </header>
      
      {/* Danh sách sản phẩm trong đơn hàng */}
      <section className="section-t-space pt-0">
        <div className="custom-container">
          <h4 className="fw-semibold mb-3" style={{ fontSize: '15px' }}>Sản phẩm đã mua:</h4>
          <div className="row g-3">
            {order.items.map((item: any) => (
              <div className="col-12" key={item.id}>
                <div className="order-product-box p-3 bg-white shadow-sm" style={{ borderRadius: '15px' }}>
                  <div className="horizontal-product-box pb-0">
                    <Link to={`/product/${item.product?.id}`} className="horizontal-product-img">
                      <img 
                        className="img-fluid img rounded" 
                        src={item.product?.image || "/images/1.png"} 
                        alt={item.product?.name} 
                        onError={(e) => { e.currentTarget.src = '/images/1.png' }}
                      />
                    </Link>
                    <div className="horizontal-product-details">
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        <h4 className="text-dark font-semibold text-truncate m-0" style={{ fontSize: '14px' }}>
                          {item.product?.name}
                        </h4>
                        <h3 className="fw-semibold text-dark m-0" style={{ fontSize: '15px' }}>${item.price}</h3>
                      </div>
                      <p className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>
                        {item.size ? `Size: ${item.size}` : ''} {item.color ? ` | Màu: ${item.color}` : ''}
                      </p>
                      <h5 className="text-muted mt-2" style={{ fontSize: '12px' }}>Số lượng: {item.quantity}</h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hành trình đơn hàng */}
      <section className="section-t-space pt-0">
        <div className="custom-container">
          <div className="order-tracking mt-0 bg-white shadow-sm p-4 rounded-3" style={{ borderRadius: '15px' }}>
            <h2 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>Hành trình đơn hàng</h2>
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
                    <h4>Đơn hàng đã được bàn giao cho đối tác vận chuyển</h4>
                    <h5>{['SHIPPING', 'COMPLETED'].includes(order.status) ? formattedDate : 'Đang xử lý'}</h5>
                  </div>
                </div>
              </li>
              {/* Step 4 */}
              <li className={`order-process ${getStepStatus(3, order.status)}`}>
                <div className="d-flex gap-3 w-100">
                  <span>{renderStepIcon(getStepStatus(3, order.status), 'house')}</span>
                  <div className="process-details">
                    <h4>Hàng đã đến kho phân phối nội bộ</h4>
                    <h5>{['SHIPPING', 'COMPLETED'].includes(order.status) ? formattedDate : 'Đang xử lý'}</h5>
                  </div>
                </div>
              </li>
              {/* Step 5 */}
              <li className={`order-process ${getStepStatus(4, order.status)}`}>
                <div className="d-flex gap-3 w-100">
                  <span>{renderStepIcon(getStepStatus(4, order.status), 'gift')}</span>
                  <div className="process-details">
                    <h4>Giao hàng thành công</h4>
                    <h5>{order.status === 'COMPLETED' ? formattedDate : 'Chờ hoàn thành'}</h5>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Chi tiết hóa đơn */}
      <section className="bill-details section-b-space pt-0">
        <div className="custom-container">
          <div className="total-detail bg-white shadow-sm p-4 rounded-3" style={{ borderRadius: '15px' }}>
            <h4 className="fw-semibold mb-3 text-dark" style={{ fontSize: '15px' }}>Thông tin thanh toán:</h4>
            <div className="sub-total d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
              <span className="text-muted">Phương thức thanh toán:</span>
              <span className="fw-medium text-dark">{order.paymentMethod === 'COD' ? 'Thanh toán COD' : 'Chuyển khoản / Ví điện tử'}</span>
            </div>
            <div className="sub-total d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
              <span className="text-muted">Trạng thái thanh toán:</span>
              <span className={`fw-medium ${order.paymentStatus === 'PAID' ? 'text-success' : 'text-danger'}`}>
                {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
            <hr />
            <div className="sub-total d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
              <h5 className="light-text m-0">Tạm tính</h5>
              <h4 className="fw-medium text-dark m-0">${order.totalPrice}</h4>
            </div>
            <div className="sub-total d-flex justify-content-between mb-3" style={{ fontSize: '13px' }}>
              <h5 className="light-text m-0">Phí giao hàng</h5>
              <h4 className="fw-medium text-success m-0">Miễn phí</h4>
            </div>
            <div className="grand-total pt-3 d-flex justify-content-between border-top border-light">
              <h5 className="fw-bold m-0" style={{ fontSize: '15px' }}>Tổng thanh toán</h5>
              <h4 className="fw-bold amount m-0" style={{ fontSize: '18px', color: 'var(--theme-color)' }}>${order.totalPrice}</h4>
            </div>
          </div>
          <Link to="/shop" className="btn btn-outline-dark w-100 py-3 rounded-pill fw-semibold mt-4">Tiếp tục mua sắm</Link>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;

