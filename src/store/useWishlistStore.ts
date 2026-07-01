import { create } from 'zustand';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => {
  // Đọc dữ liệu ban đầu từ localStorage
  const savedWishlistJson = localStorage.getItem('fuzzy_wishlist');
  let savedWishlist: WishlistItem[] = [];
  try {
    if (savedWishlistJson) savedWishlist = JSON.parse(savedWishlistJson);
  } catch (e) {
    console.error('Lỗi phân tích cú pháp wishlist từ localStorage', e);
  }

  return {
    items: savedWishlist,
    toggleWishlist: (item) => {
      set((state) => {
        const exists = state.items.some((i) => i.productId === item.productId);
        let updatedItems;
        if (exists) {
          updatedItems = state.items.filter((i) => i.productId !== item.productId);
        } else {
          updatedItems = [...state.items, item];
        }
        localStorage.setItem('fuzzy_wishlist', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    isInWishlist: (productId) => {
      return get().items.some((i) => i.productId === productId);
    },
    removeItem: (productId) => {
      set((state) => {
        const updatedItems = state.items.filter((i) => i.productId !== productId);
        localStorage.setItem('fuzzy_wishlist', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    clearWishlist: () => {
      localStorage.removeItem('fuzzy_wishlist');
      set({ items: [] });
    },
  };
});
