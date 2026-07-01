import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';

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

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  address: string;
  items: OrderItem[];
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'users'>('overview');
  
  // Danh sách dữ liệu
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Hiển thị Form CRUD dạng Modal popup
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // State Form Sản phẩm
  const [prodId, setProdId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodSalePrice, setProdSalePrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodImage, setProdImage] = useState('/images/1.png');
  const [prodImages, setProdImages] = useState('/images/1.png');
  const [prodSizes, setProdSizes] = useState('Standard');
  const [prodColors, setProdColors] = useState('Gray,Black');
  const [prodCatId, setProdCatId] = useState('');

  // State Form Danh mục
  const [catId, setCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('sofa.svg');

  // Khởi tạo và nạp dữ liệu tất cả khi tải trang để tính toán tổng quan
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const prodRes = await apiRequest('/products?limit=100');
      setProducts(prodRes.products);
      
      const catRes = await apiRequest('/categories');
      setCategories(catRes);
      if (catRes.length > 0 && !prodCatId) setProdCatId(catRes[0].id);

      const orderRes = await apiRequest('/orders?admin=true');
      setOrders(orderRes);

      const userRes = await apiRequest('/users').catch(() => []);
      setUsers(userRes);
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu tổng thể:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Xóa người dùng sẽ xóa tất cả đơn hàng và địa chỉ liên quan của họ. Đồng ý?')) return;
    try {
      await apiRequest(`/users?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa người dùng');
    }
  };

  // Tính toán số liệu tổng quan
  const totalRevenue = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrders = orders.filter(o => o.status === 'PREPARING').length;

  // CRUD Sản phẩm
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      description: prodDesc,
      price: prodPrice,
      salePrice: prodSalePrice || null,
      stock: prodStock,
      image: prodImage,
      images: prodImages,
      sizes: prodSizes,
      colors: prodColors,
      categoryId: prodCatId,
    };

    try {
      if (prodId) {
        await apiRequest(`/products?id=${prodId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      resetProductForm();
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu sản phẩm');
    }
  };

  const handleEditProductClick = (p: Product) => {
    setProdId(p.id);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price.toString());
    setProdSalePrice(p.salePrice ? p.salePrice.toString() : '');
    setProdStock(p.stock.toString());
    setProdImage(p.image);
    setProdImages(p.images);
    setProdSizes(p.sizes);
    setProdColors(p.colors);
    setProdCatId(p.categoryId);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;
    try {
      await apiRequest(`/products?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa sản phẩm');
    }
  };

  const resetProductForm = () => {
    setProdId(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdSalePrice('');
    setProdStock('');
    setProdImage('/images/1.png');
    setProdImages('/images/1.png');
    setProdSizes('Standard');
    setProdColors('Gray,Black');
    if (categories.length > 0) setProdCatId(categories[0].id);
    setShowProductModal(false);
  };

  // CRUD Danh mục
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (catId) {
        await apiRequest(`/categories?id=${catId}`, {
          method: 'PUT',
          body: JSON.stringify({ name: catName, icon: catIcon }),
        });
      } else {
        await apiRequest('/categories', {
          method: 'POST',
          body: JSON.stringify({ name: catName, icon: catIcon }),
        });
      }
      resetCategoryForm();
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu danh mục');
    }
  };

  const handleEditCategoryClick = (c: Category) => {
    setCatId(c.id);
    setCatName(c.name);
    setCatIcon(c.icon);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Xóa danh mục sẽ xóa tất cả sản phẩm liên quan. Đồng ý?')) return;
    try {
      await apiRequest(`/categories?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa danh mục');
    }
  };

  const resetCategoryForm = () => {
    setCatId(null);
    setCatName('');
    setCatIcon('sofa.svg');
    setShowCategoryModal(false);
  };

  // Xử lý đơn hàng
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`/orders?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật trạng thái đơn hàng');
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'PREPARING':
        return <span className="badge badge-preparing px-3 py-2 rounded-pill fw-semibold">Chuẩn bị</span>;
      case 'SHIPPING':
        return <span className="badge badge-shipping px-3 py-2 rounded-pill fw-semibold">Đang giao</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed px-3 py-2 rounded-pill fw-semibold">Đã giao</span>;
      case 'CANCELLED':
        return <span className="badge badge-cancelled px-3 py-2 rounded-pill fw-semibold">Đã hủy</span>;
      default:
        return <span className="badge bg-secondary text-white px-3 py-2 rounded-pill fw-semibold">{status}</span>;
    }
  };

  return (
    <div className="admin-dashboard-container text-start mx-auto w-100" style={{ fontFamily: '"Outfit", "Inter", sans-serif', maxWidth: '600px' }}>
      
      {/* TÍCH HỢP CSS ĐỘNG DÀNH RIÊNG CHO MOBILE & CHỮA LỖI TẦM NHÌN */}
      <style>{`
        .admin-dashboard-container {
          background-color: #080c14;
          color: #f1f5f9;
          min-height: 100vh;
          padding: 16px;
          padding-bottom: 80px;
        }
        .glass-card {
          background: rgba(19, 27, 47, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #white;
        }
        .stat-grad-revenue {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .stat-grad-orders {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        .stat-grad-products {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .stat-grad-categories {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .admin-nav-tabs {
          display: flex;
          overflow-x: auto;
          gap: 8px;
          padding-bottom: 8px;
          scrollbar-width: none;
        }
        .admin-tab-btn {
          white-space: nowrap;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 30px;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }
        .admin-tab-btn.active {
          color: #fff;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }
        .badge-preparing {
          background-color: rgba(245, 158, 11, 0.15) !important;
          color: #fbbf24 !important;
          border: 1px solid rgba(245, 158, 11, 0.25) !important;
        }
        .badge-shipping {
          background-color: rgba(59, 130, 246, 0.15) !important;
          color: #60a5fa !important;
          border: 1px solid rgba(59, 130, 246, 0.25) !important;
        }
        .badge-completed {
          background-color: rgba(16, 185, 129, 0.15) !important;
          color: #34d399 !important;
          border: 1px solid rgba(16, 185, 129, 0.25) !important;
        }
        .badge-cancelled {
          background-color: rgba(239, 68, 68, 0.15) !important;
          color: #f87171 !important;
          border: 1px solid rgba(239, 68, 68, 0.25) !important;
        }
        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
        }
        .admin-modal {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55);
          width: 92%;
          max-width: 500px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 24px;
          color: #f1f5f9;
        }
        .admin-input, .admin-select, .admin-textarea {
          background-color: #090d16 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f1f5f9 !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          font-size: 14px !important;
        }
        .admin-input:focus, .admin-select:focus, .admin-textarea:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
          outline: none;
        }
        .glow-btn-primary {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff;
          border: none;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
          transition: all 0.2s ease;
          border-radius: 30px;
          font-weight: 600;
          font-size: 13px;
        }
        .glow-btn-primary:hover {
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.5);
          transform: translateY(-1px);
        }
        .glow-btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #cbd5e1;
          transition: all 0.2s ease;
          border-radius: 30px;
          font-size: 13px;
        }
        .glow-btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #white;
        }
        .item-row-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .item-row-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(99, 102, 241, 0.2);
        }
      `}</style>

      {/* TOP HEADER BAR */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary rounded-3 p-1 text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '18px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>F</div>
          <div>
            <h5 className="m-0 fw-bold tracking-wide text-white" style={{ fontSize: '15px' }}>Fuzzy Admin</h5>
            <span className="text-muted d-block" style={{ fontSize: '10px' }}>Hệ thống quản trị Mobile</span>
          </div>
        </div>
        <Link to="/shop" className="btn glow-btn-outline btn-sm px-3 py-1">Quay lại Shop</Link>
      </div>

      {/* TAB SELECTOR NGANG (PHÙ HỢP HOÀN HẢO MÀN HÌNH DI ĐỘNG) */}
      <div className="admin-nav-tabs mb-3" style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap', gap: '8px', paddingBottom: '8px' }}>
        <button onClick={() => { setActiveTab('overview'); }} className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} style={{ flexShrink: 0 }}>Tổng quan</button>
        <button onClick={() => { setActiveTab('products'); }} className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`} style={{ flexShrink: 0 }}>Sản phẩm</button>
        <button onClick={() => { setActiveTab('categories'); }} className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`} style={{ flexShrink: 0 }}>Danh mục</button>
        <button onClick={() => { setActiveTab('orders'); }} className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`} style={{ flexShrink: 0 }}>
          Đơn hàng ({orders.length}) {pendingOrders > 0 && <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '9px', padding: '2px 5px' }}>{pendingOrders}</span>}
        </button>
        <button onClick={() => { setActiveTab('users'); }} className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`} style={{ flexShrink: 0 }}>
          Người dùng ({users.length})
        </button>
      </div>

      {/* LOADING INDICATOR */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
          <span className="ms-2 text-muted" style={{ fontSize: '12px' }}>Đang nạp dữ liệu...</span>
        </div>
      )}

      {/* 1. TAB TỔNG QUAN */}
      {activeTab === 'overview' && !loading && (
        <div className="d-flex flex-column">
          
          {/* STATS TIỆN ÍCH DẠNG LƯỚI MOBILE 2 CỘT */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <div className="glass-card p-3 d-flex align-items-center gap-2 mb-0" style={{ height: '80px' }}>
                <div className="stat-icon stat-grad-revenue" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                  <i className="iconsax" data-icon="empty-wallet" />
                </div>
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '9px', fontWeight: 600 }}>DOANH THU</span>
                  <h4 className="fw-bold text-white m-0" style={{ fontSize: '14px' }}>${totalRevenue.toLocaleString()}</h4>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="glass-card p-3 d-flex align-items-center gap-2 mb-0" style={{ height: '80px' }}>
                <div className="stat-icon stat-grad-orders" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                  <i className="iconsax" data-icon="document-copy" />
                </div>
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '9px', fontWeight: 600 }}>TỔNG ĐƠN HÀNG</span>
                  <h4 className="fw-bold text-white m-0" style={{ fontSize: '14px' }}>{orders.length}</h4>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="glass-card p-3 d-flex align-items-center gap-2 mb-0" style={{ height: '80px' }}>
                <div className="stat-icon stat-grad-products" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                  <i className="iconsax" data-icon="archive" />
                </div>
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '9px', fontWeight: 600 }}>SẢN PHẨM</span>
                  <h4 className="fw-bold text-white m-0" style={{ fontSize: '14px' }}>{products.length}</h4>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="glass-card p-3 d-flex align-items-center gap-2 mb-0" style={{ height: '80px' }}>
                <div className="stat-icon stat-grad-categories" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                  <i className="iconsax" data-icon="category" />
                </div>
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '9px', fontWeight: 600 }}>DANH MỤC</span>
                  <h4 className="fw-bold text-white m-0" style={{ fontSize: '14px' }}>{categories.length}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* ĐƠN HÀNG GẦN ĐÂY DẠNG CARD */}
          <div className="glass-card">
            <h4 className="fw-bold text-white mb-3" style={{ fontSize: '14px' }}>Đơn hàng gần đây</h4>
            
            <div className="d-flex flex-column gap-2">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-white" style={{ fontSize: '12px' }}>#{o.id.slice(-6).toUpperCase()}</span>
                    <span>{getOrderStatusBadge(o.status)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '11px' }}>{o.user?.name} | {new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="fw-bold text-white" style={{ fontSize: '13px' }}>${o.totalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. TAB SẢN PHẨM */}
      {activeTab === 'products' && !loading && (
        <div className="glass-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold m-0 text-white" style={{ fontSize: '14px' }}>Sản phẩm ({products.length})</h4>
            <button onClick={() => setShowProductModal(true)} className="btn glow-btn-primary px-3 py-1">+ Thêm mới</button>
          </div>

          <div className="d-flex flex-column">
            {products.map(p => (
              <div key={p.id} className="item-row-card">
                <img src={p.image} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/images/1.png' }} />
                <div className="flex-grow-1 min-width-0">
                  <h5 className="fw-semibold text-white m-0 text-truncate" style={{ fontSize: '13px' }}>{p.name}</h5>
                  <span className="text-muted" style={{ fontSize: '10px' }}>
                    Giá: ${p.salePrice || p.price} | Tồn: {p.stock}
                  </span>
                </div>
                <div className="d-flex gap-1">
                  <button onClick={() => handleEditProductClick(p)} className="btn glow-btn-outline btn-sm px-2 py-1" style={{ fontSize: '10px' }}>Sửa</button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1" style={{ fontSize: '10px' }}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB DANH MỤC */}
      {activeTab === 'categories' && !loading && (
        <div className="glass-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold m-0 text-white" style={{ fontSize: '14px' }}>Danh mục ({categories.length})</h4>
            <button onClick={() => setShowCategoryModal(true)} className="btn glow-btn-primary px-3 py-1">+ Thêm mới</button>
          </div>

          <div className="d-flex flex-column">
            {categories.map(c => (
              <div key={c.id} className="item-row-card">
                <div className="p-2 rounded bg-dark border border-secondary text-white" style={{ fontSize: '11px' }}>{c.icon}</div>
                <div className="flex-grow-1">
                  <h5 className="fw-semibold text-white m-0" style={{ fontSize: '13px' }}>{c.name}</h5>
                  <span className="text-muted" style={{ fontSize: '10px' }}>Slug: {c.slug}</span>
                </div>
                <div className="d-flex gap-1">
                  <button onClick={() => handleEditCategoryClick(c)} className="btn glow-btn-outline btn-sm px-2 py-1" style={{ fontSize: '10px' }}>Sửa</button>
                  <button onClick={() => handleDeleteCategory(c.id)} className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1" style={{ fontSize: '10px' }}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB ĐƠN HÀNG */}
      {activeTab === 'orders' && !loading && (
        <div className="glass-card">
          <h4 className="fw-bold mb-3 text-white" style={{ fontSize: '14px' }}>Danh sách đơn hàng ({orders.length})</h4>

          <div className="d-flex flex-column gap-3">
            {orders.map(o => (
              <div key={o.id} className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="d-flex justify-content-between align-items-start border-bottom border-secondary pb-2 mb-2">
                  <div>
                    <h5 className="fw-bold text-white m-0" style={{ fontSize: '12px' }}>Mã: #{o.id.slice(-8).toUpperCase()}</h5>
                    <span className="text-muted d-block" style={{ fontSize: '10px', marginTop: '2px' }}>Khách: {o.user?.name} | {new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="text-end">
                    <h4 className="fw-bold text-white m-0" style={{ fontSize: '14px' }}>${o.totalPrice}</h4>
                    <div className="mt-1">{getOrderStatusBadge(o.status)}</div>
                  </div>
                </div>

                {/* items list */}
                <div className="p-2 rounded-3 mb-2" style={{ backgroundColor: '#090d16' }}>
                  {o.items.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center text-muted" style={{ fontSize: '11px' }}>
                      <span>• {item.product?.name} x{item.quantity}</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Duyệt trạng thái đơn hàng */}
                <div className="d-flex flex-column gap-2 pt-2 border-top border-secondary">
                  <span className="text-muted" style={{ fontSize: '10px' }}>Cập nhật trạng thái:</span>
                  <div className="d-flex gap-1 flex-wrap">
                    <button onClick={() => handleUpdateOrderStatus(o.id, 'PREPARING')} className={`btn btn-sm px-2 py-1 rounded-pill ${o.status === 'PREPARING' ? 'btn-warning text-dark fw-bold' : 'glow-btn-outline'}`} style={{ fontSize: '9px' }}>Chuẩn bị</button>
                    <button onClick={() => handleUpdateOrderStatus(o.id, 'SHIPPING')} className={`btn btn-sm px-2 py-1 rounded-pill ${o.status === 'SHIPPING' ? 'btn-info text-dark fw-bold' : 'glow-btn-outline'}`} style={{ fontSize: '9px' }}>Giao hàng</button>
                    <button onClick={() => handleUpdateOrderStatus(o.id, 'COMPLETED')} className={`btn btn-sm px-2 py-1 rounded-pill ${o.status === 'COMPLETED' ? 'btn-success text-white fw-bold' : 'glow-btn-outline'}`} style={{ fontSize: '9px' }}>Xong</button>
                    <button onClick={() => handleUpdateOrderStatus(o.id, 'CANCELLED')} className={`btn btn-sm px-2 py-1 rounded-pill ${o.status === 'CANCELLED' ? 'btn-danger text-white fw-bold' : 'glow-btn-outline'}`} style={{ fontSize: '9px' }}>Hủy</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB NGƯỜI DÙNG (USER MANAGEMENT) */}
      {activeTab === 'users' && !loading && (
        <div className="glass-card">
          <h4 className="fw-bold mb-3 text-white" style={{ fontSize: '14px' }}>Quản lý người dùng ({users.length})</h4>

          <div className="d-flex flex-column gap-2">
            {users.length === 0 ? (
              <p className="text-muted text-center py-4">Chưa có người dùng nào đăng ký hệ thống.</p>
            ) : (
              users.map(u => (
                <div key={u.id} className="item-row-card p-3 rounded-3 d-flex align-items-center gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex' }}>
                  <img 
                    src={u.avatar || "/images/profile.png"} 
                    className="rounded-circle" 
                    style={{ width: '42px', height: '42px', objectFit: 'cover', flexShrink: 0 }} 
                    onError={(e) => { e.currentTarget.src = '/images/profile.png' }} 
                  />
                  <div className="flex-grow-1 min-width-0">
                    <h5 className="fw-semibold text-white m-0 text-truncate" style={{ fontSize: '13px' }}>{u.name}</h5>
                    <span className="text-muted d-block text-truncate" style={{ fontSize: '11px', marginTop: '2px' }}>{u.email}</span>
                    {u.phone && <span className="text-muted d-block" style={{ fontSize: '10px' }}>SĐT: {u.phone}</span>}
                  </div>
                  <div className="d-flex flex-column align-items-end gap-1">
                    <span className="text-muted" style={{ fontSize: '9px' }}>Tham gia: {new Date(u.createdAt).toLocaleDateString('vi-VN')}</span>
                    {u.email !== 'admin@gmail.com' ? (
                      <button 
                        onClick={() => handleDeleteUser(u.id)} 
                        className="btn btn-outline-danger btn-sm rounded-pill px-2 py-0" 
                        style={{ fontSize: '10px', height: '22px' }}
                      >
                        Xóa
                      </button>
                    ) : (
                      <span className="badge bg-primary text-white" style={{ fontSize: '9px' }}>Admin</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== MODAL CRUD SẢN PHẨM ===================== */}
      {showProductModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white m-0" style={{ fontSize: '14px' }}>{prodId ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={resetProductForm}></button>
            </div>
            
            <form onSubmit={handleSaveProduct}>
              <div className="mb-2">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Tên sản phẩm *</label>
                <input type="text" className="form-control admin-input" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
              </div>
              
              <div className="mb-2">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Mô tả sản phẩm *</label>
                <textarea className="form-control admin-textarea" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} required rows={2} />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-4">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Giá gốc ($) *</label>
                  <input type="number" step="0.01" className="form-control admin-input" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                </div>
                <div className="col-4">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Giá sale ($)</label>
                  <input type="number" step="0.01" className="form-control admin-input" value={prodSalePrice} onChange={(e) => setProdSalePrice(e.target.value)} />
                </div>
                <div className="col-4">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Tồn kho *</label>
                  <input type="number" className="form-control admin-input" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Danh mục sản phẩm *</label>
                <select className="form-select admin-select" value={prodCatId} onChange={(e) => setProdCatId(e.target.value)} required>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Đường dẫn ảnh chính *</label>
                <input type="text" className="form-control admin-input" value={prodImage} onChange={(e) => setProdImage(e.target.value)} required />
              </div>

              <div className="mb-2">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Các ảnh phụ (cách nhau bởi dấu phẩy)</label>
                <input type="text" className="form-control admin-input" value={prodImages} onChange={(e) => setProdImages(e.target.value)} />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Màu sắc (vd: Gray,Black)</label>
                  <input type="text" className="form-control admin-input" value={prodColors} onChange={(e) => setProdColors(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Kích thước (vd: Standard)</label>
                  <input type="text" className="form-control admin-input" value={prodSizes} onChange={(e) => setProdSizes(e.target.value)} />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="button" onClick={resetProductForm} className="btn glow-btn-outline w-50 py-2">Hủy</button>
                <button type="submit" className="btn glow-btn-primary w-50 py-2">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL CRUD DANH MỤC ===================== */}
      {showCategoryModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ width: '92%', maxWidth: '380px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white m-0" style={{ fontSize: '14px' }}>{catId ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục Mới'}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={resetCategoryForm}></button>
            </div>
            
            <form onSubmit={handleSaveCategory}>
              <div className="mb-2">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Tên danh mục *</label>
                <input type="text" className="form-control admin-input" value={catName} onChange={(e) => setCatName(e.target.value)} required />
              </div>
              
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '11px' }}>Icon danh mục (vd: sofa.svg) *</label>
                <input type="text" className="form-control admin-input" value={catIcon} onChange={(e) => setCatIcon(e.target.value)} required />
              </div>

              <div className="d-flex gap-2">
                <button type="button" onClick={resetCategoryForm} className="btn glow-btn-outline w-50 py-2">Hủy</button>
                <button type="submit" className="btn glow-btn-primary w-50 py-2">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
