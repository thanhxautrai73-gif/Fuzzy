import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Setting = () => {
  const [isDark, setIsDark] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');

    // Khởi tạo trạng thái ban đầu từ localStorage
    const savedLayout = localStorage.getItem('layout_version');
    setIsDark(savedLayout === 'dark');

    const savedDir = localStorage.getItem('dir');
    setIsRtl(savedDir === 'rtl');

    const savedNotif = localStorage.getItem('notification_enabled');
    if (savedNotif !== null) {
      setIsNotificationEnabled(savedNotif === 'true');
    }
  }, []);

  const handleDarkToggle = (checked: boolean) => {
    setIsDark(checked);
    if (checked) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('layout_version', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('layout_version');
    }
  };

  const handleRtlToggle = (checked: boolean) => {
    setIsRtl(checked);
    const htmlDom = document.querySelector('html');
    if (htmlDom) {
      if (checked) {
        htmlDom.setAttribute('dir', 'rtl');
        localStorage.setItem('dir', 'rtl');
      } else {
        htmlDom.setAttribute('dir', 'ltr');
        localStorage.setItem('dir', 'ltr');
      }
    }
  };

  const handleNotificationToggle = (checked: boolean) => {
    setIsNotificationEnabled(checked);
    localStorage.setItem('notification_enabled', checked ? 'true' : 'false');
  };

  return (
    <div className="text-start">
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/profile">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Cài đặt</h3>
          </div>
        </div>
      </header>

      <section className="mt-3">
        <div className="custom-container">
          <ul className="notification-setting ps-0 mb-0">
            {/* Dark/Light Mode */}
            <li className="list-unstyled card border-0 p-3 mb-3 shadow-sm bg-white" style={{ borderRadius: '15px' }}>
              <div className="notification pt-0 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-semibold theme-color m-0" style={{ fontSize: '14px' }}>Chế độ tối (Dark Mode)</h5>
                  <span className="text-muted" style={{ fontSize: '11px' }}>Kích hoạt giao diện tối màu</span>
                </div>
                <div className="form-check form-switch m-0">
                  <input
                    id="dark-switch"
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={isDark}
                    onChange={(e) => handleDarkToggle(e.target.checked)}
                    style={{ width: '45px', height: '24px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </li>

            {/* RTL Layout */}
            <li className="list-unstyled card border-0 p-3 mb-3 shadow-sm bg-white" style={{ borderRadius: '15px' }}>
              <div className="notification d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-semibold theme-color m-0" style={{ fontSize: '14px' }}>Bố cục RTL</h5>
                  <span className="text-muted" style={{ fontSize: '11px' }}>Giao diện đọc từ phải sang trái</span>
                </div>
                <div className="form-check form-switch m-0">
                  <input
                    id="dir-switch"
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={isRtl}
                    onChange={(e) => handleRtlToggle(e.target.checked)}
                    style={{ width: '45px', height: '24px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </li>

            {/* Notifications */}
            <li className="list-unstyled card border-0 p-3 mb-3 shadow-sm bg-white" style={{ borderRadius: '15px' }}>
              <div className="notification pb-0 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-semibold theme-color m-0" style={{ fontSize: '14px' }}>Nhận thông báo</h5>
                  <span className="text-muted" style={{ fontSize: '11px' }}>Cho phép ứng dụng gửi thông báo đẩy</span>
                </div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={isNotificationEnabled}
                    onChange={(e) => handleNotificationToggle(e.target.checked)}
                    style={{ width: '45px', height: '24px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="panel-space"></section>
    </div>
  );
};

export default Setting;
