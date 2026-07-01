import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
    
    apiRequest('/orders')
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải lịch sử đơn hàng:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="text-start">
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/profile">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Lịch sử đơn hàng</h3>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <section className="section-b-space pt-0">
          <div className="custom-container">
            {orders.length === 0 ? (
              <div className="empty-tab text-center py-5">
                <img className="img-fluid empty-img w-100 mb-4" src="/images/gif/order.gif" alt="empty-order" style={{ maxWidth: '280px' }} />
                <h2>Không có đơn hàng nào</h2>
                <h5 className="mt-3 text-muted">Bạn chưa đặt đơn hàng nào. Hãy chọn những món nội thất ưng ý nhé!</h5>
                <Link to="/shop" className="btn btn-dark rounded-pill px-4 mt-4 py-2">Mua sắm ngay</Link>
              </div>
            ) : (
              <div className="row g-3">
                {orders.map((o) => {
                  const firstItem = o.items?.[0];
                  const product = firstItem?.product;
                  const formattedDate = new Date(o.createdAt).toLocaleDateString('vi-VN');
                  const orderName = o.items.map((i: any) => i.product?.name || 'Sản phẩm').join(', ');
                  const totalQty = o.items.reduce((acc: number, i: any) => acc + i.quantity, 0);

                  return (
                    <div className="col-12" key={o.id}>
                      <div className="order-product-box p-3 bg-white shadow-sm mb-2" style={{ borderRadius: '15px' }}>
                        <div className="horizontal-product-box pb-2 border-bottom border-light">
                          <Link to={`/order-tracking?id=${o.id}`} className="horizontal-product-img">
                            <img 
                              className="img-fluid img rounded" 
                              src={product?.image || "/images/1.png"} 
                              alt="product" 
                              onError={(e) => { e.currentTarget.src = '/images/1.png' }}
                            />
                          </Link>
                          <div className="horizontal-product-details">
                            <div className="d-flex align-items-start justify-content-between gap-2">
                              <h4 className="text-dark font-semibold text-truncate m-0" style={{ maxWidth: '170px', fontSize: '14px' }}>
                                {orderName}
                              </h4>
                              <h6 className="product-status m-0 px-2 py-1 rounded" style={{
                                fontSize: '11px',
                                backgroundColor: o.status === 'COMPLETED' ? '#d1e7dd' : o.status === 'CANCELLED' ? '#f8d7da' : '#fff3cd',
                                color: o.status === 'COMPLETED' ? '#0f5132' : o.status === 'CANCELLED' ? '#842029' : '#664d03'
                              }}>
                                {o.status === 'PENDING' ? 'Chờ duyệt' : 
                                 o.status === 'PREPARING' ? 'Chuẩn bị' : 
                                 o.status === 'SHIPPING' ? 'Đang giao' : 
                                 o.status === 'COMPLETED' ? 'Đã giao' : 'Đã hủy'}
                              </h6>
                            </div>
                            <h5 className="text-muted mt-1" style={{ fontSize: '12px' }}>Số lượng: {totalQty}</h5>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <Link to={`/order-tracking?id=${o.id}`} className="view-details text-decoration-none fw-semibold" style={{ fontSize: '12px', color: 'var(--theme-color)' }}>
                                Xem hành trình
                              </Link>
                              <Link to={`/order-details?id=${o.id}`} className="view-details text-decoration-none fw-semibold text-muted" style={{ fontSize: '12px' }}>
                                Xem chi tiết
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="order-details pt-2">
                          <div className="d-flex align-items-center justify-content-between" style={{ fontSize: '12px' }}>
                            <h5 className="theme-color m-0">Đặt ngày: <span className="light-text">{formattedDate}</span></h5>
                            <h5 className="fw-bold text-dark m-0">Tổng: ${o.totalPrice}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default OrderHistory;

