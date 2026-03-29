import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "../services/api/axiosInstance";
import { Toaster } from "../utils/Toaster";
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      company: null,

      setAuth: (user, company) => {
        set({
          user: user,
          company: company,
        });
      },

      logOut: async (navigate) => {
        try {
          const res = await API.get("/auth/logout", { skipInterceptor: true });
          Toaster({ title: res.data.message, status: "success" });
          set({ user: null });
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/`;
        } catch (error) {
          set({ user: null });
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/`;
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
);