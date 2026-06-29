import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => {
  // Đọc dữ liệu khởi tạo từ localStorage
  const savedToken = localStorage.getItem('fuzzy_token');
  const savedUserJson = localStorage.getItem('fuzzy_user');
  let savedUser = null;
  try {
    if (savedUserJson) savedUser = JSON.parse(savedUserJson);
  } catch (e) {
    console.error('Lỗi phân tích cú pháp user từ localStorage', e);
  }

  return {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedToken,
    login: (user, token) => {
      localStorage.setItem('fuzzy_token', token);
      localStorage.setItem('fuzzy_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('fuzzy_token');
      localStorage.removeItem('fuzzy_user');
      set({ user: null, token: null, isAuthenticated: false });
    },
    updateUser: (updatedFields) => {
      set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...updatedFields };
        localStorage.setItem('fuzzy_user', JSON.stringify(updatedUser));
        return { user: updatedUser };
      });
    },
  };
});

// Lắng nghe sự kiện token hết hạn
if (typeof window !== 'undefined') {
  window.addEventListener('auth-expired', () => {
    useUserStore.getState().logout();
  });
}
