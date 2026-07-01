import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useCartStore } from '../store/useCartStore';

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Quản lý thuộc tính chọn mua
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiRequest(`/products?id=${id}`)
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image);
        
        // Phân tích danh sách hình ảnh
        const secondary = data.images ? data.images.split(',') : [];
        setImageList([data.image, ...secondary]);

        // Chọn mặc định thuộc tính đầu tiên
        const sizes = data.sizes ? data.sizes.split(',') : [];
        if (sizes.length > 0) setSelectedSize(sizes[0]);

        const colors = data.colors ? data.colors.split(',') : [];
        if (colors.length > 0) setSelectedColor(colors[0]);

        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi lấy chi tiết sản phẩm:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-5">
        <h4>Không tìm thấy sản phẩm!</h4>
        <Link to="/shop" className="btn btn-dark btn-sm rounded-pill mt-3 px-4">Quay lại Cửa hàng</Link>
      </div>
    );
  }

  const sizes = product.sizes ? product.sizes.split(',') : [];
  const colors = product.colors ? product.colors.split(',') : [];

  const handleAddToCart = () => {
    setErrorMsg('');
    setSuccessMsg(false);

    if (sizes.length > 0 && !selectedSize) {
      setErrorMsg('Vui lòng chọn Kích thước.');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      setErrorMsg('Vui lòng chọn Màu sắc.');
      return;
    }
    if (product.stock <= 0) {
      setErrorMsg('Sản phẩm đã hết hàng tồn kho.');
      return;
    }

    // Thêm sản phẩm vào Zustand store
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="text-start pb-5">
      {/* Top Header */}
      <div className="custom-container pt-3 d-flex justify-content-between align-items-center mb-3">
        <button onClick={() => navigate(-1)} className="btn p-0 border-0">
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>← Quay lại</span>
        </button>
        <h3 className="fw-semibold m-0 text-truncate" style={{ maxWidth: '200px', fontSize: '16px' }}>Chi tiết sản phẩm</h3>
        <Link to="/cart" className="position-relative">
          <span style={{ fontSize: '20px' }}>🛒</span>
        </Link>
      </div>

      {/* Carousel hình ảnh */}
      <div className="custom-container mb-4">
        <div className="main-image-container rounded-3 mb-2 bg-light" style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
          <img 
            src={activeImage} 
            alt={product.name} 
            className="w-100 h-100 object-cover" 
            onError={(e) => { e.currentTarget.src = 'images/1.png' }}
          />
        </div>
        
        {/* Album ảnh nhỏ */}
        {imageList.length > 1 && (
          <div className="d-flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {imageList.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(img)}
                className={`btn p-0 border rounded-2 flex-shrink-0 bg-white ${activeImage === img ? 'border-dark' : 'border-light'}`}
                style={{ width: '60px', height: '60px', overflow: 'hidden' }}
              >
                <img src={img} alt="" className="w-100 h-100 object-cover" onError={(e) => { e.currentTarget.src = 'images/1.png' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="custom-container">
        {/* Tên & Giá cả */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h2 className="fw-bold text-dark m-0" style={{ fontSize: '20px' }}>{product.name}</h2>
            <p className="text-muted mt-1" style={{ fontSize: '13px' }}>Hàng tồn kho: <span className="fw-bold text-dark">{product.stock}</span> sản phẩm</p>
          </div>
          <div className="text-end">
            <h3 className="fw-bold text-dark m-0" style={{ fontSize: '20px' }}>
              ${product.salePrice || product.price}
            </h3>
            {product.salePrice && (
              <del className="text-muted" style={{ fontSize: '13px' }}>${product.price}</del>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="d-flex align-items-center gap-1 mb-3">
          <img src="/images/Star.svg" alt="star" style={{ width: '14px' }} />
          <h6 className="m-0 fw-semibold" style={{ fontSize: '13px' }}>4.5 (86 đánh giá)</h6>
        </div>

        {/* Mô tả sản phẩm */}
        <div className="mb-4">
          <h4 className="fw-semibold mb-2" style={{ fontSize: '15px' }}>Chi tiết sản phẩm</h4>
          <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.6' }}>{product.description}</p>
        </div>

        {/* Lựa chọn thuộc tính */}
        <div className="row g-3 mb-4">
          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="col-12">
              <h4 className="fw-semibold mb-2" style={{ fontSize: '14px' }}>Kích thước</h4>
              <div className="d-flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <button 
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`btn btn-sm rounded-3 px-3 py-1 ${selectedSize === s ? 'btn-dark' : 'btn-outline-dark'}`}
                    style={{ fontSize: '13px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="col-12">
              <h4 className="fw-semibold mb-2" style={{ fontSize: '14px' }}>Màu sắc</h4>
              <div className="d-flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button 
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`btn btn-sm rounded-3 px-3 py-1 ${selectedColor === c ? 'btn-dark' : 'btn-outline-dark'}`}
                    style={{ fontSize: '13px' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Số lượng */}
          <div className="col-12 mt-3">
            <h4 className="fw-semibold mb-2" style={{ fontSize: '14px' }}>Số lượng</h4>
            <div className="d-flex align-items-center gap-3">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
              >
                -
              </button>
              <span className="fw-bold" style={{ fontSize: '16px' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Thông báo */}
        {errorMsg && (
          <div className="alert alert-danger py-2" role="alert" style={{ fontSize: '13px' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success py-2" role="alert" style={{ fontSize: '13px' }}>
            Đã thêm vào giỏ hàng thành công!
          </div>
        )}
      </div>

      {/* Nút Sticky Bottom Add to Cart ghim ở đáy màn hình */}
      <div 
        className="position-fixed bottom-0 start-50 translate-middle-x bg-white border-top p-3 w-100 shadow-lg d-flex align-items-center justify-content-between"
        style={{ maxWidth: '480px', zIndex: 100 }}
      >
        <div>
          <span className="text-muted" style={{ fontSize: '11px' }}>Tổng cộng</span>
          <h3 className="fw-bold text-dark m-0" style={{ fontSize: '18px' }}>
            ${(product.salePrice || product.price) * quantity}
          </h3>
        </div>
        <button 
          onClick={handleAddToCart}
          className="btn btn-dark px-4 py-2 rounded-pill fw-semibold"
          style={{ width: '60%' }}
        >
          Thêm vào giỏ
        </button>
      </div>

      <div className="panel-space" style={{ height: '90px' }} />
    </div>
  );
};

export default ProductDetail;
