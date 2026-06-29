const API_BASE = 'http://localhost:3000/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('fuzzy_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Tự động xóa token và chuyển hướng nếu hết hạn
    localStorage.removeItem('fuzzy_token');
    localStorage.removeItem('fuzzy_user');
    window.dispatchEvent(new Event('auth-expired'));
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Yêu cầu thất bại với mã lỗi ${response.status}`);
  }

  return response.json();
}
