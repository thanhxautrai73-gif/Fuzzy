import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Landing from './Pages/Landing';
import ProductDetail from './Pages/ProductDetail';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import OrderTracking from './Pages/OrderTracking';
import Profile from './Pages/Profile';
import AdminDashboard from './Pages/AdminDashboard';
import { useCartStore } from './store/useCartStore';

// Import các trang mới được chuyển đổi từ HTML
import Categories from './Pages/Categories';
import Coupon from './Pages/Coupon';
import EmptyCart from './Pages/EmptyCart';
import EmptyNotification from './Pages/EmptyNotification';
import EmptyOrderHistory from './Pages/EmptyOrderHistory';
import EmptySearch from './Pages/EmptySearch';
import EmptyWishlist from './Pages/EmptyWishlist';
import ForgotPassword from './Pages/ForgotPassword';
import Help from './Pages/Help';
import Language from './Pages/Language';
import ManageAddress from './Pages/ManageAddress';
import ManageDeliveryAddress from './Pages/ManageDeliveryAddress';
import ManagePayment from './Pages/ManagePayment';
import NewAddress from './Pages/NewAddress';
import NewCard from './Pages/NewCard';
import Notification from './Pages/Notification';
import OrderDetails from './Pages/OrderDetails';
import OrderHistory from './Pages/OrderHistory';
import OtherSetting from './Pages/OtherSetting';
import Otp from './Pages/Otp';
import Payment from './Pages/Payment';
import ProfileSetting from './Pages/ProfileSetting';
import ResetPassword from './Pages/ResetPassword';
import Search from './Pages/Search';
import Setting from './Pages/Setting';
import ShippingAddress from './Pages/ShippingAddress';
import Shipping from './Pages/Shipping';
import TermsConditions from './Pages/TermsConditions';
import Voucher from './Pages/Voucher';
import Wishlist from './Pages/Wishlist';

// Quản lý theme (gắn class dark/light vào body và html) theo tuyến đường (routes)
const ThemeManager = () => {
  const location = useLocation();

  useEffect(() => {
    const darkPaths = ['/', '/login', '/register'];
    const isGlobalDark = localStorage.getItem('layout_version') === 'dark';

    if (darkPaths.includes(location.pathname)) {
      document.body.classList.add('auth-body', 'dark');
      document.documentElement.classList.add('auth-body', 'dark');
    } else {
      document.body.classList.remove('auth-body');
      document.documentElement.classList.remove('auth-body');
      
      if (isGlobalDark) {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
      }
    }
  }, [location.pathname]);

  return null;
};

// Component Bottom Navigation quản lý trạng thái chính xác theo vị trí URL
const BottomNav = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Ẩn thanh bottom navbar trên các trang Onboarding, Đăng nhập, Đăng ký, Thanh toán, Admin và Chi tiết sản phẩm
  const hideOnPaths = ['/', '/login', '/register', '/checkout', '/admin'];
  if (hideOnPaths.includes(location.pathname) || location.pathname.startsWith('/product/')) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="navbar-menu border-top bg-white py-2" style={{ zIndex: 90 }}>
      <ul>
        {/* 1. Trang chủ / Shop */}
        <li className={isActive('/shop') || isActive('/landing') ? 'active' : ''}>
          <Link to="/shop">
            <div className="icon">
              <img className="unactive" src="/images/home.svg" alt="home" />
              <img className="active" src="/images/home-fill.svg" alt="home" />
            </div>
          </Link>
        </li>
        {/* 2. Danh mục */}
        <li className={isActive('/categories') ? 'active' : ''}>
          <Link to="/categories">
            <div className="icon">
              <img className="unactive" src="/images/categories.svg" alt="categories" />
              <img className="active" src="/images/categories-fill.svg" alt="categories" />
            </div>
          </Link>
        </li>
        {/* 3. Giỏ hàng */}
        <li className={isActive('/cart') ? 'active' : ''}>
          <Link to="/cart" className="position-relative">
            <div className="icon">
              <img className="unactive" src="/images/bag.svg" alt="bag" />
              <img className="active" src="/images/bag-fill.svg" alt="bag" />
              {totalCartQty > 0 && (
                <span 
                  className="position-absolute translate-middle badge rounded-circle bg-danger text-white border border-light" 
                  style={{ top: '5px', right: '-8px', fontSize: '9px', padding: '3px 6px', zIndex: 10 }}
                >
                  {totalCartQty}
                </span>
              )}
            </div>
          </Link>
        </li>
        {/* 4. Yêu thích (Wishlist) */}
        <li className={isActive('/wishlist') ? 'active' : ''}>
          <Link to="/wishlist">
            <div className="icon">
              <img className="unactive" src="/images/heart.svg" alt="wishlist" />
              <img className="active" src="/images/heart-fill.svg" alt="wishlist" />
            </div>
          </Link>
        </li>
        {/* 5. Hồ sơ */}
        <li className={isActive('/profile') ? 'active' : ''}>
          <Link to="/profile">
            <div className="icon">
              <img className="unactive" src="/images/profile.svg" alt="profile" />
              <img className="active" src="/images/profile-fill.svg" alt="profile" />
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeManager />
      {/* Full screen layout */}
      <div className="min-vh-100 d-flex flex-column w-100">
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-account" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Các tuyến đường trang mới */}
            <Route path="/categories" element={<Categories />} />
            <Route path="/coupon" element={<Coupon />} />
            <Route path="/empty-cart" element={<EmptyCart />} />
            <Route path="/empty-notification" element={<EmptyNotification />} />
            <Route path="/empty-order-history" element={<EmptyOrderHistory />} />
            <Route path="/empty-search" element={<EmptySearch />} />
            <Route path="/empty-wishlist" element={<EmptyWishlist />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/help" element={<Help />} />
            <Route path="/language" element={<Language />} />
            <Route path="/manage-address" element={<ManageAddress />} />
            <Route path="/manage-delivery-address" element={<ManageDeliveryAddress />} />
            <Route path="/manage-payment" element={<ManagePayment />} />
            <Route path="/new-address" element={<NewAddress />} />
            <Route path="/new-card" element={<NewCard />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/order-details" element={<OrderDetails />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/other-setting" element={<OtherSetting />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile-setting" element={<ProfileSetting />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/search" element={<Search />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/shipping-address" element={<ShippingAddress />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/voucher" element={<Voucher />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
