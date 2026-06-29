import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  return (
    <div className="text-start">
      
          
          <header className="section-t-space">
            <div className="custom-container">
              <div className="header-panel">
                <Link to="/profile">
                  <i className="iconsax back-btn" data-icon="arrow-left"></i>
                </Link>
                <h3>Order History</h3>
              </div>
            </div>
          </header>
          
      
          
          <section>
            <div className="custom-container">
              <form className="theme-form search-head" target="_blank">
                <div className="form-group">
                  <div className="form-input w-100">
                    <input type="text" className="form-control search" id="inputusername" placeholder="Search here..." />
                    <i className="iconsax search-icon" data-icon="search-normal-2"></i>
                  </div>
                </div>
              </form>
            </div>
          </section>
          
      
          
          <section className="section-t-space">
            <div className="custom-container">
              <div className="row g-3">
                <div className="col-12">
                  <div className="order-product-box">
                    <div className="horizontal-product-box">
                      <Link to="#" className="horizontal-product-img">
                        <img className="img-fluid img" src="/images/product/3.png" alt="p3" />
                      </Link>
                      <div className="horizontal-product-details">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <h4>Wingback Chair</h4>
      
                          <h6 className="product-status">Ongoing</h6>
                        </div>
                        <h5>Qty:1</h5>
                        <h5 className="view-details">View Details</h5>
                      </div>
                    </div>
                    <div className="order-details d-block">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="theme-color">Order : <span className="light-text">26 Jan’23</span></h5>
                        <h5>Dispatched</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="order-product-box">
                    <div className="horizontal-product-box">
                      <Link to="#" className="horizontal-product-img">
                        <img className="img-fluid img" src="/images/product/6.png" alt="p6" />
                      </Link>
                      <div className="horizontal-product-details">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <h4>Table Lamp</h4>
                          <h6 className="product-status">Ongoing</h6>
                        </div>
                        <h5>Qty:1</h5>
                        <h5 className="view-details">View Details</h5>
                      </div>
                    </div>
                    <div className="order-details d-block">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="theme-color">Order : <span className="light-text">26 Jan’23</span></h5>
                        <h5>Dispatched</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="order-product-box">
                    <div className="horizontal-product-box">
                      <Link to="#" className="horizontal-product-img">
                        <img className="img-fluid img" src="/images/product/7.png" alt="p7" />
                      </Link>
                      <div className="horizontal-product-details">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <h4>Side Table</h4>
                          <h6 className="product-status delivered">Delivered</h6>
                        </div>
                        <h5>Qty:1</h5>
                        <h5 className="view-details">View Details</h5>
                      </div>
                    </div>
                    <div className="order-details d-block">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="theme-color">Order : <span className="light-text">26 Jan’23</span></h5>
                        <h5>Dispatched</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
      
          
          
      
          
          
      
          
          
        
    </div>
  );
};

export default OrderHistory;
