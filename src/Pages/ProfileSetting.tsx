import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { apiRequest } from '../utils/api';

const ProfileSetting = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('/images/profile.png');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');

    if (!user) {
      navigate('/login');
      return;
    }

    setName(user.name || '');
    setPhone(user.phone || '');
    setAvatar(user.avatar || '/images/profile.png');
  }, [user, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Họ và tên không được để trống.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          phone,
          avatar,
        }),
      });
      // Cập nhật thông tin trong store toàn cục
      updateUser(res.user);
      setSuccessMsg('Cập nhật hồ sơ thành công!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi cập nhật thông tin hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-start">
      <header className="profile-header section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/profile">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Chỉnh sửa hồ sơ</h3>
          </div>
          <div className="profile-setting-pic mx-auto" style={{ width: '90px', height: '90px', overflow: 'hidden', borderRadius: '50%' }}>
            <img 
              className="img-fluid img w-100 h-100 object-cover" 
              src={avatar} 
              alt="profile" 
              onError={(e) => { e.currentTarget.src = '/images/profile.png' }}
            />
          </div>
        </div>
      </header>

      <div className="custom-container mt-4">
        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}
      </div>

      <form className="theme-form profile-setting mt-3" onSubmit={handleSave}>
        <div className="custom-container">
          <div className="form-group d-block">
            <label htmlFor="inputname" className="form-label">Họ và tên *</label>
            <div className="form-input mb-4">
              <input 
                type="text" 
                className="form-control" 
                id="inputname" 
                placeholder="Nhập họ và tên" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
              />
              <i className="iconsax icons" data-icon="user-1"></i>
            </div>
          </div>

          <div className="form-group d-block">
            <label htmlFor="inputuseremail" className="form-label">Địa chỉ Email (Chỉ xem)</label>
            <div className="form-input mb-4">
              <input 
                type="email" 
                className="form-control bg-light" 
                id="inputuseremail" 
                value={user?.email || ''} 
                readOnly 
                disabled
              />
              <i className="iconsax icons" data-icon="mail"></i>
            </div>
          </div>

          <div className="form-group d-block">
            <label htmlFor="inputusernumber" className="form-label">Số điện thoại</label>
            <div className="form-input mb-4">
              <input 
                type="text" 
                className="form-control" 
                id="inputusernumber" 
                placeholder="Nhập số điện thoại" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
              <i className="iconsax icons" data-icon="phone"></i>
            </div>
          </div>

          <div className="form-group d-block">
            <label htmlFor="inputuseravatar" className="form-label">Đường dẫn ảnh đại diện (URL)</label>
            <div className="form-input mb-4">
              <input 
                type="text" 
                className="form-control" 
                id="inputuseravatar" 
                placeholder="Đường dẫn ảnh đại diện" 
                value={avatar} 
                onChange={(e) => setAvatar(e.target.value)} 
              />
              <i className="iconsax icons" data-icon="image"></i>
            </div>
          </div>

          <div className="footer-modal d-flex gap-3 mt-4">
            <Link to="/profile" className="btn gray-btn btn-inline mt-0 w-50">Hủy bỏ</Link>
            <button type="submit" className="theme-btn btn btn-inline mt-0 w-50" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </div>
      </form>

      <section className="panel-space"></section>
    </div>
  );
};

export default ProfileSetting;
