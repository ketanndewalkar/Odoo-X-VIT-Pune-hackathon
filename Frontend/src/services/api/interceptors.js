// import axiosInstance from "./axiosInstance";
// import { Toaster } from "../../utils/Toaster";
// import API from "./axiosInstance";
// import { useAuthStore } from "../../stores/AuthStore";

// const logOut = useAuthStore.getState().logOut;
// axiosInstance.interceptors.response.use(
//   (res) => res,
//   async (err) => {

//     const originalRequest = err.config;

//     if (originalRequest?.skipInterceptor) {
//       return Promise.reject(err);
//     }
    
//     if ((err?.response?.data?.message === "Token expired" || err?.response?.data?.message === "Unauthorized") && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
        
//         await API.post("/auth/refresh-token",{skipInterceptor:true});
        
//         Toaster({ title: "Session Refreshed", status: "info" });

//         // retry original request
//         return axiosInstance(originalRequest);

//       } catch (error) {
//         if(error.response.status==400 || error.response.data.message=="relogin"){
//           logOut();
//         }
//         Toaster({
//           title: "Session Expired! Please Relogin",
//           status: "error"
//         });

//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(err);
//   }
// );