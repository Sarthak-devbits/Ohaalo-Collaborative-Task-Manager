import axios from "axios";
import { logout } from "../redux/slice/userSlice";
import { Store } from "@reduxjs/toolkit";


let store: Store;

export const injectStore = (_store: Store) => {
  store = _store;
};

const SERVER_URL = process.env.REACT_APP_API_URL;
const API_PATH = "api/v1";

const instance = axios.create({
  baseURL: `${SERVER_URL}/${API_PATH}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get the token
const getToken = () => {
  let token = localStorage.getItem("token");
  return token ? token.replace(/['"]+/g, "") : null;
};

// Add request interceptor for setting Authorization header
instance.interceptors.request.use((config) => {
  const token = getToken();
  const mainUrl = window.location.href;

  if (token && !(mainUrl.includes("token") && mainUrl.includes("expiry"))) {
    // Add the token to the Authorization header only if the conditions are met
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});


// Refresh token function
const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Call the refresh token API
    const response = await axios.post(
      `${SERVER_URL}/${API_PATH}/user/refresh-token`,
      {
        refreshToken: refreshToken.replace(/['"]+/g, ""),
      }
    );

    const { accessToken } = response?.data?.data;

    // Update tokens in localStorage
    localStorage.setItem("token", accessToken);

    return accessToken;
  } catch (error) {
    localStorage.clear();
    store.dispatch(logout());
    return null;
  }
};

// Add response interceptor for handling 498 status code

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 498 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const newToken = await refreshAuthToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            resolve(instance(originalRequest));
          } else {
            processQueue(new Error("Token refresh failed"), null);
            reject(error);
          }
        } catch (err) {
          processQueue(err, null);
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);


const axiosInstances = {
  instance,
};

export default axiosInstances;
