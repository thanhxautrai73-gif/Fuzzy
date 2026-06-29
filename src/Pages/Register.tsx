import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Đồng bộ class trên body và html khi mount/unmount để kích hoạt theme Đăng ký
  useEffect(() => {
    document.body.classList.add('auth-body', 'dark');
    document.documentElement.classList.add('auth-body', 'dark');
    return () => {
      document.body.classList.remove('auth-body', 'dark');
      document.documentElement.classList.remove('auth-body', 'dark');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không đúng định dạng.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có độ dài ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, phone }),
      });
      // Thông báo đăng ký thành công và điều hướng về trang đăng nhập
      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra trong quá trình đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-start d-flex flex-column align-items-center justify-content-center w-100" style={{ minHeight: '100vh' }}>
      <div className="auth-img">
        <img className="img-fluid auth-bg" src="/images/auth_bg.jpg" alt="auth_bg" />
        <div className="auth-content">
          <div>
            <h2>Tạo tài khoản mới!</h2>
            <h4 className="p-0">Trải nghiệm mua sắm Fuzzy cực kì tiện lợi.</h4>
          </div>
        </div>
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="custom-container">
          {error && (
            <div className="alert alert-danger py-2 mb-3" role="alert" style={{ fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div className="form-group mb-3">
            <label className="form-label">Họ tên *</label>
            <div className="form-input">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nhập họ và tên của bạn" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <i className="iconsax icons" data-icon="user" />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Địa chỉ Email *</label>
            <div className="form-input">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Nhập địa chỉ email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="iconsax icons" data-icon="mail" />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Số điện thoại</label>
            <div className="form-input">
              <input 
                type="tel" 
                className="form-control" 
                placeholder="Nhập số điện thoại" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <i className="iconsax icons" data-icon="mobile" />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Mật khẩu *</label>
            <div className="form-input position-relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                placeholder="Mật khẩu tối thiểu 6 ký tự" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i 
                className="iconsax icons position-absolute" 
                data-icon={showPassword ? "eye" : "eye-slash"} 
                style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 10 }}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Xác nhận mật khẩu *</label>
            <div className="form-input">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                placeholder="Nhập lại mật khẩu" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="submit-btn mb-4">
            <button type="submit" className="btn auth-btn w-100" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
            </button>
          </div>

          <h4 className="signup text-center">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </h4>
        </div>
      </form>
    </div>
  );
};

export default Register;
