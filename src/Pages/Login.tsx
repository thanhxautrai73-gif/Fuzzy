import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useUserStore } from '../store/useUserStore';

const Login = () => {
  const navigate = useNavigate();
  const loginUser = useUserStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Đồng bộ class trên body và html khi mount/unmount để kích hoạt theme Đăng nhập
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

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // Lưu thông tin đăng nhập vào Zustand store
      loginUser(res.user, res.token);
      navigate('/shop');
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockOAuth = (provider: 'Google' | 'Facebook') => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const mockUser = {
        id: 'oauth-user-id-999',
        email: `social.${provider.toLowerCase()}@example.com`,
        name: `User ${provider} OAuth`,
        phone: '0987654321',
        dateOfBirth: '2000-01-01',
        avatar: '/images/profile.png',
      };
      const mockToken = 'mock-oauth-jwt-token-string-xyz-12345';
      loginUser(mockUser, mockToken);
      setLoading(false);
      navigate('/shop');
    }, 1000);
  };

  return (
    <div className="auth-body text-start d-flex flex-column align-items-center justify-content-center w-100" style={{ minHeight: '100vh' }}>
      {/* login section start */}
      <div className="auth-img">
        <img className="img-fluid auth-bg" src="/images/auth_bg.jpg" alt="auth_bg" />
        <div className="auth-content">
          <div>
            <h2>Hello Again!</h2>
            <h4 className="p-0">Welcome back, You have been missed!</h4>
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

          <div className="form-group">
            <label htmlFor="inputusername" className="form-label">Email / Username</label>
            <div className="form-input mb-4">
              <input 
                type="text" 
                className="form-control" 
                id="inputusername" 
                placeholder="Enter Your Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="iconsax icons" data-icon="mail"></i>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <div className="form-input mb-4 position-relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                id="inputPassword" 
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="iconsax icons" data-icon="key"></i>
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 10, color: '#6b6375', fontSize: '18px' }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
          </div>

          <div className="option mt-3 d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">Remember me</label>
            </div>
            <a className="forgot" href="#!">Forgot password?</a>
          </div>

          <div className="submit-btn mb-4">
            <button type="submit" className="btn auth-btn w-100" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          
          <div className="division text-center my-3">
            <span>OR</span>
          </div>

          <ul className="social-media d-flex justify-content-center gap-3 p-0 mb-4" style={{ listStyle: 'none' }}>
            <li>
              <a href="#!" onClick={() => handleMockOAuth('Facebook')}>
                <img className="img-fluid icons" src="/images/facebook.svg" alt="facebook" style={{ width: '32px' }} />
              </a>
            </li>
            <li>
              <a href="#!" onClick={() => handleMockOAuth('Google')}>
                <img className="img-fluid icons" src="/images/google.svg" alt="google" style={{ width: '32px' }} />
              </a>
            </li>
            <li>
              <a href="#!" onClick={() => handleMockOAuth('Google')}>
                <img className="img-fluid icons" src="/images/apple.svg" alt="apple" style={{ width: '32px' }} />
              </a>
            </li>
          </ul>

          <h4 className="signup text-center" style={{ fontSize: '14px' }}>
            Don’t have an account ? <Link to="/register">Sign up</Link>
          </h4>
        </div>
      </form>
      {/* login section end*/}
    </div>
  );
};

export default Login;