import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Coupon = () => {
  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  return (
    <div className="text-start">
      
          
          <header className="section-t-space">
            <div className="custom-container">
              <div className="header-panel">
                <Link to="/checkout">
                  <i className="iconsax back-btn" data-icon="arrow-left"></i>
                </Link>
                <h3>Coupons</h3>
              </div>
            </div>
          </header>
          
      
          
          <section className="section-b-space">
            <div className="custom-container">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="coupon-box">
                    <div className="coupon-discount"><span>60% </span> OFF</div>
                    <div className="coupon-details">
                      <h4 className="fw-semibold theme-color">Google Pay</h4>
                      <p>Buy 1 phone and get 10% off on second phone.</p>
                      <div className="coupon-apply">
                        <h6 className="light-text">#GOOGLE20</h6>
                        <Link to="/checkout" className="apply-btn theme-color fw-semibold">apply</Link>
                      </div>
                    </div>
                    <img className="img-fluid coupon-right" src="/images/subtract.png" alt="subtract" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="coupon-box">
                    <div className="coupon-discount"><span>60% </span> OFF</div>
                    <div className="coupon-details">
                      <h4 className="fw-semibold theme-color">Google Pay</h4>
                      <p>Buy 1 phone and get 10% off on second phone.</p>
                      <div className="coupon-apply">
                        <h6 className="light-text">#GOOGLE20</h6>
                        <Link to="/checkout" className="apply-btn theme-color fw-semibold">apply</Link>
                      </div>
                    </div>
                    <img className="img-fluid coupon-right" src="/images/subtract.png" alt="subtract" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="coupon-box">
                    <div className="coupon-discount"><span>60% </span> OFF</div>
                    <div className="coupon-details">
                      <h4 className="fw-semibold theme-color">Google Pay</h4>
                      <p>Buy 1 phone and get 10% off on second phone.</p>
                      <div className="coupon-apply">
                        <h6 className="light-text">#GOOGLE20</h6>
                        <Link to="/checkout" className="apply-btn theme-color fw-semibold">apply</Link>
                      </div>
                    </div>
                    <img className="img-fluid coupon-right" src="/images/subtract.png" alt="subtract" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="coupon-box">
                    <div className="coupon-discount"><span>60% </span> OFF</div>
                    <div className="coupon-details">
                      <h4 className="fw-semibold theme-color">Google Pay</h4>
                      <p>Buy 1 phone and get 10% off on second phone.</p>
                      <div className="coupon-apply">
                        <h6 className="light-text">#GOOGLE20</h6>
                        <Link to="/checkout" className="apply-btn theme-color fw-semibold">apply</Link>
                      </div>
                    </div>
                    <img className="img-fluid coupon-right" src="/images/subtract.png" alt="subtract" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="coupon-box">
                    <div className="coupon-discount"><span>60% </span> OFF</div>
                    <div className="coupon-details">
                      <h4 className="fw-semibold theme-color">Google Pay</h4>
                      <p>Buy 1 phone and get 10% off on second phone.</p>
                      <div className="coupon-apply">
                        <h6 className="light-text">#GOOGLE20</h6>
                        <Link to="/checkout" className="apply-btn theme-color fw-semibold">apply</Link>
                      </div>
                    </div>
                    <img className="img-fluid coupon-right" src="/images/subtract.png" alt="subtract" />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
      
          
          
      
          
          
      
          
          
        
    </div>
  );
};

export default Coupon;
