import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  // Đồng bộ class trên body và html khi mount/unmount để kích hoạt dark theme của template
  useEffect(() => {
    document.body.classList.add('auth-body', 'dark');
    document.documentElement.classList.add('auth-body', 'dark');
    return () => {
      document.body.classList.remove('auth-body', 'dark');
      document.documentElement.classList.remove('auth-body', 'dark');
    };
  }, []);

  // Khởi tạo Swiper gốc của template sau khi DOM mount
  useEffect(() => {
    let swiperInstance: any = null;

    const initSwiper = () => {
      if ((window as any).Swiper) {
        try {
          swiperInstance = new (window as any).Swiper(".slider-1", {
            slidesPerView: 1,
            loop: true,
            autoplay: {
              delay: 3500,
              disableOnInteraction: false,
            },
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
          });
        } catch (e) {
          console.error("Lỗi khởi tạo Swiper:", e);
        }
      } else {
        // Swiper chưa load, thử lại sau 300ms
        setTimeout(initSwiper, 300);
      }
    };

    const timer = setTimeout(initSwiper, 100);

    return () => {
      if (swiperInstance && swiperInstance.destroy) {
        swiperInstance.destroy(true, true);
      }
      clearTimeout(timer);
    };
  }, []);

  // Khởi tạo hiển thị popup PWA sau khi component đã mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const myOffcanvas = document.getElementById("offcanvas");
      if (myOffcanvas && (window as any).bootstrap) {
        try {
          const bsOffcanvas = new (window as any).bootstrap.Offcanvas(myOffcanvas);
          bsOffcanvas.show();
        } catch (e) {
          console.error("Lỗi khởi tạo Bootstrap Offcanvas:", e);
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Khởi tạo Iconsax cho các phần tử sau khi component đã render
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((window as any).init_iconsax) {
        try {
          (window as any).init_iconsax();
        } catch (e) {
          console.error("Lỗi chạy init_iconsax:", e);
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center w-100" style={{ minHeight: '100vh', position: 'relative' }}>
      
      {/* onboarding section start */}
      <section className="section-b-space w-100">
        <div className="swiper intro slider-1 w-100">
          <div className="swiper-wrapper">
            
            {/* Slide 1 */}
            <div className="swiper-slide">
              <div className="theme-logo pb-3">
                <img className="img-fluid logo-img" src="/images/logo.png" alt="logo" />
              </div>
              <div className="onboarding-design">
                <img className="img-fluid design-img" src="/images/design1.png" alt="bg-design" />
                <img className="img-fluid slider-img1" src="/images/1.png" alt="slider-1" />
                <img className="img-fluid vector1" src="/images/vector1.png" alt="v1" />
                <img className="img-fluid vector2" src="/images/vector2.png" alt="v2" />
                <img className="img-fluid vector3" src="/images/vector3.png" alt="v3" />
              </div>
              <div className="product-details">
                <h1>Office Furniture</h1>
                <span />
                <p>The best payment method connects your money to friends, family, brands, and experiences.</p>
                <div className="redirate-btn">
                  <Link to="/login" className="next-arrow">
                    <i className="iconsax right-arrow" data-icon="arrow-right" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="swiper-slide">
              <div className="theme-logo pb-3">
                <img className="img-fluid logo-img" src="/images/logo.png" alt="logo" />
              </div>
              <div className="onboarding-design">
                <img className="img-fluid design-img" src="/images/design1.png" alt="bg-design" />
                <img className="img-fluid slider-img2" src="/images/2.png" alt="slider-2" />
                <img className="img-fluid vector1" src="/images/vector1.png" alt="v1" />
                <img className="img-fluid vector2" src="/images/vector2.png" alt="v2" />
                <img className="img-fluid vector3" src="/images/vector3.png" alt="v3" />
              </div>
              <div className="product-details">
                <h1>Relaxing Furniture</h1>
                <span />
                <p>The best payment method connects your money to friends, family, brands, and experiences.</p>
                <div className="redirate-btn">
                  <Link to="/login" className="next-arrow">
                    <i className="iconsax right-arrow" data-icon="arrow-right" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="swiper-slide">
              <div className="theme-logo pb-3">
                <img className="img-fluid logo-img" src="/images/logo.png" alt="logo" />
              </div>
              <div className="onboarding-design">
                <img className="img-fluid design-img" src="/images/design1.png" alt="bg-design" />
                <img className="img-fluid slider-img3" src="/images/3.png" alt="slider-3" />
                <img className="img-fluid vector1" src="/images/vector1.png" alt="v1" />
                <img className="img-fluid vector2" src="/images/vector2.png" alt="v2" />
                <img className="img-fluid vector3" src="/images/vector3.png" alt="v3" />
              </div>
              <div className="product-details">
                <h1>Home Decor</h1>
                <span />
                <p>The best payment method connects your money to friends, family, brands, and experiences.</p>
                <div className="redirate-btn">
                  <Link to="/login" className="next-arrow">
                    <i className="iconsax right-arrow" data-icon="arrow-right" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
          
          {/* Swiper Pagination dots auto-generated by Swiper */}
          <div className="swiper-pagination"></div>
        </div>
      </section>
      {/* onboarding section end */}

      {/* Popup nhắc nhở PWA Add to Home Screen */}
      <div className="offcanvas offcanvas-bottom addtohome-popup theme-offcanvas" tabIndex={-1} id="offcanvas">
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
        <div className="offcanvas-body small">
          <div className="app-info">
            <img src="/images/48.png" className="img-fluid" alt="" />
            <div className="content text-start">
              <h4>fuzzy app</h4>
              <a href="#">www.fuzzy-app.com</a>
            </div>
          </div>
          <a href="#!" className="btn theme-btn install-app btn-inline home-screen-btn m-0" id="installapp">Add to Home Screen</a>
        </div>
      </div>
    </div>
  );
};

export default Home;