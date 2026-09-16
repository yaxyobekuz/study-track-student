// Axios
import axios from "axios";

// API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4040";

// Create an Axios instance
const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    // Qaysi panel — faollik va xavfsizlik bo'limlari shu sarlavha bilan
    // kanalni aniqlaydi (User-Agent panellarni ajrata olmaydi).
    "X-Client": "student",
  },
});

/** Brauzer xotirasidagi qurilma identifikatori kaliti. */
const DEVICE_ID_KEY = "deviceId";

let cachedDeviceId = null;

/**
 * QURILMA IDENTIFIKATORI — shu brauzer uchun bir marta yaratiladi.
 *
 * ⚠️ NIMA UCHUN KERAK: server qurilmani faqat "Chrome · Android" yorlig'i
 * bilan tanisa, ikkita turli telefon BITTA qurilma bo'lib ko'rinadi.
 * Identifikator bilan o'quvchi bir nechta qurilmada bemalol ishlaydi,
 * admin panel esa ularni alohida-alohida ko'radi.
 *
 * ⚠️ HECH QACHON XATO TASHLAMAYDI: xotira yopiq bo'lsa (maxfiy rejim)
 * sarlavha shunchaki yuborilmaydi — server eskicha ishlaydi.
 *
 * @returns {string|null}
 */
const getDeviceId = () => {
  if (cachedDeviceId) return cachedDeviceId;

  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);

    // Shakl serverdagi tekshiruv bilan AYNI (`request.helpers.js`)
    if (!/^[A-Za-z0-9_-]{16,64}$/.test(id || "")) {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      id = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(DEVICE_ID_KEY, id);
    }

    cachedDeviceId = id;
    return id;
  } catch {
    return null;
  }
};

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const deviceId = getDeviceId();
    if (deviceId) {
      config.headers["X-Device-Id"] = deviceId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default http;
