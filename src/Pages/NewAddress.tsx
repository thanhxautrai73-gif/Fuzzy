import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useUserStore } from '../store/useUserStore';

const NewAddress = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');

    if (!user) {
      navigate('/login');
      return;
    }

    if (editId) {
      // Tải thông tin địa chỉ cần chỉnh sửa
      apiRequest(`/addresses?id=${editId}`)
        .then((data) => {
          setReceiverName(data.receiverName || '');
          setReceiverPhone(data.receiverPhone || '');
          setProvince(data.province || '');
          setDistrict(data.district || '');
          setWard(data.ward || '');
          setDetailAddress(data.detailAddress || '');
          setIsDefault(!!data.isDefault);
        })
        .catch((err) => console.error('Lỗi khi tải địa chỉ để chỉnh sửa:', err));
    }
  }, [user, editId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!receiverName.trim() || !receiverPhone.trim() || !province.trim() || !district.trim() || !ward.trim() || !detailAddress.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    const payload = {
      receiverName,
      receiverPhone,
      province,
      district,
      ward,
      detailAddress,
      isDefault
    };

    try {
      if (editId) {
        // Cập nhật địa chỉ
        await apiRequest(`/addresses?id=${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        // Tạo địa chỉ mới
        await apiRequest('/addresses', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      navigate('/shipping-address');
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu địa chỉ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-start">
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/shipping-address">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>{editId ? 'Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}</h3>
          </div>
        </div>
      </header>

      <section className="section-b-space">
        <div className="custom-container">
          {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
          <form className="address-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên người nhận *</label>
              <div className="form-input mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nhập tên người nhận" 
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <div className="form-input mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nhập số điện thoại" 
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <div className="form-group">
                  <label className="form-label">Tỉnh / Thành phố *</label>
                  <div className="form-input mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Tỉnh/Thành" 
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label className="form-label">Quận / Huyện *</label>
                  <div className="form-input mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Quận/Huyện" 
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label className="form-label">Phường / Xã *</label>
                  <div className="form-input mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Phường/Xã" 
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Số nhà, tên đường chi tiết *</label>
              <div className="form-input mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ví dụ: 123 Đường Nguyễn Trãi" 
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="addrDefault" 
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                />
                <label className="form-check-label text-dark" htmlFor="addrDefault" style={{ fontSize: '13px', cursor: 'pointer' }}>
                  Đặt làm địa chỉ giao hàng mặc định
                </label>
              </div>
            </div>
            
            <section className="panel-space"></section>
            
            <div className="footer-modal d-flex gap-3">
              <Link to="/shipping-address" className="btn gray-btn btn-inline mt-0 w-50">Hủy</Link>
              <button type="submit" className="theme-btn btn btn-inline mt-0 w-50" disabled={loading}>
                {loading ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default NewAddress;
