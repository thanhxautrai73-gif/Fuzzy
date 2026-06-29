import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';

interface Address {
  id: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, BANK_TRANSFER, VNPAY, MOMO
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0 && step !== 3) {
      navigate('/cart');
      return;
    }
    // Lấy sổ địa chỉ của người dùng
    apiRequest('/addresses')
      .then((data) => {
        setAddresses(data);
        const defaultAddr = data.find((a: Address) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr);
        else if (data.length > 0) setSelectedAddress(data[0]);
      })
      .catch((err) => console.error('Error fetching addresses:', err));
  }, [user, items]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedAddress) {
        setErrorMsg('Vui lòng thêm và chọn địa chỉ giao hàng để tiếp tục.');
        return;
      }
      setErrorMsg('');
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrorMsg('');

    const payload = {
      totalPrice: getTotalPrice(),
      paymentMethod,
      address: selectedAddress,
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
      setCreatedOrder(res);
      clearCart();
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đặt hàng không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-start pb-5">
      {/* Top Navigation */}
      <div className="custom-container pt-3 d-flex justify-content-between align-items-center mb-4">
        {step !== 3 && (
          <button onClick={() => step === 2 ? setStep(1) : navigate(-1)} className="btn p-0 border-0">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>← Quay lại</span>
          </button>
        )}
        <h3 className="fw-semibold m-0 text-center flex-grow-1" style={{ fontSize: '16px' }}>
          {step === 1 ? 'Xác nhận Địa chỉ' : step === 2 ? 'Phương thức Thanh toán' : 'Đặt hàng Thành công'}
        </h3>
      </div>

      {/* Thanh quy trình các bước */}
      {step !== 3 && (
        <div className="custom-container mb-4">
          <div className="d-flex justify-content-between position-relative px-5">
            <div className="d-flex flex-column align-items-center" style={{ zIndex: 2 }}>
              <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${step >= 1 ? 'bg-dark text-white' : 'bg-light text-muted'}`} style={{ width: '30px', height: '30px', fontSize: '13px' }}>1</div>
              <span className="mt-1" style={{ fontSize: '11px' }}>Địa chỉ</span>
            </div>
            <div className="d-flex flex-column align-items-center" style={{ zIndex: 2 }}>
              <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${step >= 2 ? 'bg-dark text-white' : 'bg-light text-muted'}`} style={{ width: '30px', height: '30px', fontSize: '13px' }}>2</div>
              <span className="mt-1" style={{ fontSize: '11px' }}>Thanh toán</span>
            </div>
            <div className="d-flex flex-column align-items-center" style={{ zIndex: 2 }}>
              <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${step >= 3 ? 'bg-dark text-white' : 'bg-light text-muted'}`} style={{ width: '30px', height: '30px', fontSize: '13px' }}>3</div>
              <span className="mt-1" style={{ fontSize: '11px' }}>Hoàn tất</span>
            </div>
            <div className="position-absolute start-0 w-100 top-50 border-top translate-middle-y" style={{ zIndex: 1, borderColor: '#e5e4e7', height: '1px' }}></div>
          </div>
        </div>
      )}

      <div className="custom-container">
        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

        {/* BƯỚC 1: Xác nhận địa chỉ nhận hàng */}
        {step === 1 && (
          <div>
            <h4 className="fw-semibold mb-3" style={{ fontSize: '15px' }}>Chọn địa chỉ nhận hàng:</h4>
            {addresses.length === 0 ? (
              <div className="text-center py-4 bg-white rounded-3 shadow-sm p-3">
                <p className="text-muted mb-3" style={{ fontSize: '13px' }}>Bạn chưa có địa chỉ giao hàng nào.</p>
                <Link to="/profile" className="btn btn-dark btn-sm rounded-pill px-4 py-2">Tạo địa chỉ trong hồ sơ</Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {addresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    onClick={() => setSelectedAddress(addr)}
                    className={`card border-0 shadow-sm p-3 bg-white position-relative ${selectedAddress?.id === addr.id ? 'border border-dark' : ''}`}
                    style={{ borderRadius: '15px', cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '14px' }}>{addr.receiverName}</h4>
                      {addr.isDefault && (
                        <span className="badge bg-success" style={{ fontSize: '9px' }}>Mặc định</span>
                      )}
                    </div>
                    <p className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>SĐT: {addr.receiverPhone}</p>
                    <p className="text-dark m-0 mt-1" style={{ fontSize: '12px' }}>
                      {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                    {selectedAddress?.id === addr.id && (
                      <span className="position-absolute top-3 end-3 text-dark fw-bold" style={{ fontSize: '18px' }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={handleNextStep}
              className="btn btn-dark w-100 py-3 rounded-pill fw-semibold mt-4"
              disabled={!selectedAddress}
            >
              Tiếp tục chọn phương thức thanh toán
            </button>
          </div>
        )}

        {/* BƯỚC 2: Chọn phương thức thanh toán */}
        {step === 2 && (
          <div>
            <h4 className="fw-semibold mb-3" style={{ fontSize: '15px' }}>Chọn phương thức thanh toán:</h4>
            <div className="d-flex flex-column gap-3">
              {/* COD */}
              <div 
                onClick={() => setPaymentMethod('COD')}
                className={`card border-0 shadow-sm p-3 bg-white d-flex flex-row align-items-center justify-content-between ${paymentMethod === 'COD' ? 'border border-dark' : ''}`}
                style={{ borderRadius: '15px', cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: '24px' }}>💵</span>
                  <div>
                    <h4 className="fw-semibold m-0" style={{ fontSize: '14px' }}>COD (Thanh toán khi nhận hàng)</h4>
                    <p className="text-muted m-0" style={{ fontSize: '11px' }}>Thanh toán bằng tiền mặt khi hàng được giao tới.</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'COD'} readOnly />
              </div>

              {/* BANK TRANSFER */}
              <div 
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`card border-0 shadow-sm p-3 bg-white d-flex flex-row align-items-center justify-content-between ${paymentMethod === 'BANK_TRANSFER' ? 'border border-dark' : ''}`}
                style={{ borderRadius: '15px', cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: '24px' }}>🏛️</span>
                  <div>
                    <h4 className="fw-semibold m-0" style={{ fontSize: '14px' }}>Chuyển khoản Ngân hàng</h4>
                    <p className="text-muted m-0" style={{ fontSize: '11px' }}>Chuyển khoản trực tiếp tới số tài khoản Fuzzy.</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'BANK_TRANSFER'} readOnly />
              </div>

              {/* VNPAY */}
              <div 
                onClick={() => setPaymentMethod('VNPAY')}
                className={`card border-0 shadow-sm p-3 bg-white d-flex flex-row align-items-center justify-content-between ${paymentMethod === 'VNPAY' ? 'border border-dark' : ''}`}
                style={{ borderRadius: '15px', cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: '24px' }}>💳</span>
                  <div>
                    <h4 className="fw-semibold m-0" style={{ fontSize: '14px' }}>Cổng VNPay (Giả lập)</h4>
                    <p className="text-muted m-0" style={{ fontSize: '11px' }}>Thanh toán qua ứng dụng ngân hàng quét mã QR.</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'VNPAY'} readOnly />
              </div>

              {/* MOMO */}
              <div 
                onClick={() => setPaymentMethod('MOMO')}
                className={`card border-0 shadow-sm p-3 bg-white d-flex flex-row align-items-center justify-content-between ${paymentMethod === 'MOMO' ? 'border border-dark' : ''}`}
                style={{ borderRadius: '15px', cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: '24px' }}>📱</span>
                  <div>
                    <h4 className="fw-semibold m-0" style={{ fontSize: '14px' }}>Ví MoMo (Giả lập)</h4>
                    <p className="text-muted m-0" style={{ fontSize: '11px' }}>Thanh toán nhanh chóng bằng ví điện tử MoMo.</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'MOMO'} readOnly />
              </div>
            </div>

            {/* Thông tin tóm tắt giao hàng */}
            <div className="card border-0 p-3 mt-4 bg-light" style={{ borderRadius: '15px' }}>
              <h5 className="fw-bold mb-1" style={{ fontSize: '13px' }}>Địa chỉ nhận hàng:</h5>
              <p className="text-dark m-0" style={{ fontSize: '12px' }}>
                {selectedAddress?.receiverName} - {selectedAddress?.receiverPhone}
              </p>
              <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                {selectedAddress?.detailAddress}, {selectedAddress?.ward}, {selectedAddress?.district}, {selectedAddress?.province}
              </p>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="btn btn-dark w-100 py-3 rounded-pill fw-semibold mt-4"
              disabled={loading}
            >
              {loading ? 'Đang xử lý đặt hàng...' : `Đặt hàng ngay - Tổng cộng: $${getTotalPrice()}`}
            </button>
          </div>
        )}

        {/* BƯỚC 3: Đặt hàng thành công */}
        {step === 3 && createdOrder && (
          <div className="text-center py-5">
            <div className="mb-4">
              <span style={{ fontSize: '60px' }}>🎉</span>
            </div>
            <h2 className="fw-bold text-success mb-2" style={{ fontSize: '24px' }}>Đặt hàng thành công!</h2>
            <p className="text-muted px-3" style={{ fontSize: '13px' }}>Cảm ơn bạn đã mua sắm tại Fuzzy. Đơn hàng của bạn đang được chuẩn bị.</p>
            
            <div className="card border-0 bg-light p-3 my-4 mx-2" style={{ borderRadius: '15px' }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted" style={{ fontSize: '12px' }}>Mã đơn hàng:</span>
                <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>{createdOrder.id}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted" style={{ fontSize: '12px' }}>Tổng thanh toán:</span>
                <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>${createdOrder.totalPrice}</span>
              </div>
            </div>

            <div className="d-flex flex-column gap-2 px-3">
              <Link to="/orders" className="btn btn-dark py-3 rounded-pill fw-semibold">Theo dõi đơn hàng</Link>
              <Link to="/shop" className="btn btn-outline-dark py-3 rounded-pill fw-semibold">Tiếp tục mua sắm</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
