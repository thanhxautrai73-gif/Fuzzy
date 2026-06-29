import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfileSetting = () => {
  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  return (
    <div className="text-start">
      
          
          <header className="profile-header section-t-space">
            <div className="custom-container">
              <div className="header-panel">
                <Link to="/categories">
                  <i className="iconsax back-btn" data-icon="arrow-left"></i>
                </Link>
                <h3>Profile</h3>
              </div>
              <div className="profile-setting-pic mx-auto">
                <img className="img-fluid img" src="/images/icons/profile1.png" alt="profile" />
              </div>
            </div>
          </header>
          
      
          
          <form className="theme-form profile-setting mt-5" target="_blank">
            <div className="custom-container">
              <div className="form-group d-block">
                <label htmlFor="inputname" className="form-label">Name</label>
                <div className="form-input mb-4">
                  <input type="text" className="form-control" id="inputname" defaultValue="Marlin Watkin" />
                  <i className="iconsax icons" data-icon="user-1"></i>
                </div>
              </div>
      
              <div className="form-group d-block">
                <label htmlFor="inputuseremail" className="form-label">Email id</label>
                <div className="form-input mb-4">
                  <input type="email" className="form-control" id="inputuseremail" defaultValue="marlinw25@gmail.com" />
                  <i className="iconsax icons" data-icon="mail"></i>
                </div>
              </div>
      
              <div className="form-group d-block">
                <label htmlFor="inputusernumber" className="form-label">Phone Number</label>
                <div className="form-input">
                  <input type="text" className="form-control" id="inputusernumber" defaultValue="+4498456215" />
                  <i className="iconsax icons" data-icon="phone"></i>
                </div>
              </div>
              <div className="footer-modal d-flex gap-3">
                <Link to="/profile" className="btn gray-btn btn-inline mt-0 w-50">Cancel</Link>
                <Link to="/profile" className="theme-btn btn btn-inline mt-0 w-50">Save</Link>
              </div>
            </div>
          </form>
          
      
          
          <section className="panel-space"></section>
          
      
          
          
      
          
          
      
          
          
        
    </div>
  );
};

export default ProfileSetting;
