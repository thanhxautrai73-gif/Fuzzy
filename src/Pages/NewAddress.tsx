import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NewAddress = () => {
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
                <h3>Add New Address</h3>
              </div>
            </div>
          </header>
          
      
          
          <section className="section-b-space">
            <div className="custom-container">
              <form className="address-form" target="_blank">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <div className="form-input mb-3">
                    <input type="text" className="form-control" placeholder="Enter your name" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="form-input mb-3">
                    <input type="text" className="form-control" placeholder="Enter your number" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <div className="form-input mb-3">
                    <input type="text" className="form-control" placeholder="Enter your address" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Landmark</label>
                  <div className="form-input mb-3">
                    <input type="text" className="form-control" placeholder="Enter your landmark" />
                  </div>
                </div>
      
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <div className="form-input mb-3">
                        <input type="text" className="form-control" placeholder="Enter city" />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Pin Code</label>
                      <div className="form-input mb-3">
                        <input type="text" className="form-control" placeholder="Enter pin" />
                      </div>
                    </div>
                  </div>
      
                  <div className="form-group">
                    <label className="form-label">Address Type</label>
                    <ul className="address-type">
                      <li>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked />
                          <label className="form-check-label" htmlFor="flexRadioDefault1">Home</label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                          <label className="form-check-label" htmlFor="flexRadioDefault2"> Office</label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                          <label className="form-check-label" htmlFor="flexRadioDefault2">Other</label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <section className="panel-space"></section>
                
                <div className="footer-modal d-flex gap-3">
                  <Link to="/shipping-address" className="btn gray-btn btn-inline mt-0 w-50">Cancel</Link>
                  <Link to="/shipping-address" className="theme-btn btn btn-inline mt-0 w-50">Add</Link>
                </div>
              </form>
            </div>
          </section>
          
      
          
          
      
          
          
      
          
          
        
    </div>
  );
};

export default NewAddress;
