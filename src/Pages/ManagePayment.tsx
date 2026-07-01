import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManagePayment = () => {
  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  return (
    <div className="text-start pb-5">
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/profile">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Payment Options</h3>
          </div>
        </div>
      </header>

      <section className="payment-method section-lg-b-space">
        <div className="custom-container">
          <h2 className="fw-semibold theme-color" style={{ fontSize: '15px' }}>Your Card</h2>

          <ul className="payment-list section-lg-b-space ps-0 mb-0">
            {/* Mastercard */}
            <li className="cart-add-box payment-card-box gap-0 mt-3 list-unstyled">
              <div className="payment-detail border-bottom-0 w-100 d-flex justify-content-between align-items-center">
                <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="one" style={{ cursor: 'pointer', flexGrow: 1 }}>
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                    <rect width="40" height="24" rx="4" fill="#0A0A0A"/>
                    <circle cx="14" cy="12" r="8" fill="#EB001B"/>
                    <circle cx="26" cy="12" r="8" fill="#F79E1B" fillOpacity="0.8"/>
                  </svg>
                  <span>
                    <span className="fw-medium theme-color card-heading d-block" style={{ fontSize: '14px' }}>Mastercard *** *** 4589</span>
                    <span className="fw-normal card-sub-heading text-muted" style={{ fontSize: '12px' }}>Expires on 16/24</span>
                  </span>
                </label>
                <div className="form-check">
                  <input id="one" className="form-check-input" type="radio" name="flexRadioDefault" defaultChecked />
                </div>
              </div>
            </li>

            {/* Visa */}
            <li className="cart-add-box payment-card-box gap-0 mt-3 list-unstyled">
              <div className="payment-detail border-bottom-0 w-100 d-flex justify-content-between align-items-center">
                <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="two" style={{ cursor: 'pointer', flexGrow: 1 }}>
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                    <rect width="40" height="24" rx="4" fill="#1A1F71"/>
                    <path d="M15.3 7.5l-2.1 9h-2.1l2.1-9h2.1zm8.7 0l-1.8 6.4-.8-4.4c-.1-.7-.7-1.3-1.4-1.3h-2.6v.3c.5.1 1.1.3 1.5.6.3.3.4.7.3 1.1l-1.9 6.7h2.2l3.4-6.4 1.8 6.4h1.9l2.8-9H24zm-14.3 0c-.5.2-.9.5-1.1.9l-2 5.5H8.7l-.5-2.2c-.2-.7-.7-1.1-1.3-1.2h-.9v-.3c1-.2 1.8-.7 2.2-1.3.3-.5.4-1 .3-1.4h2.1zm24.6 0l-1.7 9h2.1l1.7-9h-2.1z" fill="#FFF"/>
                  </svg>
                  <span>
                    <span className="fw-medium theme-color card-heading d-block" style={{ fontSize: '14px' }}>visa *** *** 4589</span>
                    <span className="fw-normal card-sub-heading text-muted" style={{ fontSize: '12px' }}>Expires on 16/24</span>
                  </span>
                </label>
                <div className="form-check">
                  <input id="two" className="form-check-input" type="radio" name="flexRadioDefault" />
                </div>
              </div>
            </li>
          </ul>

          <div className="new-card mt-3">
            <Link to="/new-card" style={{ textDecoration: 'none' }}>
              <h6 className="fw-semibold text-primary" style={{ fontSize: '13px' }}>+Add New Card</h6>
            </Link>
          </div>

          <h2 className="fw-semibold theme-color section-t-space mt-4" style={{ fontSize: '15px' }}>Wallet</h2>
          <div className="payment-list">
            <ul className="cart-add-box payment-card-box gap-0 mt-3 ps-0 mb-0">
              {/* PayPal */}
              <li className="w-100 list-unstyled">
                <div className="payment-detail d-flex justify-content-between align-items-center">
                  <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="three" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                      <rect width="35" height="24" rx="4" fill="#003087" />
                      <path d="M14 6.5h-4.2c-.3 0-.5.2-.6.5L6.5 17c0 .2.1.4.3.4h2l1-4.7.1-.4h2c2 0 3.3-1 3.7-3 .2-.9.1-1.6-.3-2-.5-.5-1.3-.8-2.3-.8zm.3 3c-.2.9-.9.9-1.7.9h-.8l.4-2h.8c.7 0 1.2.1 1.4.3.2.2.3.5.2.8zm5.2-1.7h-3.2c-.2 0-.4.1-.5.3l-1.4 6.7c0 .2.1.3.2.3h1.6l.7-3.3.1-.3h1.4c1.7 0 2.8-.8 3.2-2.5.2-.8.1-1.3-.3-1.7-.4-.3-1.1-.6-1.9-.6zm.3 2.6c-.2.8-.8.8-1.5.8h-.8l.3-1.7h.8c.6 0 1.1.1 1.3.3.1.2.2.4.1.6z" fill="#FFF"/>
                    </svg>
                    <span className="fw-medium theme-color" style={{ fontSize: '14px' }}>Pay Pal</span>
                  </label>
                  <div className="form-check">
                    <input className="form-check-input" id="three" type="radio" name="flexRadioDefault" />
                  </div>
                </div>
              </li>

              {/* Apple Pay */}
              <li className="w-100 list-unstyled">
                <div className="payment-detail d-flex justify-content-between align-items-center">
                  <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="four" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                      <rect width="35" height="24" rx="4" fill="#000000"/>
                      <path d="M10.8 10.3c-.1-1 .7-1.6 1.7-2.1-.5-.7-1.3-1-2.1-1.1-1-.1-1.7.5-2.2.5-.5 0-1.1-.4-1.9-.4-.9 0-1.8.5-2.3 1.3-1 1.7-.3 4.2.7 5.6.5.7 1 1.5 1.8 1.5.8 0 1.1-.5 2.1-.5 1 0 1.3.5 2.1.5.8 0 1.3-.7 1.8-1.5.6-.9.8-1.7.8-1.8-.1 0-1.5-.6-1.5-2.1zm-1.4-4c.4-.5.7-1.2.6-1.9-.6.1-1.4.4-1.8 1-.4.4-.7 1.1-.6 1.8.7.1 1.4-.4 1.8-.9z" fill="#FFFFFF"/>
                      <text x="14" y="16" fill="#FFFFFF" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto" fontSize="7.5" fontWeight="bold">Pay</text>
                    </svg>
                    <span className="fw-medium theme-color" style={{ fontSize: '14px' }}>Apple Pay</span>
                  </label>
                  <div className="form-check">
                    <input className="form-check-input" id="four" type="radio" name="flexRadioDefault" />
                  </div>
                </div>
              </li>

              {/* Google Pay */}
              <li className="w-100 list-unstyled">
                <div className="payment-detail d-flex justify-content-between align-items-center">
                  <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="five" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" style={{ borderRadius: '4px', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                      <rect width="35" height="24" rx="4" fill="#FFFFFF"/>
                      <path d="M10.8 11.4c0-.3 0-.6-.1-.9H8.5v1.7h1.3c-.1.5-.3.9-.7 1.2v1h1.2c.7-.6 1.1-1.6 1.1-2.6v-.4z" fill="#4285F4"/>
                      <path d="M8.5 13.8c.8 0 1.4-.2 1.9-.7l-1.2-1c-.3.2-.7.4-1.2.4-.9 0-1.7-.6-2-1.4H4.8v1c.5 1.1 1.6 1.7 2.7 1.7z" fill="#34A853"/>
                      <path d="M6.5 11.1c-.1-.3-.1-.6-.1-1s0-.7.1-1H4.8a2.9 2.9 0 000 2.1l1.7-.1z" fill="#FBBC05"/>
                      <path d="M8.5 8.2c.8 0 1.4.3 1.9.7l1.1-1.1C10.8 7.2 9.7 6.8 8.5 6.8c-1.1 0-2.2.6-2.7 1.7l1.7 1c.3-.8 1.1-1.3 2-1.3z" fill="#EA4335"/>
                      <text x="13.2" y="15.2" fill="#5F6368" fontFamily="'Outfit', sans-serif" fontSize="9" fontWeight="800">Pay</text>
                    </svg>
                    <span className="fw-medium theme-color" style={{ fontSize: '14px' }}>Google Pay</span>
                  </label>
                  <div className="form-check">
                    <input className="form-check-input" id="five" type="radio" name="flexRadioDefault" />
                  </div>
                </div>
              </li>

              {/* Cash on Delivery */}
              <li className="w-100 list-unstyled">
                <div className="payment-detail border-bottom-0 d-flex justify-content-between align-items-center">
                  <label className="form-label d-flex align-items-center gap-3 mb-0" htmlFor="six" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" style={{ borderRadius: '4px', flexShrink: 0 }}>
                      <rect width="35" height="24" rx="4" fill="#059669"/>
                      <path d="M10 8h15M10 12h15M10 16h15" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="fw-medium theme-color" style={{ fontSize: '14px' }}>Cash on Delivery</span>
                  </label>
                  <div className="form-check">
                    <input className="form-check-input" id="six" type="radio" name="flexRadioDefault" />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Bottom spacer for layout */}
      <div className="panel-space" style={{ height: '70px' }} />
    </div>
  );
};

export default ManagePayment;
