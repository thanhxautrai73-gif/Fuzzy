import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmptyOrderHistory = () => {
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
                <h3>Order History</h3>
              </div>
            </div>
          </header>
          
      
          
          <section className="section-b-space pt-0">
            <div className="custom-container">
              <div className="empty-tab">
                <img className="img-fluid empty-img w-100" src="/images/gif/order.gif" alt="empty-order" />
      
                <h2>No Order Available</h2>
                <h5 className="mt-3">If you haven't made any order yet, do so now for a better life.</h5>
              </div>
            </div>
          </section>
          
      
          
          
      
          
          
      
          
          
        
    </div>
  );
};

export default EmptyOrderHistory;
