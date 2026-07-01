import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/shipping-address');
  };

  return (
    <div className="text-start pb-5">
      {/* Header */}
      <div className="custom-container pt-3 d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-semibold m-0">Giỏ hàng</h2>
        <span className="text-muted" style={{ fontSize: '13px' }}>{items.length} mặt hàng</span>
      </div>

      <div className="custom-container">
        {items.length === 0 ? (
          <div className="text-center py-5 bg-white shadow-sm p-4 rounded-3">
            <span style={{ fontSize: '48px' }}>🛒</span>
            <h4 className="mt-3">Giỏ hàng của bạn đang trống</h4>
            <p className="text-muted" style={{ fontSize: '13px' }}>Hãy thêm một vài món nội thất xinh xắn vào giỏ hàng nhé!</p>
            <Link to="/shop" className="btn btn-dark rounded-pill px-4 mt-3 py-2 btn-sm">Mua sắm ngay</Link>
          </div>
        ) : (
          <div>
            <div className="text-muted mb-2" style={{ fontSize: '11px' }}>
              💡 Mẹo: Vuốt mạnh sang trái/phải để xóa sản phẩm khỏi giỏ hàng.
            </div>

            {/* Danh sách giỏ hàng hỗ trợ vuốt chạm */}
            <div className="d-flex flex-column gap-3 overflow-hidden">
              <AnimatePresence>
                {items.map((item) => {
                  const key = `${item.productId}-${item.size}-${item.color}`;
                  
                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, x: -300, height: 0, transition: { duration: 0.3 } }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.7}
                      onDragEnd={(_, info) => {
                        // Nếu vuốt kéo quá 120px, tiến hành xóa
                        if (Math.abs(info.offset.x) > 120) {
                          removeItem(item.productId, item.size, item.color);
                        }
                      }}
                      className="position-relative bg-white shadow-sm p-3 border-0"
                      style={{ borderRadius: '15px', cursor: 'grab' }}
                    >
                      {/* Background khi vuốt */}
                      <div className="position-absolute w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-between px-3 text-white rounded-3 bg-danger" style={{ zIndex: -1 }}>
                        <span>Xóa bỏ 🗑️</span>
                        <span>🗑️ Xóa bỏ</span>
                      </div>

                      {/* Thông tin sản phẩm */}
                      <div className="d-flex gap-3 bg-white" style={{ position: 'relative', zIndex: 1 }}>
                        <div className="rounded-3" style={{ width: '80px', height: '80px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={item.image} alt={item.name} className="w-100 h-100 object-cover" onError={(e) => { e.currentTarget.src = 'images/1.png' }} />
                        </div>
                        <div className="flex-grow-1">
                          <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '15px' }}>{item.name}</h4>
                          <p className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>
                            {item.size ? `Size: ${item.size}` : ''} {item.color ? ` | Màu: ${item.color}` : ''}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <h4 className="fw-bold m-0" style={{ fontSize: '15px' }}>${item.price}</h4>
                            
                            {/* Tăng giảm số lượng */}
                            <div className="d-flex align-items-center gap-2 border rounded-pill px-2 py-1">
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateQuantity(item.productId, item.size, item.color, item.quantity - 1); }}
                                className="btn p-0 border-0 fw-bold"
                                style={{ width: '20px', fontSize: '14px' }}
                              >
                                -
                              </button>
                              <span className="fw-semibold" style={{ fontSize: '13px' }}>{item.quantity}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateQuantity(item.productId, item.size, item.color, item.quantity + 1); }}
                                className="btn p-0 border-0 fw-bold"
                                style={{ width: '20px', fontSize: '14px' }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Chi tiết tính tổng hóa đơn */}
            <div className="card border-0 shadow-sm p-3 mt-4 bg-white" style={{ borderRadius: '15px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Tạm tính:</span>
                <span className="fw-semibold">${getTotalPrice()}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Phí giao hàng:</span>
                <span className="fw-semibold text-success">Miễn phí</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold m-0">Tổng thanh toán:</h4>
                <h3 className="fw-bold text-dark m-0" style={{ fontSize: '20px' }}>${getTotalPrice()}</h3>
              </div>
              <button 
                onClick={handleCheckout} 
                className="btn btn-dark w-100 py-3 rounded-pill fw-semibold"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="panel-space" style={{ height: '70px' }} />
    </div>
  );
};

export default Cart;
