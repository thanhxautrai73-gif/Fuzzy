import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { Package, Heart, Wallet, MapPin, Globe, Settings, LogOut, Edit } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const isAdmin = user?.email === 'admin@gmail.com';

  return (
    <div className="text-start pb-5">
      {/* Centered Profile Header */}
      <header className="section-t-space mb-4 py-2 border-bottom">
        <div className="custom-container text-center">
          <h2 className="fw-bold mb-0 text-dark" style={{ fontSize: '18px' }}>Profile</h2>
        </div>
      </header>

      <div className="custom-container">
        {/* User Card Area */}
        <section className="profile-header mb-4">
          <div className="d-flex align-items-center justify-content-between bg-light p-3" style={{ borderRadius: '16px' }}>
            <div className="d-flex align-items-center gap-3">
              <div 
                className="profile-pic border border-2 border-white shadow-sm" 
                style={{ width: '60px', height: '60px', borderRadius: '14px', overflow: 'hidden', padding: 0, marginTop: 0 }}
              >
                <img 
                  className="w-100 h-100 object-cover" 
                  src={user?.avatar || "/images/profile.png"} 
                  alt="avatar" 
                  onError={(e) => { e.currentTarget.src = '/images/profile.png' }} 
                />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: '16px' }}>{user?.name || "Khách"}</h3>
                {user?.email && <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{user.email}</p>}
              </div>
            </div>
            <Link 
              to="/profile-setting" 
              className="edit-icon btn btn-white p-2 d-flex align-items-center justify-content-center shadow-sm" 
              style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ffffff', border: 'none' }}
              title="Chỉnh sửa hồ sơ"
            >
              <Edit size={16} style={{ color: '#16171d' }} />
            </Link>
          </div>
        </section>

        {/* Menu Lists */}
        <section>
          <ul className="profile-list list-unstyled ps-0 mb-0">
            {/* Orders */}
            <li className="border-bottom py-3">
              <Link to="/orders" className="profile-box text-decoration-none">
                <div className="profile-img">
                  <Package className="icon text-dark" size={22} />
                </div>
                <div className="profile-details">
                  <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '14px' }}>Orders</h4>
                  <h5 className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>Ongoing orders, Recent orders..</h5>
                </div>
              </Link>
            </li>

            {/* Wishlist */}
            <li className="border-bottom py-3">
              <Link to="/wishlist" className="profile-box text-decoration-none">
                <div className="profile-img">
                  <Heart className="icon text-dark" size={22} />
                </div>
                <div className="profile-details">
                  <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '14px' }}>Wishlist</h4>
                  <h5 className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>Your save product</h5>
                </div>
              </Link>
            </li>

            {/* Payment */}
            <li className="border-bottom py-3">
              <Link to="/manage-payment" className="profile-box text-decoration-none">
                <div className="profile-img">
                  <Wallet className="icon text-dark" size={22} />
                </div>
                <div className="profile-details">
                  <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '14px' }}>Payment</h4>
                  <h5 className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>Saved card, Wallets</h5>
                </div>
              </Link>
            </li>

            {/* Address */}
            <li className="border-bottom py-3">
              <Link to="/manage-address" className="profile-box text-decoration-none">
                <div className="profile-img">
                  <MapPin className="icon text-dark" size={22} />
                </div>
                <div className="profile-details">
                  <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '14px' }}>Saved Address</h4>
                  <h5 className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>Home, Office</h5>
                </div>
              </Link>
            </li>

            {/* Language */}
            <li className="border-bottom py-3">
              <Link to="/language" className="profile-box text-decoration-none">
                <div className="profile-img">
                  <Globe className="icon text-dark" size={22} />
                </div>
                <div className="profile-details">
                  <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '14px' }}>Language</h4>
                  <h5 className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>Select your language here</h5>
                </div>
              </Link>
            </li>

            {/* Settings */}
            <li className="border-bottom py-3">
              <Link to="/setting" className="profile-box text-decoration-none">
                <div className="profile-img">
                  <Settings className="icon text-dark" size={22} />
                </div>
                <div className="profile-details">
                  <h4 className="fw-semibold m-0 text-dark" style={{ fontSize: '14px' }}>Settings</h4>
                  <h5 className="text-muted m-0 mt-1" style={{ fontSize: '12px' }}>Dark mode, notifications and preferences</h5>
                </div>
              </Link>
            </li>

            {/* Admin (if applicable) */}
            {isAdmin && (
              <li className="border-bottom py-3">
                <Link to="/admin" className="profile-box text-decoration-none">
                  <div className="profile-img" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                    <Settings className="icon text-danger" size={22} />
                  </div>
                  <div className="profile-details">
                    <h4 className="fw-bold m-0 text-danger" style={{ fontSize: '14px' }}>Trang Quản Trị (Admin)</h4>
                    <h5 className="text-danger m-0 mt-1" style={{ fontSize: '12px' }}>Quản lý đơn hàng, người dùng, hệ thống</h5>
                  </div>
                </Link>
              </li>
            )}

            {/* Logout */}
            <li className="py-3">
              <a 
                href="#!" 
                onClick={(e) => { e.preventDefault(); logout(); navigate('/login'); }} 
                className="profile-box text-decoration-none"
              >
                <div className="profile-img" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                  <LogOut className="icon text-danger" size={22} />
                </div>
                <div className="profile-details">
                  <h4 className="fw-semibold m-0 text-danger" style={{ fontSize: '14px' }}>Đăng xuất</h4>
                  <h5 className="text-danger m-0 mt-1" style={{ fontSize: '12px' }}>Rời khỏi tài khoản của bạn</h5>
                </div>
              </a>
            </li>
          </ul>
        </section>
      </div>

      {/* Bottom spacer for navigations */}
      <div className="panel-space" style={{ height: '70px' }} />
    </div>
  );
};

export default Profile;
