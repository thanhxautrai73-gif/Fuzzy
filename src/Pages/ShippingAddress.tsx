import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { apiRequest } from '../utils/api';

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

const ShippingAddress = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');

    if (!user) {
      navigate('/login');
      return;
    }

    fetchAddresses();
  }, [user, navigate]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/addresses');
      setAddresses(data);
      if (data.length > 0) {
        // Tự động chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
        const defaultAddr = data.find((a: Address) => a.isDefault);
        const selectedId = defaultAddr ? defaultAddr.id : data[0].id;
        setSelectedAddrId(selectedId);
        
        // Lưu sẵn vào localStorage phòng trường hợp người dùng ấn Apply ngay
        const activeAddr = data.find((a: Address) => a.id === selectedId);
        if (activeAddr) {
          localStorage.setItem('selected_shipping_address', JSON.stringify(activeAddr));
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách địa chỉ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddrId(addr.id);
    localStorage.setItem('selected_shipping_address', JSON.stringify(addr));
  };

  const handleDeleteAddress = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      await apiRequest(`/addresses?id=${id}`, {
        method: 'DELETE',
      });
      // Tải lại danh sách
      const updatedList = addresses.filter(a => a.id !== id);
      setAddresses(updatedList);
      if (selectedAddrId === id) {
        if (updatedList.length > 0) {
          setSelectedAddrId(updatedList[0].id);
          localStorage.setItem('selected_shipping_address', JSON.stringify(updatedList[0]));
        } else {
          setSelectedAddrId('');
          localStorage.removeItem('selected_shipping_address');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa địa chỉ.');
    }
  };

  return (
    <div className="text-start">
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/cart">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Chi tiết Giao hàng</h3>
          </div>
        </div>
      </header>

      <section className="shipping-details-sec">
        <div className="custom-container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Đang tải địa chỉ...</span>
              </div>
            </div>
          ) : (
            <>
              <ul className="address-list ps-0 mb-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-5 bg-white rounded-3 shadow-sm p-4 text-muted" style={{ borderRadius: '15px' }}>
                    🚩 Bạn chưa có địa chỉ giao hàng nào.
                  </div>
                ) : (
                  addresses.map((addr) => {
                    const isChecked = selectedAddrId === addr.id;
                    return (
                      <li key={addr.id} className="list-unstyled mb-3">
                        <div 
                          className={`shipping-address p-3 bg-white shadow-sm border-0 ${isChecked ? 'border border-dark' : ''}`}
                          style={{ borderRadius: '15px', cursor: 'pointer' }}
                          onClick={() => handleSelectAddress(addr)}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="form-check m-0">
                              <input 
                                className="form-check-input" 
                                type="radio" 
                                name="shippingRadio" 
                                id={`radio-${addr.id}`} 
                                checked={isChecked}
                                onChange={() => handleSelectAddress(addr)}
                              />
                              <label className="form-check-label fw-bold" htmlFor={`radio-${addr.id}`} style={{ cursor: 'pointer' }}>
                                {addr.receiverName} {addr.isDefault && <span className="badge bg-success ms-2" style={{ fontSize: '9px' }}>Mặc định</span>}
                              </label>
                            </div>
                            <div className="options d-flex gap-2">
                              <Link to={`/new-address?id=${addr.id}`}>
                                <i className="iconsax icons text-muted" data-icon="edit-2"></i>
                              </Link>
                              <a href="#!" onClick={(e) => handleDeleteAddress(e, addr.id)}>
                                <i className="iconsax icons text-danger" data-icon="trash"></i>
                              </a>
                            </div>
                          </div>
                          <div className="address-details pt-1 border-top border-light mt-2">
                            <p className="mb-1 text-dark" style={{ fontSize: '13px' }}>
                              {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                            </p>
                            <h5 className="content-number m-0 text-muted" style={{ fontSize: '12px' }}>
                              Phone no. : <span className="text-dark">{addr.receiverPhone}</span>
                            </h5>
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
              <Link to="/new-address" className="btn gray-btn w-100 py-3 rounded-pill fw-semibold">+ Thêm địa chỉ mới</Link>

              <div className="apply-btn mt-4">
                <button 
                  onClick={() => {
                    if (!selectedAddrId) {
                      alert('Vui lòng chọn hoặc thêm địa chỉ nhận hàng.');
                      return;
                    }
                    navigate('/payment');
                  }}
                  className="btn theme-btn w-100 py-3 rounded-pill fw-semibold"
                  disabled={!selectedAddrId}
                >
                  Xác nhận địa chỉ & Tiếp tục thanh toán
                </button>
              </div>
            </>
          )}
        </div>
      </section>
      
      <section className="panel-space"></section>
    </div>
  );
};

export default ShippingAddress;
