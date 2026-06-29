import { create } from 'zustand';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => {
  // Đọc dữ liệu giỏ hàng khởi tạo từ localStorage
  const savedCartJson = localStorage.getItem('fuzzy_cart');
  let savedCart: CartItem[] = [];
  try {
    if (savedCartJson) savedCart = JSON.parse(savedCartJson);
  } catch (e) {
    console.error('Lỗi phân tích cú pháp giỏ hàng từ localStorage', e);
  }

  return {
    items: savedCart,
    addItem: (newItem) => {
      set((state) => {
        const existingIndex = state.items.findIndex(
          (item) =>
            item.productId === newItem.productId &&
            item.size === newItem.size &&
            item.color === newItem.color
        );

        let updatedItems;
        if (existingIndex > -1) {
          updatedItems = [...state.items];
          updatedItems[existingIndex].quantity += newItem.quantity;
        } else {
          updatedItems = [...state.items, newItem];
        }

        localStorage.setItem('fuzzy_cart', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    removeItem: (productId, size, color) => {
      set((state) => {
        const updatedItems = state.items.filter(
          (item) =>
            !(item.productId === productId && item.size === size && item.color === color)
        );
        localStorage.setItem('fuzzy_cart', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    updateQuantity: (productId, size, color, quantity) => {
      set((state) => {
        if (quantity <= 0) {
          const updatedItems = state.items.filter(
            (item) =>
              !(item.productId === productId && item.size === size && item.color === color)
          );
          localStorage.setItem('fuzzy_cart', JSON.stringify(updatedItems));
          return { items: updatedItems };
        }

        const updatedItems = state.items.map((item) => {
          if (item.productId === productId && item.size === size && item.color === color) {
            return { ...item, quantity };
          }
          return item;
        });

        localStorage.setItem('fuzzy_cart', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    clearCart: () => {
      localStorage.removeItem('fuzzy_cart');
      set({ items: [] });
    },
    getTotalPrice: () => {
      return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  };
});
