import http from "@/shared/api/http";

export const authAPI = {
  register: (data) => http.post("/api/auth/register", data),
  login: (data) => http.post("/api/auth/login", data),
  getMe: () => http.get("/api/auth/me"),
};
