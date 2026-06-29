import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  return (
    <div className="text-start">
      
          
          <header className="section-t-space">
            <div className="custom-container">
              <div className="header-panel">
                <Link to="/categories">
                  <i className="iconsax back-btn" data-icon="arrow-left"></i>
                </Link>
                <h3>Search</h3>
                <Link to="/notification" className="notification">
                  <i className="iconsax notification-icon" data-icon="bell-2"></i>
                </Link>
              </div>
            </div>
          </header>
          
      
          
          <section>
            <div className="custom-container">
              <form className="theme-form search-head" target="_blank">
                <div className="form-group">
                  <div className="form-input">
                    <input type="text" className="form-control search" id="inputusername" placeholder="Search here..." />
                    <i className="iconsax search-icon" data-icon="search-normal-2"></i>
                  </div>
                </div>
              </form>
            </div>
          </section>
          
      
          
          <section>
            <div className="custom-container">
              <div className="swiper categories">
                <div className="swiper-wrapper ratio_square">
                  <div className="swiper-slide">
                    <Link to="#" className="categories-item active">
                      <img className="categories-img" src="/images/svg/sofa.svg" alt="sofa" />
                      <h4>Sofa</h4>
                    </Link>
                  </div>
                  <div className="swiper-slide">
                    <Link to="/shop" className="categories-item">
                      <h4>Chair</h4>
                    </Link>
                  </div>
                  <div className="swiper-slide">
                    <Link to="/shop" className="categories-item">
                      <h4>Table</h4>
                    </Link>
                  </div>
                  <div className="swiper-slide">
                    <Link to="/shop" className="categories-item">
                      <h4>Cabinets</h4>
                    </Link>
                  </div>
                  <div className="swiper-slide">
                    <Link to="/shop" className="categories-item">
                      <h4>Cupboard</h4>
                    </Link>
                  </div>
      
                  <div className="swiper-slide">
                    <Link to="/shop" className="categories-item">
                      <h4>Lamp</h4>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          
          <section className="section-b-space">
            <div className="custom-container">
              <div className="row g-3">
                <div className="col-6">
                  <div className="product-box">
                    <div className="product-box-img">
                      <Link to="/product-details"> <img className="img" src="/images/product/1.png" alt="p1" /></Link>
      
                      <div className="cart-box">
                        <Link to="/cart" className="cart-bag">
                          <i className="iconsax bag" data-icon="basket-2"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="product-box-detail">
                      <h4>Buddy Chair</h4>
                      <h5>Modern saddle arms</h5>
                      <div className="bottom-panel">
                        <div className="price">
                          <h4>$14 <del className="pev-price">$20</del></h4>
                        </div>
                        <div className="rating">
                          <img src="/images/svg/Star.svg" alt="star" />
                          <h6>4.5</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="col-6">
                  <div className="product-box">
                    <div className="product-box-img">
                      <Link to="/product-details"> <img className="img" src="/images/product/2.png" alt="p2" /></Link>
      
                      <div className="cart-box">
                        <Link to="/cart" className="cart-bag">
                          <i className="iconsax bag" data-icon="basket-2"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="product-box-detail">
                      <h4>Wingback Chair</h4>
                      <h5>Modern saddle arms</h5>
                      <div className="bottom-panel">
                        <div className="price">
                          <h4>$15 <del className="pev-price">$18</del></h4>
                        </div>
                        <div className="rating">
                          <img src="/images/svg/Star.svg" alt="star" />
                          <h6>4.5</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="col-6">
                  <div className="product-box">
                    <div className="product-box-img">
                      <Link to="/product-details"> <img className="img" src="/images/product/14.png" alt="p14" /></Link>
      
                      <div className="cart-box">
                        <Link to="/cart" className="cart-bag">
                          <i className="iconsax bag" data-icon="basket-2"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="product-box-detail">
                      <h4>Winston Chair</h4>
                      <h5>Modern saddle arms</h5>
                      <div className="bottom-panel">
                        <div className="price">
                          <h4>$20 <del className="pev-price">$22</del></h4>
                        </div>
                        <div className="rating">
                          <img src="/images/svg/Star.svg" alt="star" />
                          <h6>4.5</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="col-6">
                  <div className="product-box">
                    <div className="product-box-img">
                      <Link to="/product-details"> <img className="img" src="/images/product/15.png" alt="p15" /></Link>
      
                      <div className="cart-box">
                        <Link to="/cart" className="cart-bag">
                          <i className="iconsax bag" data-icon="basket-2"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="product-box-detail">
                      <h4>Beige Chair</h4>
                      <h5>Modern saddle arms</h5>
                      <div className="bottom-panel">
                        <div className="price">
                          <h4>$16 <del className="pev-price">$21</del></h4>
                        </div>
                        <div className="rating">
                          <img src="/images/svg/Star.svg" alt="star" />
                          <h6>4.5</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="col-6">
                  <div className="product-box">
                    <div className="product-box-img">
                      <Link to="/product-details"> <img className="img" src="/images/product/16.png" alt="p16" /></Link>
      
                      <div className="cart-box">
                        <Link to="/cart" className="cart-bag">
                          <i className="iconsax bag" data-icon="basket-2"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="product-box-detail">
                      <h4>Dining Chair</h4>
                      <h5>Modern saddle arms</h5>
                      <div className="bottom-panel">
                        <div className="price">
                          <h4>$12 <del className="pev-price">$15</del></h4>
                        </div>
                        <div className="rating">
                          <img src="/images/svg/Star.svg" alt="star" />
                          <h6>4.5</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="col-6">
                  <div className="product-box">
                    <div className="product-box-img">
                      <Link to="/product-details">
                        <img className="img" src="/images/product/17.png" alt="p17" />
                      </Link>
      
                      <div className="cart-box">
                        <Link to="/cart" className="cart-bag">
                          <i className="iconsax bag" data-icon="basket-2"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="product-box-detail">
                      <h4>Harbour Chair</h4>
                      <h5>Modern saddle arms</h5>
                      <div className="bottom-panel">
                        <div className="price">
                          <h4>$17 <del className="pev-price">$23</del></h4>
                        </div>
                        <div className="rating">
                          <img src="/images/svg/Star.svg" alt="star" />
                          <h6>4.5</h6>
                        </div>
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

export default Search;
