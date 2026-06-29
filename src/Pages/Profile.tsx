import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
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

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUserStore();
  
  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'images/profile.png');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form state
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = () => {
    apiRequest('/addresses')
      .then((data) => setAddresses(data))
      .catch((err) => console.error('Lỗi tải danh sách địa chỉ:', err));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setSavingProfile(true);

    try {
      const res = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone, dateOfBirth, avatar }),
      });
      updateUser(res.user);
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin hồ sơ thành công!' });
    } catch (err: any) {
      setProfileMsg({ type: 'danger', text: err.message || 'Lỗi cập nhật hồ sơ.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');

    if (!receiverName || !receiverPhone || !province || !district || !ward || !detailAddress) {
      setAddressError('Vui lòng nhập đầy đủ các trường thông tin.');
      return;
    }

    const payload = { receiverName, receiverPhone, province, district, ward, detailAddress, isDefault };

    try {
      if (editingAddressId) {
        // Cập nhật địa chỉ
        await apiRequest(`/addresses?id=${editingAddressId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        // Thêm địa chỉ mới
        await apiRequest('/addresses', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      resetAddressForm();
      fetchAddresses();
    } catch (err: any) {
      setAddressError(err.message || 'Lỗi lưu địa chỉ.');
    }
  };

  const handleEditAddressClick = (addr: Address) => {
    setEditingAddressId(addr.id);
    setReceiverName(addr.receiverName);
    setReceiverPhone(addr.receiverPhone);
    setProvince(addr.province);
    setDistrict(addr.district);
    setWard(addr.ward);
    setDetailAddress(addr.detailAddress);
    setIsDefault(addr.isDefault);
    setShowAddForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await apiRequest(`/addresses?id=${id}`, {
        method: 'DELETE',
      });
      fetchAddresses();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa địa chỉ.');
    }
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setReceiverName('');
    setReceiverPhone('');
    setProvince('');
    setDistrict('');
    setWard('');
    setDetailAddress('');
    setIsDefault(false);
    setShowAddForm(false);
    setAddressError('');
  };

  return (
    <div className="text-start pb-5">
      {/* Header */}
      <div className="custom-container section-t-space mb-4 d-flex justify-content-between align-items-center">
        <h2 className="fw-semibold">Tài khoản & Hồ sơ</h2>
        <button 
          onClick={() => { logout(); navigate('/login'); }} 
          className="btn btn-outline-danger btn-sm rounded-pill px-3"
        >
          Đăng xuất
        </button>
      </div>

      <div className="custom-container">
        {/* Profile Card */}
        <div className="card border-0 shadow-sm p-3 mb-4 bg-white" style={{ borderRadius: '15px' }}>
          <form onSubmit={handleUpdateProfile}>
            <div className="text-center mb-3">
              <img 
                src={avatar} 
                className="rounded-circle shadow-sm" 
                alt="Avatar" 
                style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
              />
              <div className="mt-2">
                <input 
                  type="text" 
                  className="form-control form-control-sm text-center border-0 bg-light"
                  placeholder="Đường dẫn ảnh Avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  style={{ maxWidth: '200px', margin: '0 auto', fontSize: '12px' }}
                />
              </div>
            </div>

            {profileMsg.text && (
              <div className={`alert alert-${profileMsg.type} py-2 mb-3`} style={{ fontSize: '13px' }}>
                {profileMsg.text}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-muted" style={{ fontSize: '12px' }}>Email (Không thể thay đổi)</label>
              <input type="text" className="form-control bg-light" value={user?.email || ''} readOnly />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted" style={{ fontSize: '12px' }}>Họ và tên</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted" style={{ fontSize: '12px' }}>Số điện thoại</label>
              <input 
                type="tel" 
                className="form-control" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted" style={{ fontSize: '12px' }}>Ngày sinh</label>
              <input 
                type="date" 
                className="form-control" 
                value={dateOfBirth} 
                onChange={(e) => setDateOfBirth(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 mt-2 rounded-pill" disabled={savingProfile}>
              {savingProfile ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </button>
          </form>
        </div>

        {/* Address Book */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-semibold m-0" style={{ fontSize: '18px' }}>Sổ địa chỉ</h3>
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)} 
              className="btn btn-dark btn-sm rounded-pill px-3"
            >
              + Thêm địa chỉ
            </button>
          )}
        </div>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <div className="card border-0 shadow-sm p-3 mb-4 bg-light" style={{ borderRadius: '15px' }}>
            <h4 className="fw-semibold mb-3">{editingAddressId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h4>
            {addressError && <div className="alert alert-danger py-2">{addressError}</div>}
            
            <form onSubmit={handleSaveAddress}>
              <div className="row g-2">
                <div className="col-6 mb-2">
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Tên người nhận *" 
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6 mb-2">
                  <input 
                    type="tel" 
                    className="form-control form-control-sm" 
                    placeholder="Số điện thoại *" 
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="col-4 mb-2">
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Tỉnh/Thành phố *" 
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                  />
                </div>
                <div className="col-4 mb-2">
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Quận/Huyện *" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  />
                </div>
                <div className="col-4 mb-2">
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Phường/Xã *" 
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 mb-2">
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Số nhà, tên đường chi tiết *" 
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="addrDefault" 
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="addrDefault" style={{ fontSize: '13px' }}>Đặt làm địa chỉ mặc định</label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-dark btn-sm w-50 py-2 rounded-pill">Lưu lại</button>
                <button type="button" onClick={resetAddressForm} className="btn btn-outline-secondary btn-sm w-50 py-2 rounded-pill">Hủy</button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        <div className="d-flex flex-column gap-3">
          {addresses.length === 0 ? (
            <p className="text-muted text-center py-3 bg-white rounded-3 shadow-sm p-3">Chưa có địa chỉ nào trong sổ địa chỉ.</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '15px' }}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '15px' }}>{addr.receiverName}</h4>
                      {addr.isDefault && (
                        <span className="badge bg-success" style={{ fontSize: '10px' }}>Mặc định</span>
                      )}
                    </div>
                    <p className="text-muted m-0 mt-1" style={{ fontSize: '13px' }}>SĐT: {addr.receiverPhone}</p>
                    <p className="text-dark m-0 mt-1" style={{ fontSize: '13px' }}>
                      {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => handleEditAddressClick(addr)} 
                      className="btn btn-sm btn-outline-dark border-0 p-1"
                      title="Sửa"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteAddress(addr.id)} 
                      className="btn btn-sm btn-outline-danger border-0 p-1"
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="panel-space" style={{ height: '70px' }} />
    </div>
  );
};

export default Profile;
