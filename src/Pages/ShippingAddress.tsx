import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShippingAddress = () => {
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
                <h3>Shipping Details</h3>
              </div>
            </div>
          </header>
          
      
          
          <section className="shipping-details-sec">
            <div className="custom-container">
              <ul className="address-list">
                <li>
                  <div className="shipping-address">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadio1" id="radio1" checked />
                        <label className="form-check-label" htmlFor="radio1">Home</label>
                      </div>
                      <div className="options">
                        <Link to="/new-address">
                          <i className="iconsax icons" data-icon="edit-2"></i>
                        </Link>
                        <Link to="#">
                          <i className="iconsax icons" data-icon="trash"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="address-details">
                      <p>3501 Maloy Court, East Emhurst, New York City, NY 11369</p>
                      <h5 className="content-number">Phone no. : <span> 78596 0000</span></h5>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="shipping-address">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadio1" id="radio2" />
                        <label className="form-check-label" htmlFor="radio2">Office</label>
                      </div>
                      <div className="options">
                        <Link to="/new-address">
                          <i className="iconsax icons" data-icon="edit-2"></i>
                        </Link>
                        <Link to="#">
                          <i className="iconsax icons" data-icon="trash"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="address-details">
                      <p>8502-8503 Preston Rd. Inglewood Street, Maine 98380</p>
                      <h5 className="content-number">Phone no. : <span> 12100 0023</span></h5>
                    </div>
                  </div>
                </li>
              </ul>
              <Link to="/new-address" className="btn gray-btn w-100">+ Add New Address</Link>
      
              <div className="apply-btn">
                <Link to="/payment" className="btn theme-btn w-100">apply</Link>
              </div>
            </div>
          </section>
          
      
          
          <section className="panel-space"></section>
          
      
          
          
      
          
          
      
          
          
        
    </div>
  );
};

export default ShippingAddress;
