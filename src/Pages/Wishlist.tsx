import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { X, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');
  }, []);

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Thêm vào giỏ hàng với các thuộc tính mặc định
    addItemToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: 'Standard',
      color: 'Gray',
    });

    setSuccessMsg(`Đã thêm "${item.name}" vào giỏ hàng!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="text-start">
      {/* Header */}
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/profile">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Sản phẩm yêu thích ({items.length})</h3>
          </div>
        </div>
      </header>

      {/* Thông báo thành công */}
      {successMsg && (
        <div className="custom-container mt-2">
          <div className="alert alert-success py-2" role="alert" style={{ fontSize: '13px' }}>
            {successMsg}
          </div>
        </div>
      )}

      {/* Content */}
      <section className="section-b-space pt-0">
        <div className="custom-container">
          {items.length === 0 ? (
            <div className="empty-tab text-center py-5">
              <img className="img-fluid empty-img img1 w-100 mb-4" src="/images/gif/wishlist.gif" alt="empty-wishlist" style={{ maxWidth: '280px' }} />
              <h2>Chưa có sản phẩm yêu thích</h2>
              <h5 className="mt-3 text-muted">Bấm nút thả tim ở trang cửa hàng để lưu lại những món nội thất bạn thích nhé!</h5>
              <Link to="/shop" className="btn btn-dark rounded-pill px-4 mt-4 py-2">Mua sắm ngay</Link>
            </div>
          ) : (
            <div className="row g-3">
              {items.map((item) => (
                <div className="col-12" key={item.productId}>
                  <div className="horizontal-product-box">
                    <Link to={`/product/${item.productId}`} className="horizontal-product-img">
                      <img 
                        className="img-fluid img" 
                        src={item.image} 
                        alt={item.name} 
                        onError={(e) => { e.currentTarget.src = '/images/1.png' }}
                      />
                    </Link>
                    <div className="horizontal-product-details">
                      <div className="d-flex align-items-center justify-content-between">
                        <Link to={`/product/${item.productId}`} style={{ textDecoration: 'none' }}>
                          <h4 className="text-dark font-semibold text-truncate" style={{ maxWidth: '180px' }}>{item.name}</h4>
                        </Link>
                        <button 
                          className="close-button btn p-0 border-0 d-flex align-items-center justify-content-center" 
                          onClick={() => removeItem(item.productId)}
                          title="Xóa khỏi danh sách yêu thích"
                        >
                          <X size={18} style={{ color: 'rgba(155, 163, 170, 1)' }} />
                        </button>
                      </div>
                      <h5 className="text-muted text-truncate mt-1" style={{ fontSize: '11px' }}>{item.description}</h5>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex align-items-center gap-2">
                          <h3 className="fw-semibold m-0">${item.price}</h3>
                        </div>
                        <a 
                          href="#!" 
                          className="cart-bag"
                          onClick={(e) => handleAddToCart(e, item)}
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
          )}
        </div>
      </section>
      
      <section className="panel-space"></section>
    </div>
  );
};

export default Wishlist;

