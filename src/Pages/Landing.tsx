import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useUserStore } from '../store/useUserStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { Menu, Bell, Search, Sliders, ArrowRight, ShoppingBag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  image: string;
  images: string;
  sizes: string;
  colors: string;
  categoryId: string;
}

const Landing = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const wishlistItems = useWishlistStore((state) => state.items); // Đăng ký lắng nghe sự thay đổi của wishlist để kích hoạt render lại
  const addItemToCart = useCartStore((state) => state.addItem);

  // Tránh cảnh báo biến chưa dùng của TypeScript
  if (wishlistItems.length < 0) {
    console.log(wishlistItems);
  }

  const handleAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart({
      productId: prod.id,
      name: prod.name,
      price: prod.salePrice || prod.price,
      image: prod.image,
      quantity: 1,
      size: 'Standard',
      color: 'Gray',
    });
    alert(`Đã thêm "${prod.name}" vào giỏ hàng thành công!`);
  };

  const handleLikeToggle = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: prod.id,
      name: prod.name,
      price: prod.salePrice || prod.price,
      image: prod.image,
      description: prod.description
    });
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('newest'); // newest, lowest, highest
  const [showSidebar, setShowSidebar] = useState(false);

  // Xác định xem có đang hiển thị trang chủ mặc định hay không (chỉ khi không tìm kiếm và đang chọn Sofa hoặc chưa chọn gì)
  const isDefaultHome = !searchTerm && (!selectedCategory || categories.find(c => c.id === selectedCategory)?.slug === 'sofa');

  // State cho Infinite Scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  // Reset body và documentElement classes về light mode khi tải trang cửa hàng
  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  // Fetch Categories
  useEffect(() => {
    apiRequest('/categories')
      .then((data) => {
        // Sắp xếp danh mục Sofa lên đầu mảng để hiển thị ngoài cùng bên trái như ảnh mẫu
        const sortedData = [...data];
        const sofaIndex = sortedData.findIndex((c: Category) => c.slug === 'sofa');
        if (sofaIndex > -1) {
          const [sofa] = sortedData.splice(sofaIndex, 1);
          sortedData.unshift(sofa);
        }
        setCategories(sortedData);

        // Tự động kích hoạt danh mục Sofa làm mặc định để trùng khớp 100% bản mẫu
        const sofa = sortedData[0];
        if (sofa && sofa.slug === 'sofa') {
          setSelectedCategory(sofa.id);
        }
      })
      .catch((err) => console.error('Lỗi tải danh mục:', err));
  }, []);

  // Fetch Products (với bộ lọc & phân trang)
  const fetchProducts = (pageNum: number, isAppend = false) => {
    let url = `/products?page=${pageNum}&limit=20&sort=${sortOption}`; // Tải đủ 13 sản phẩm mẫu cho trang chủ
    if (selectedCategory) {
      const activeCat = categories.find(c => c.id === selectedCategory);
      if (categories.length > 0 && activeCat && activeCat.slug !== 'sofa') {
        url += `&categoryId=${selectedCategory}`;
      }
    }
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    apiRequest(url)
      .then((res) => {
        if (isAppend) {
          setProducts((prev) => [...prev, ...res.products]);
        } else {
          setProducts(res.products);
        }
        setHasMore(res.hasMore);
        setLoading(false);
        setLoadingMore(false);
      })
      .catch((err) => {
        console.error('Lỗi tải sản phẩm:', err);
        setLoading(false);
        setLoadingMore(false);
      });
  };

  // Trigger fetch khi thay đổi bộ lọc
  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [selectedCategory, sortOption]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, false);
  };

  // Thiết lập Infinite Scroll sử dụng IntersectionObserver (chỉ dùng khi đang tìm kiếm hoặc lọc danh mục)
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, true);
      }
    });

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, page, selectedCategory, sortOption, searchTerm]);

  // Khởi tạo Swiper danh mục (chỉ chạy khi categories đã nạp xong và chỉ chạy duy nhất 1 lần để tránh reset cuộn)
  useEffect(() => {
    if (categories.length === 0) return;

    let categoriesSwiper: any = null;
    const timer = setTimeout(() => {
      const catEl = document.querySelector('.categories');
      if (catEl && (window as any).Swiper && !catEl.classList.contains('swiper-initialized')) {
        try {
          categoriesSwiper = new (window as any).Swiper(".categories", {
            slidesPerView: 4,
            spaceBetween: 10,
            loop: false,
            breakpoints: {
              0: { slidesPerView: 3.2 },
              375: { slidesPerView: 4 },
              767: { slidesPerView: 5 },
            },
          });
        } catch (e) {
          console.error("Lỗi khởi tạo Swiper danh mục:", e);
        }
      }
    }, 300);

    return () => {
      if (categoriesSwiper && categoriesSwiper.destroy) {
        categoriesSwiper.destroy(true, true);
      }
      clearTimeout(timer);
    };
  }, [categories]);

  // Khởi tạo Swiper chương trình khuyến mãi (Offer Zone) khi chuyển về trang chủ mặc định
  useEffect(() => {
    if (products.length === 0 || !isDefaultHome) return;

    let offerSwiper: any = null;
    const timer = setTimeout(() => {
      const offerEl = document.querySelector('.offer');
      if (offerEl && (window as any).Swiper && !offerEl.classList.contains('swiper-initialized')) {
        try {
          offerSwiper = new (window as any).Swiper(".offer", {
            slidesPerView: 1.5,
            spaceBetween: 20,
            loop: true,
            breakpoints: {
              0: { slidesPerView: 1 },
              375: { slidesPerView: 1.2 },
              425: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
            },
          });
        } catch (e) {
          console.error("Lỗi khởi tạo Swiper khuyến mãi:", e);
        }
      }
    }, 300);

    return () => {
      if (offerSwiper && offerSwiper.destroy) {
        offerSwiper.destroy(true, true);
      }
      clearTimeout(timer);
    };
  }, [products, isDefaultHome]);

  // Phân nhóm sản phẩm cho trang chủ (dựa theo tên thực tế trong DB)
  const newArrivals = products.filter(p => p.name === 'Buddy Chair' || p.name === 'Wingback Chair');
  const trending = products.filter(p => p.name.includes('Trending') || p.name === 'Mid Century Sofa' || p.name === 'Beige Chair');
  const offers = products.filter(p => p.name === 'Table Lamp' || p.name === 'Side Table' || p.name === 'Lounge Chair' || p.name === 'Swing Chair');
  const otherFurniture = products.filter(p => p.name === 'Bubble Swing Chair' || p.name.includes('Accent') || p.name === 'Double Bed Sheet' || p.name === 'Hanging Light');

  // Dự phòng: nếu các nhóm đều rỗng (do tên ko khớp), hiển thị tất cả sản phẩm qua layout tìm kiếm



  return (
    <div className="text-start">
      {/* side bar start */}
      <div 
        className={`offcanvas sidebar-offcanvas offcanvas-start ${showSidebar ? 'show' : ''}`} 
        tabIndex={-1} 
        id="offcanvasLeft" 
        style={{ visibility: showSidebar ? 'visible' : 'hidden', zIndex: 1050 }}
      >
        <div className="offcanvas-header">
          <img className="img-fluid profile-pic" src={user?.avatar || "/images/profile.png"} alt="profile" />
          <div>
            <h4>Xin chào, {user?.name || 'Khách'}!</h4>
            {user?.email && <p className="m-0 text-muted" style={{ fontSize: '12px' }}>{user.email}</p>}
          </div>
          <button type="button" className="btn-close" onClick={() => setShowSidebar(false)} aria-label="Close" />
        </div>
        <div className="offcanvas-body">
          <div className="sidebar-content">
            <ul className="link-section ps-0 mb-0">
              <li className="list-unstyled">
                <Link to="/profile" className="pages" onClick={() => setShowSidebar(false)} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <h4>Hồ sơ của tôi</h4>
                  <ArrowRight size={16} style={{ color: 'rgba(155, 163, 170, 1)' }} />
                </Link>
              </li>
              <li className="list-unstyled">
                <Link to="/orders" className="pages" onClick={() => setShowSidebar(false)} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <h4>Lịch sử đơn hàng</h4>
                  <ArrowRight size={16} style={{ color: 'rgba(155, 163, 170, 1)' }} />
                </Link>
              </li>
              {/* Link vào trang Admin Dashboard */}
              <li className="list-unstyled">
                <Link to="/admin" className="pages" onClick={() => setShowSidebar(false)} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <h4 className="text-danger fw-bold">Trang Quản Trị (Admin)</h4>
                  <ArrowRight size={16} className="text-danger" />
                </Link>
              </li>
              <li className="list-unstyled">
                {user ? (
                  <a href="#!" onClick={() => { logout(); setShowSidebar(false); navigate('/login'); }} className="pages text-danger" style={{ textDecoration: 'none' }}>
                    <h4>Đăng xuất</h4>
                  </a>
                ) : (
                  <Link to="/login" className="pages text-primary" onClick={() => setShowSidebar(false)} style={{ textDecoration: 'none' }}>
                    <h4>Đăng nhập</h4>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* side bar end */}

      {/* side bar backdrop */}
      {showSidebar && (
        <div 
          className="offcanvas-backdrop fade show" 
          onClick={() => setShowSidebar(false)} 
          style={{ zIndex: 1040 }}
        />
      )}

      {/* header start */}
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header">
            <div className="head-content">
              <button 
                className="sidebar-btn d-flex align-items-center justify-content-center" 
                type="button" 
                onClick={() => setShowSidebar(true)}
              >
                <Menu size={22} style={{ color: '#16171d' }} />
              </button>
              <div className="header-info">
                <img className="img-fluid profile-pic" src={user?.avatar || "/images/profile.png"} alt="profile" />
                <div>
                  <h4 className="light-text">Hello</h4>
                  <h2 className="theme-color">{user?.name || 'Fuzzy Guest'}!</h2>
                </div>
              </div>
            </div>
            <Link to="/notification" className="notification d-flex align-items-center justify-content-center position-relative">
              <Bell size={22} style={{ color: '#16171d' }} />
              {/* Chấm tròn đỏ thông báo như ảnh mẫu */}
              <span className="position-absolute translate-middle rounded-circle bg-danger border border-light" style={{ top: '10px', right: '10px', width: '8px', height: '8px' }}></span>
            </Link>
          </div>
        </div>
      </header>
      {/* header end */}

      {/* search section starts */}
      <section>
        <div className="custom-container">
          <form className="theme-form search-head" onSubmit={handleSearchSubmit}>
            <div className="form-group">
              <div className="form-input">
                <input
                  type="text"
                  className="form-control search"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="search-icon d-flex align-items-center justify-content-center" onClick={() => fetchProducts(1, false)} style={{ cursor: 'pointer' }}>
                  <Search size={18} />
                </i>
              </div>
              <a href="#search-filter" className="btn filter-btn mt-0 d-flex align-items-center justify-content-center" data-bs-toggle="modal">
                <Sliders size={20} style={{ color: '#16171d' }} />
              </a>
            </div>
          </form>
        </div>
      </section>
      {/* search section end */}

      {/* Top Banner Section */}
      <section className="banner-wapper mt-3">
        <div className="custom-container">
          <div className="banner-bg">
            <img className="img-fluid img-bg w-100" src="/images/banner-1.jpg" alt="banner-1" />
            <div className="banner-content">
              <h2 className="fw-semibold">Best Selling</h2>
              <h4>Comforts & Modern life Stylish Sofa</h4>
            </div>
            <a href="#!" className="more-btn">
              <h4>View More</h4>
              <i className="iconsax right-arrow" data-icon="arrow-right" />
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section (Swiper) */}
      <section className="mt-3">
        <div className="custom-container">
          <div className="swiper categories">
            <div className="swiper-wrapper ratio_square">
              {categories.map((cat) => (
                <div className="swiper-slide" key={cat.id}>
                  <a
                    href="#!"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`categories-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    {/* Chỉ hiện Icon Sofa khi danh mục Sofa được ACTIVE đúng như ảnh chụp màn hình */}
                    {selectedCategory === cat.id && cat.slug === 'sofa' && (
                      <img className="categories-img" src="/images/sofa.svg" alt="sofa" />
                    )}
                    <h4>{cat.name}</h4>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="col-12 text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : !isDefaultHome ? (
        /* LAYOUT KHI CÓ BỘ LỌC HOẶC TÌM KIẾM ĐỘNG */
        <section className="section-t-space">
          <div className="custom-container">
            <div className="title d-flex justify-content-between align-items-center mb-3">
              <h2 className="m-0">Kết quả tìm kiếm</h2>
            </div>
            <div className="row g-3">
              {products.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">Không tìm thấy sản phẩm nào.</p>
                </div>
              ) : (
                products.map((prod) => (
                  <div className="col-6" key={prod.id}>
                    <div className="product-box">
                      <div className="product-box-img position-relative" style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px' }}>
                        <Link to={`/product/${prod.id}`}>
                          <img className="img w-100 h-100 object-cover" src={prod.image} alt={prod.name} onError={(e) => { e.currentTarget.src = '/images/1.png' }} />
                        </Link>
                        <div className="cart-box">
                          <a 
                            href="#!" 
                            className="cart-bag d-flex align-items-center justify-content-center"
                            onClick={(e) => handleAddToCart(e, prod)}
                            title="Thêm vào giỏ hàng"
                          >
                            <ShoppingBag size={14} style={{ color: '#ffffff' }} />
                          </a>
                        </div>
                      </div>
                      {/* Thêm like-btn chuẩn cấu trúc thiết kế mẫu */}
                      <div
                        onClick={(e) => handleLikeToggle(e, prod)}
                        className={`like-btn animate ${isInWishlist(prod.id) ? 'active' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <img className="outline-icon" src="/images/like.svg" alt="like" />
                        <img className="fill-icon" src="/images/like-fill.svg" alt="like" />
                        <div className="effect-group">
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                        </div>
                      </div>
                      <div className="product-box-detail mt-2">
                        <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                          <h4 className="text-dark font-semibold text-truncate">{prod.name}</h4>
                        </Link>
                        <h5 className="text-muted text-truncate" style={{ fontSize: '11px' }}>{prod.description}</h5>
                        <div className="bottom-panel d-flex justify-content-between align-items-center mt-1">
                          <div className="price">
                            <h4 className="m-0 text-dark fw-bold">
                              ${prod.salePrice || prod.price}{' '}
                              {prod.salePrice && <del className="pev-price text-muted" style={{ fontSize: '11px', marginLeft: '4px' }}>${prod.price}</del>}
                            </h4>
                          </div>
                          <div className="rating d-flex align-items-center gap-1">
                            <img src="/images/Star.svg" alt="star" style={{ width: '12px' }} />
                            <h6 className="m-0" style={{ fontSize: '12px' }}>4.5</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div ref={loadMoreTriggerRef} className="text-center py-3">
              {loadingMore && (
                <div className="spinner-border spinner-border-sm text-secondary" role="status">
                  <span className="visually-hidden">Đang tải thêm...</span>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* LAYOUT TRANG CHỦ MẶC ĐỊNH (GIỐNG 100% BẢN GỐC) */
        <>
          {/* New Arrivals Section */}
          <section className="section-t-space">
            <div className="custom-container">
              <div className="title d-flex justify-content-between align-items-center mb-3">
                <h2 className="m-0">New Arrivals</h2>
                <a href="#!" style={{ fontSize: '14px', textDecoration: 'none', color: 'var(--theme-color)' }}>View All</a>
              </div>
              <div className="row g-3">
                {newArrivals.map((prod) => (
                  <div className="col-6" key={prod.id}>
                    <div className="product-box">
                      <div className="product-box-img position-relative" style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px' }}>
                        <Link to={`/product/${prod.id}`}>
                          <img className="img w-100 h-100 object-cover" src={prod.image} alt={prod.name} />
                        </Link>
                        <div className="cart-box">
                          <a 
                            href="#!" 
                            className="cart-bag d-flex align-items-center justify-content-center"
                            onClick={(e) => handleAddToCart(e, prod)}
                            title="Thêm vào giỏ hàng"
                          >
                            <ShoppingBag size={14} style={{ color: '#ffffff' }} />
                          </a>
                        </div>
                      </div>
                      {/* Thêm like-btn chuẩn cấu trúc thiết kế mẫu */}
                      <div
                        onClick={(e) => handleLikeToggle(e, prod)}
                        className={`like-btn animate ${isInWishlist(prod.id) ? 'active' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <img className="outline-icon" src="/images/like.svg" alt="like" />
                        <img className="fill-icon" src="/images/like-fill.svg" alt="like" />
                        <div className="effect-group">
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                        </div>
                      </div>
                      <div className="product-box-detail mt-2">
                        <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                          <h4 className="text-dark font-semibold text-truncate">{prod.name}</h4>
                        </Link>
                        <h5 className="text-muted text-truncate" style={{ fontSize: '11px' }}>{prod.description}</h5>
                        <div className="bottom-panel d-flex justify-content-between align-items-center mt-1">
                          <div className="price">
                            <h4 className="m-0 text-dark fw-bold">
                              ${prod.salePrice || prod.price}{' '}
                              {prod.salePrice && <del className="pev-price text-muted" style={{ fontSize: '11px', marginLeft: '4px' }}>${prod.price}</del>}
                            </h4>
                          </div>
                          <div className="rating d-flex align-items-center gap-1">
                            <img src="/images/Star.svg" alt="star" style={{ width: '12px' }} />
                            <h6 className="m-0" style={{ fontSize: '12px' }}>4.5</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trending Furniture Section */}
          <section className="section-t-space">
            <div className="custom-container">
              <div className="title d-flex justify-content-between align-items-center mb-3">
                <h2 className="m-0">Trending Furniture</h2>
                <a href="#!" style={{ fontSize: '14px', textDecoration: 'none', color: 'var(--theme-color)' }}>View All</a>
              </div>
              <div className="row g-3">
                {trending.map((prod) => (
                  <div className="col-12" key={prod.id}>
                    <div className="horizontal-product-box">
                      <Link to={`/product/${prod.id}`} className="horizontal-product-img">
                        <img className="img-fluid img" src={prod.image} alt={prod.name} />
                      </Link>
                      <div className="horizontal-product-details">
                        <div className="d-flex align-items-center justify-content-between">
                          <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                            <h4 className="text-dark font-semibold text-truncate">{prod.name}</h4>
                          </Link>
                          <div className="rating d-flex align-items-center gap-1">
                            <img src="/images/Star.svg" alt="star" style={{ width: '12px' }} />
                            <h6 className="theme-color m-0" style={{ fontSize: '12px' }}>4.5</h6>
                          </div>
                        </div>
                        <h5 className="text-muted text-truncate" style={{ fontSize: '11px' }}>{prod.description}</h5>
                        <div className="d-flex align-items-center justify-content-between mt-1">
                          <div className="d-flex align-items-center gap-2">
                            <h3 className="fw-semibold m-0">${prod.salePrice || prod.price}</h3>
                            {prod.salePrice && <h6 className="save m-0">Save ${prod.price - prod.salePrice}</h6>}
                          </div>
                          <a 
                            href="#!" 
                            className="cart-bag d-flex align-items-center justify-content-center"
                            onClick={(e) => handleAddToCart(e, prod)}
                            title="Thêm vào giỏ hàng"
                          >
                            <ShoppingBag size={14} style={{ color: '#ffffff' }} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Promo Banner 2 Section */}
          <section className="banner-wapper mt-4">
            <div className="custom-container">
              <div className="banner-bg">
                <img className="img-fluid img-bg" src="/images/banner-2.jpg" alt="banner-2" />
                <div className="banner-content">
                  <h2 className="fw-semibold">Best Selling</h2>
                  <h4>Comforts & Modern life Stylish Sofa</h4>
                </div>
                <a href="#!" className="more-btn">
                  <h4>View More</h4>
                  <i className="iconsax right-arrow" data-icon="arrow-right" />
                </a>
              </div>
            </div>
          </section>

          {/* Offer Zone Section */}
          <section className="offer-zone section-t-space pt-0">
            <div className="custom-container">
              <div className="title d-flex justify-content-between align-items-center mb-3">
                <h2 className="m-0">Offer Zone</h2>
                <a href="#!" style={{ fontSize: '14px', textDecoration: 'none', color: 'var(--theme-color)' }}>View All</a>
              </div>
              <div className="swiper offer">
                <div className="swiper-wrapper">
                  {offers.map((prod) => (
                    <div className="swiper-slide" key={prod.id}>
                      <div className="horizontal-product-box">
                        <Link to={`/product/${prod.id}`} className="horizontal-product-img">
                          <img className="img-fluid img" src={prod.image} alt={prod.name} />
                        </Link>
                        <div className="horizontal-product-details">
                          <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                            <h4 className="text-dark font-semibold text-truncate">{prod.name}</h4>
                          </Link>
                          <h5 className="text-muted text-truncate" style={{ fontSize: '11px' }}>{prod.description}</h5>
                          <div className="rating d-flex align-items-center gap-1 mt-1">
                            <img src="/images/Star.svg" alt="star" style={{ width: '10px' }} />
                            <img src="/images/Star.svg" alt="star" style={{ width: '10px' }} />
                            <img src="/images/Star.svg" alt="star" style={{ width: '10px' }} />
                            <img src="/images/Star.svg" alt="star" style={{ width: '10px' }} />
                            <img src="/images/Star.svg" alt="star" style={{ width: '10px' }} />
                          </div>
                          <div className="d-flex align-items-center justify-content-between mt-1">
                            <div className="d-flex align-items-center gap-2">
                              <h3 className="fw-semibold m-0">${prod.salePrice || prod.price}</h3>
                            </div>
                            <a 
                              href="#!" 
                              className="cart-bag d-flex align-items-center justify-content-center"
                              onClick={(e) => handleAddToCart(e, prod)}
                              title="Thêm vào giỏ hàng"
                            >
                              <ShoppingBag size={14} style={{ color: '#ffffff' }} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Furniture And Decor Section */}
          <section className="section-t-space pt-0">
            <div className="custom-container">
              <div className="title d-flex justify-content-between align-items-center mb-3">
                <h2 className="m-0">Furniture And Decor</h2>
                <a href="#!" style={{ fontSize: '14px', textDecoration: 'none', color: 'var(--theme-color)' }}>View All</a>
              </div>
              <div className="row g-4">
                {otherFurniture.map((prod) => (
                  <div className="col-6" key={prod.id}>
                    <div className="product-box">
                      <div className="product-box-img position-relative" style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px' }}>
                        <Link to={`/product/${prod.id}`}>
                          <img className="img w-100 h-100 object-cover" src={prod.image} alt={prod.name} />
                        </Link>
                        <div className="cart-box">
                          <a 
                            href="#!" 
                            className="cart-bag d-flex align-items-center justify-content-center"
                            onClick={(e) => handleAddToCart(e, prod)}
                            title="Thêm vào giỏ hàng"
                          >
                            <ShoppingBag size={14} style={{ color: '#ffffff' }} />
                          </a>
                        </div>
                      </div>
                      {/* Thêm like-btn chuẩn cấu trúc thiết kế mẫu */}
                      <div
                        onClick={(e) => handleLikeToggle(e, prod)}
                        className={`like-btn animate ${isInWishlist(prod.id) ? 'active' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <img className="outline-icon" src="/images/like.svg" alt="like" />
                        <img className="fill-icon" src="/images/like-fill.svg" alt="like" />
                        <div className="effect-group">
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                        </div>
                      </div>
                      <div className="product-box-detail mt-2">
                        <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                          <h4 className="text-dark font-semibold text-truncate">{prod.name}</h4>
                        </Link>
                        <div className="d-flex justify-content-between align-items-center gap-1 mt-1">
                          <h5 className="text-muted text-truncate m-0" style={{ fontSize: '11px' }}>{prod.description}</h5>
                          <h3 className="fw-semibold m-0">${prod.price}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Grid Banner Section (2 cột) - giống 100% trang mẫu */}
          <section className="banner-wapper grid-banner">
            <div className="custom-container">
              <div className="row">
                <div className="col-6">
                  <div className="banner-bg">
                    <img className="img-fluid img-bg" src="/images/banner-3.jpg" alt="banner-3" />
                    <div className="banner-content">
                      <h3>Wingback Chair</h3>
                    </div>
                    <a href="#!" className="more-btn d-block">
                      <i className="iconsax right-arrow" data-icon="arrow-right" />
                      <h3>View More</h3>
                    </a>
                  </div>
                </div>
                <div className="col-6">
                  <div className="banner-bg">
                    <img className="img-fluid img-bg" src="/images/banner-4.jpg" alt="banner-4" />
                    <div className="banner-content">
                      <h3>Modern Sofa</h3>
                    </div>
                    <a href="#!" className="more-btn d-block">
                      <i className="iconsax right-arrow" data-icon="arrow-right" />
                      <h3>View More</h3>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* filter modal (Bottom Sheet) start */}
      <div className="modal search-filter" id="search-filter" tabIndex={-1}>
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
              <h3 className="fw-semibold m-0">Bộ lọc & Sắp xếp</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-3">
              <div className="mb-4">
                <h4 className="fw-semibold mb-2">Sắp xếp theo</h4>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sortOption"
                    id="radioNewest"
                    checked={sortOption === 'newest'}
                    onChange={() => setSortOption('newest')}
                  />
                  <label className="form-check-label" htmlFor="radioNewest">Mới nhất</label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sortOption"
                    id="radioLowest"
                    checked={sortOption === 'lowest'}
                    onChange={() => setSortOption('lowest')}
                  />
                  <label className="form-check-label" htmlFor="radioLowest">Giá từ thấp đến cao</label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sortOption"
                    id="radioHighest"
                    checked={sortOption === 'highest'}
                    onChange={() => setSortOption('highest')}
                  />
                  <label className="form-check-label" htmlFor="radioHighest">Giá từ cao đến thấp</label>
                </div>
              </div>
            </div>
            <div className="footer-modal p-3 d-flex gap-3 border-top">
              <button
                type="button"
                className="btn btn-secondary w-50"
                data-bs-dismiss="modal"
                onClick={() => { setSortOption('newest'); setSelectedCategory(null); setSearchTerm(''); }}
              >
                Xóa bộ lọc
              </button>
              <button type="button" className="btn btn-dark w-50" data-bs-dismiss="modal">Áp dụng</button>
            </div>
          </div>
        </div>
      </div>
      {/* filter modal end */}

      {/* panel-space start */}
      <section className="panel-space" style={{ height: '70px' }} />
    </div>
  );
};

export default Landing;
