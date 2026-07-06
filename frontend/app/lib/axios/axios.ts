import axios from "axios";

const baseUrl = "http://localhost:8900";

export const http = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن لكل طلب بشكل ديناميكي
http.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      // 💡 التعديل هنا: نضمن إن التوكن نظيف من أي علامات تنصيص زائدة
      const cleanToken = token.replace(/['"]+/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (اختياري) interceptor للتعامل مع أخطاء الرد (مثل انتهاء صلاحية التوكن)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // ممكن هنا تعمل Logout تلقائي لو التوكن باظ
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);