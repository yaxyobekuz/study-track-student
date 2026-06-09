// Axios
import axios from "axios";

// MBSI Molia (CFO panel) API URL — bu o'quvchi paneliga emas, moliya bazasiga ulanadi.
const MOLIA_API_URL =
  import.meta.env.VITE_MOLIA_API_URL || "http://localhost:3000";

const moliaHttp = axios.create({
  baseURL: MOLIA_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const financeAPI = {
  // O'quvchining moliyaviy holatini ism bo'yicha oladi (qoldiq, to'lovlar).
  getMyFinance: (name) =>
    moliaHttp.get("/api/student-finance", { params: { name } }),
};
