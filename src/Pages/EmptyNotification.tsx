import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmptyNotification = () => {
  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  return (
    <div className="text-start">
      
          
          <header className="section-t-space">
            <div className="custom-container">
              <div className="header-panel">
                <Link to="/landing">
                  <i className="iconsax back-btn" data-icon="arrow-left"></i>
                </Link>
                <h3>Notification</h3>
              </div>
            </div>
          </header>
          
      
          
          <section className="section-b-space pt-0">
            <div className="custom-container">
              <div className="empty-tab">
                <img className="img-fluid empty-img w-100" src="/images/gif/notifiction.gif" alt="empty-bell" />
      
                <h2>No Notifications Found!!</h2>
                <h5 className="mt-3">You don’t have new notification right now. If we received anything we will notify you.</h5>
      
                <Link to="/notification" className="btn theme-btn w-100 mt-5" role="button">Refresh</Link>
              </div>
            </div>
          </section>
          
      
          
          
      
          
          
      
          
          
        
    </div>
  );
};

export default EmptyNotification;
