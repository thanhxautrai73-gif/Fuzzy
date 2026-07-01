import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { apiRequest } from '../utils/api';

interface Card {
  id: string;
  cardNumber: string;
  cardHolderName: string;
  cvv: string;
  expDate: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('COD'); // COD, card-id, paypal, apple-pay, google-pay
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState<any>(null);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');

    if (!user) {
      navigate('/login');
      return;
    }

    // 1. Tải danh sách thẻ từ backend
    apiRequest('/cards')
      .then((data) => {
        setCards(data);
        if (data.length > 0) {
          setSelectedMethod(`card-${data[0].id}`);
        }
      })
      .catch((err) => console.error('Lỗi khi tải danh sách thẻ:', err));

    // 2. Lấy địa chỉ giao hàng đã chọn từ localStorage
    const storedAddr = localStorage.getItem('selected_shipping_address');
    if (storedAddr) {
      try {
        setAddress(JSON.parse(storedAddr));
      } catch (e) {
        console.error('Lỗi parse địa chỉ:', e);
      }
    }
  }, [user, navigate]);

  const handleDeleteCard = async (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Bạn có chắc muốn xóa thẻ thanh toán này?')) return;

    try {
      await apiRequest(`/cards?id=${cardId}`, {
        method: 'DELETE',
      });
      setCards(cards.filter(c => c.id !== cardId));
      if (selectedMethod === `card-${cardId}`) {
        setSelectedMethod('COD');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa thẻ.');
    }
  };

  const handlePayNow = async () => {
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Giỏ hàng của bạn trống.');
      return;
    }

    if (!address) {
      setErrorMsg('Vui lòng chọn địa chỉ giao hàng trước khi thanh toán.');
      return;
    }

    setLoading(true);

    // Xác định tên phương thức thanh toán hiển thị
    let paymentMethodName = 'COD';
    if (selectedMethod.startsWith('card-')) {
      const cardId = selectedMethod.replace('card-', '');
      const card = cards.find(c => c.id === cardId);
      if (card) {
        paymentMethodName = `Card (Ending in ${card.cardNumber.slice(-4)})`;
      } else {
        paymentMethodName = 'Card Payment';
      }
    } else if (selectedMethod === 'paypal') {
      paymentMethodName = 'PayPal';
    } else if (selectedMethod === 'apple-pay') {
      paymentMethodName = 'Apple Pay';
    } else if (selectedMethod === 'google-pay') {
      paymentMethodName = 'Google Pay';
    }

    const payload = {
      totalPrice: getTotalPrice(),
      paymentMethod: paymentMethodName,
      address,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      })),
    };

    try {
      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setSuccessOrder(res);
      clearCart();
      localStorage.removeItem('selected_shipping_address'); // Xóa địa chỉ đã chọn để bắt đầu lại lần sau
    } catch (err: any) {
      setErrorMsg(err.message || 'Thanh toán & đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();

  // Màn hình đặt hàng thành công
  if (successOrder) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex flex-column align-items-center justify-content-center bg-white px-3">
        <div className="confirm-title text-center">
          <img
            className="img-fluid confirm-offer mb-4"
            src="/images/gif/success.gif"
            alt="success-payment"
            style={{ maxWidth: '120px' }}
          />

          <h2 className="theme-color text-center fw-semibold mt-2" style={{ fontSize: '24px' }}>
            Congratulations !!
          </h2>
          <h5 className="light-text fw-normal lh-base text-center w-100 mt-2 mx-auto text-muted" style={{ maxWidth: '320px', fontSize: '14px' }}>
            Đơn hàng của bạn đã được chấp nhận. Các sản phẩm đang trên đường giao tới bạn.
          </h5>

          <div className="card border-0 bg-light p-3 my-4 w-100" style={{ borderRadius: '15px', maxWidth: '360px', margin: '0 auto' }}>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted" style={{ fontSize: '13px' }}>Mã đơn hàng:</span>
              <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>#{successOrder.id.toUpperCase()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted" style={{ fontSize: '13px' }}>Tổng thanh toán:</span>
              <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>${successOrder.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column gap-3 w-100 px-3" style={{ maxWidth: '360px' }}>
          <Link to={`/order-tracking?id=${successOrder.id}`} className="btn theme-btn w-100 py-3 rounded-pill fw-semibold" role="button">
            Theo dõi đơn hàng
          </Link>
          <Link to="/shop" className="btn gray-btn w-100 py-3 rounded-pill fw-semibold">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-start pb-5">
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/shipping-address">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Phương thức Thanh toán</h3>
          </div>
        </div>
      </header>

      <section className="payment-method section-lg-b-space">
        <div className="custom-container">
          {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

          {/* Tóm tắt địa chỉ giao hàng */}
          {address ? (
            <div className="card border-0 p-3 mb-4 bg-light" style={{ borderRadius: '15px' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className="fw-bold m-0" style={{ fontSize: '13px' }}>Địa chỉ nhận hàng:</h5>
                <Link to="/shipping-address" className="text-decoration-none text-primary" style={{ fontSize: '12px' }}>Thay đổi</Link>
              </div>
              <p className="text-dark m-0" style={{ fontSize: '12px' }}>
                {address.receiverName} - {address.receiverPhone}
              </p>
              <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                {address.detailAddress}, {address.ward}, {address.district}, {address.province}
              </p>
            </div>
          ) : (
            <div className="alert alert-warning py-3 mb-4 text-center rounded-3">
              <p className="m-0 mb-2" style={{ fontSize: '13px' }}>Bạn chưa chọn địa chỉ giao hàng.</p>
              <Link to="/shipping-address" className="btn btn-sm btn-dark rounded-pill px-3">Chọn địa chỉ giao hàng</Link>
            </div>
          )}

          <h2 className="fw-semibold theme-color" style={{ fontSize: '15px' }}>Thẻ của bạn</h2>

          <ul className="payment-list section-lg-b-space ps-0 mb-0">
            {cards.length === 0 ? (
              <li className="text-muted text-center py-4 bg-white rounded-3 shadow-sm p-3 mt-2 list-unstyled" style={{ borderRadius: '15px' }}>
                Chưa có thẻ thanh toán nào được thêm.
              </li>
            ) : (
              cards.map((c) => {
                const isSelected = selectedMethod === `card-${c.id}`;
                return (
                  <li key={c.id} className="cart-add-box payment-card-box gap-0 mt-3 list-unstyled">
                    <div className="payment-detail border-bottom-0 w-100 d-flex justify-content-between align-items-center">
                      <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor={`card-${c.id}`} style={{ cursor: 'pointer', flexGrow: 1 }}>
                        {c.cardNumber.startsWith('4') ? (
                          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                            <rect width="40" height="24" rx="4" fill="#1A1F71"/>
                            <path d="M15.3 7.5l-2.1 9h-2.1l2.1-9h2.1zm8.7 0l-1.8 6.4-.8-4.4c-.1-.7-.7-1.3-1.4-1.3h-2.6v.3c.5.1 1.1.3 1.5.6.3.3.4.7.3 1.1l-1.9 6.7h2.2l3.4-6.4 1.8 6.4h1.9l2.8-9H24zm-14.3 0c-.5.2-.9.5-1.1.9l-2 5.5H8.7l-.5-2.2c-.2-.7-.7-1.1-1.3-1.2h-.9v-.3c1-.2 1.8-.7 2.2-1.3.3-.5.4-1 .3-1.4h2.1zm24.6 0l-1.7 9h2.1l1.7-9h-2.1z" fill="#FFF"/>
                          </svg>
                        ) : (
                          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                            <rect width="40" height="24" rx="4" fill="#0A0A0A"/>
                            <circle cx="14" cy="12" r="8" fill="#EB001B"/>
                            <circle cx="26" cy="12" r="8" fill="#F79E1B" fillOpacity="0.8"/>
                          </svg>
                        )}
                        <span>
                          <span className="fw-medium theme-color card-heading d-block" style={{ fontSize: '14px' }}>
                            Card ending in {c.cardNumber.slice(-4)}
                          </span>
                          <span className="fw-normal card-sub-heading text-muted" style={{ fontSize: '12px' }}>
                            Expires on {c.expDate} | {c.cardHolderName}
                          </span>
                        </span>
                      </label>
                      <div className="d-flex align-items-center gap-3">
                        <button
                          onClick={(e) => handleDeleteCard(e, c.id)}
                          className="btn btn-sm btn-outline-danger border-0 p-1"
                          title="Xóa thẻ"
                        >
                          🗑️
                        </button>
                        <div className="form-check">
                          <input
                            id={`card-${c.id}`}
                            className="form-check-input"
                            type="radio"
                            name="paymentOption"
                            checked={isSelected}
                            onChange={() => setSelectedMethod(`card-${c.id}`)}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          <div className="new-card mt-3">
            <Link to="/new-card" style={{ textDecoration: 'none' }}>
              <h6 className="fw-semibold text-primary" style={{ fontSize: '13px' }}>+ Thêm thẻ thanh toán mới</h6>
            </Link>
          </div>

          <h2 className="fw-semibold theme-color section-t-space mt-4" style={{ fontSize: '15px' }}>Ví điện tử & Ví khác</h2>
          <div className="payment-list">
            <ul className="cart-add-box payment-card-box gap-0 mt-3 ps-0 mb-0">
              {/* PayPal */}
              <li className="w-100 list-unstyled">
                <div className="payment-detail d-flex justify-content-between align-items-center">
                  <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="paypal" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                      <rect width="35" height="24" rx="4" fill="#003087" />
                      <path d="M14 6.5h-4.2c-.3 0-.5.2-.6.5L6.5 17c0 .2.1.4.3.4h2l1-4.7.1-.4h2c2 0 3.3-1 3.7-3 .2-.9.1-1.6-.3-2-.5-.5-1.3-.8-2.3-.8zm.3 3c-.2.9-.9.9-1.7.9h-.8l.4-2h.8c.7 0 1.2.1 1.4.3.2.2.3.5.2.8zm5.2-1.7h-3.2c-.2 0-.4.1-.5.3l-1.4 6.7c0 .2.1.3.2.3h1.6l.7-3.3.1-.3h1.4c1.7 0 2.8-.8 3.2-2.5.2-.8.1-1.3-.3-1.7-.4-.3-1.1-.6-1.9-.6zm.3 2.6c-.2.8-.8.8-1.5.8h-.8l.3-1.7h.8c.6 0 1.1.1 1.3.3.1.2.2.4.1.6z" fill="#FFF"/>
                    </svg>
                    <span className="fw-medium theme-color" style={{ fontSize: '14px' }}>Pay Pal</span>
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="paypal"
                      type="radio"
                      name="paymentOption"
                      checked={selectedMethod === 'paypal'}
                      onChange={() => setSelectedMethod('paypal')}
                    />
                  </div>
                </div>
              </li>

              {/* Apple Pay */}
              <li className="w-100 list-unstyled">
                <div className="payment-detail d-flex justify-content-between align-items-center">
                  <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="apple-pay" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                      <rect width="35" height="24" rx="4" fill="#000000"/>
                      <path d="M10.8 10.3c-.1-1 .7-1.6 1.7-2.1-.5-.7-1.3-1-2.1-1.1-1-.1-1.7.5-2.2.5-.5 0-1.1-.4-1.9-.4-.9 0-1.8.5-2.3 1.3-1 1.7-.3 4.2.7 5.6.5.7 1 1.5 1.8 1.5.8 0 1.1-.5 2.1-.5 1 0 1.3.5 2.1.5.8 0 1.3-.7 1.8-1.5.6-.9.8-1.7.8-1.8-.1 0-1.5-.6-1.5-2.1zm-1.4-4c.4-.5.7-1.2.6-1.9-.6.1-1.4.4-1.8 1-.4.4-.7 1.1-.6 1.8.7.1 1.4-.4 1.8-.9z" fill="#FFFFFF"/>
                      <text x="14" y="16" fill="#FFFFFF" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto" fontSize="7.5" fontWeight="bold">Pay</text>
                    </svg>
                    <span className="fw-medium theme-color" style={{ fontSize: '14px' }}>Apple Pay</span>
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="apple-pay"
                      type="radio"
                      name="paymentOption"
                      checked={selectedMethod === 'apple-pay'}
                      onChange={() => setSelectedMethod('apple-pay')}
                    />
                  </div>
                </div>
              </li>

              {/* Google Pay */}
              <li className="w-100 list-unstyled">
                <div className="payment-detail d-flex justify-content-between align-items-center">
                  <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="google-pay" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" style={{ borderRadius: '4px', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                      <rect width="35" height="24" rx="4" fill="#FFFFFF"/>
                      <path d="M10.8 11.4c0-.3 0-.6-.1-.9H8.5v1.7h1.3c-.1.5-.3.9-.7 1.2v1h1.2c.7-.6 1.1-1.6 1.1-2.6v-.4z" fill="#4285F4"/>
                      <path d="M8.5 13.8c.8 0 1.4-.2 1.9-.7l-1.2-1c-.3.2-.7.4-1.2.4-.9 0-1.7-.6-2-1.4H4.8v1c.5 1.1 1.6 1.7 2.7 1.7z" fill="#34A853"/>
                      <path d="M6.5 11.1c-.1-.3-.1-.6-.1-1s0-.7.1-1H4.8a2.9 2.9 0 000 2.1l1.7-.1z" fill="#FBBC05"/>
                      <path d="M8.5 8.2c.8 0 1.4.3 1.9.7l1.1-1.1C10.8 7.2 9.7 6.8 8.5 6.8c-1.1 0-2.2.6-2.7 1.7l1.7 1c.3-.8 1.1-1.3 2-1.3z" fill="#EA4335"/>
                      <text x="13.2" y="15.2" fill="#5F6368" fontFamily="'Outfit', sans-serif" fontSize="9" fontWeight="800">Pay</text>
                    </svg>
                    <span className="fw-medium theme-color" style={{ fontSize: '14px' }}>Google Pay</span>
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="google-pay"
                      type="radio"
                      name="paymentOption"
                      checked={selectedMethod === 'google-pay'}
                      onChange={() => setSelectedMethod('google-pay')}
                    />
                  </div>
                </div>
              </li>

              {/* Cash on Delivery */}
              <li className="w-100 list-unstyled">
                <div className="payment-detail border-bottom-0 d-flex justify-content-between align-items-center">
                  <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="cod" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                      <rect width="35" height="24" rx="4" fill="#10B981"/>
                      <circle cx="17.5" cy="12" r="5" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
                      <rect x="5" y="5" width="25" height="14" rx="2" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
                      <text x="15.5" y="15" fill="#FFFFFF" fontFamily="sans-serif" fontSize="9" fontWeight="bold">$</text>
                    </svg>
                    <span className="fw-medium theme-color" style={{ fontSize: '14px' }}>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="cod"
                      type="radio"
                      name="paymentOption"
                      checked={selectedMethod === 'cod' || selectedMethod === 'COD'}
                      onChange={() => setSelectedMethod('cod')}
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Nút Sticky Bottom Thanh Toán */}
      <div
        className="position-fixed bottom-0 start-50 translate-middle-x bg-white border-top p-3 w-100 shadow-lg d-flex align-items-center justify-content-between"
        style={{ maxWidth: '480px', zIndex: 90 }}
      >
        <div>
          <span className="text-muted" style={{ fontSize: '12px' }}>Tổng thanh toán</span>
          <h2 className="fw-bold text-dark m-0" style={{ fontSize: '20px' }}>${totalPrice}</h2>
        </div>
        <button
          onClick={handlePayNow}
          className="btn btn-lg theme-btn pay-btn mt-0 fw-semibold"
          disabled={loading || items.length === 0 || !address}
          style={{ padding: '12px 30px', borderRadius: '30px' }}
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
        </button>
      </div>

      <div className="panel-space" style={{ height: '90px' }} />
    </div>
  );
};

export default Payment;
