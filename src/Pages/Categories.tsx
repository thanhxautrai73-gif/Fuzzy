import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  return (
    <div className="text-start">
      
          
          <header className="section-t-space">
            <div className="custom-container">
              <div className="header-panel">
                <h3>Categories</h3>
                <Link to="/notification" className="notification"> <i className="iconsax notification-icon" data-icon="bell-2"></i> </Link>
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
          
      
          
          <section>
            <div className="custom-container">
              <ul className="categories-list">
                <li className="mt-0">
                  <Link to="/shop" className="d-flex align-items-center">
                    <div className="ps-3">
                      <h2>Chairs</h2>
                      <h4 className="mt-1">Total 120 item available</h4>
                      <div className="arrow">
                        <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                      </div>
                    </div>
                    <div className="categories-img">
                      <img className="img-fluid img" src="/images/product/3.png" alt="p3" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="d-flex align-items-center">
                    <div className="ps-3">
                      <h2>Tables</h2>
                      <h4 className="mt-1">Total 120 item available</h4>
                      <div className="arrow">
                        <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                      </div>
                    </div>
                    <div className="categories-img">
                      <img className="img-fluid categories img" src="/images/product/21.png" alt="p21" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="d-flex align-items-center">
                    <div className="ps-3">
                      <h2>Sofas</h2>
                      <h4 className="mt-1">Total 120 item available</h4>
                      <div className="arrow">
                        <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                      </div>
                    </div>
                    <div className="categories-img">
                      <img className="img-fluid categories img" src="/images/product/11.png" alt="p11" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="d-flex align-items-center">
                    <div className="ps-3">
                      <h2>Hanging chairs</h2>
                      <h4 className="mt-1">Total 120 item available</h4>
                      <div className="arrow">
                        <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                      </div>
                    </div>
                    <div className="categories-img">
                      <img className="img-fluid categories img" src="/images/product/22.png" alt="p22" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="d-flex align-items-center">
                    <div className="ps-3">
                      <h2>Cabinets</h2>
                      <h4 className="mt-1">Total 120 item available</h4>
                      <div className="arrow">
                        <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                      </div>
                    </div>
                    <div className="categories-img">
                      <img className="img-fluid categories img" src="/images/product/23.png" alt="p23" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="d-flex align-items-center">
                    <div className="ps-3">
                      <h2>Lamp</h2>
                      <h4 className="mt-1">Total 120 item available</h4>
                      <div className="arrow">
                        <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                      </div>
                    </div>
                    <div className="categories-img">
                      <img className="img-fluid categories img" src="/images/product/24.png" alt="p24" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="d-flex align-items-center">
                    <div className="ps-3">
                      <h2>Cupboard</h2>
                      <h4 className="mt-1">Total 120 item available</h4>
                      <div className="arrow">
                        <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                      </div>
                    </div>
                    <div className="categories-img">
                      <img className="img-fluid categories img" src="/images/product/25.png" alt="p25" />
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </section>
          
      
          
          <section className="panel-space"></section>
          
      
          
          <div className="navbar-menu">
            <ul>
              <li>
                <Link to="/landing">
                  <div className="icon">
                    <img className="unactive" src="/images/svg/home.svg" alt="home" />
                    <img className="active" src="/images/svg/home-fill.svg" alt="home" />
                  </div>
                </Link>
              </li>
              <li className="active">
                <Link to="/categories">
                  <div className="icon">
                    <img className="unactive" src="/images/svg/categories.svg" alt="categories" />
                    <img className="active" src="/images/svg/categories-fill.svg" alt="categories" />
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/cart">
                  <div className="icon">
                    <img className="unactive" src="/images/svg/bag.svg" alt="bag" />
                    <img className="active" src="/images/svg/bag-fill.svg" alt="bag" />
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/wishlist">
                  <div className="icon">
                    <img className="unactive" src="/images/svg/heart.svg" alt="heart" />
                    <img className="active" src="/images/svg/heart-fill.svg" alt="heart" />
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <div className="icon">
                    <img className="unactive" src="/images/svg/profile.svg" alt="profile" />
                    <img className="active" src="/images/svg/profile-fill.svg" alt="profile" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
      
          
          
      
          
          
      
          
          
        
    </div>
  );
};

export default Categories;
