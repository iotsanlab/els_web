import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { userStore } from "../store/UserStore";
import { refreshToken as refreshApiToken } from '../services/auth';

const baseURL = 'https://makinanerede.com:8080/api';

const client = axios.create({
  baseURL: baseURL,
});

client.interceptors.request.use(
  (config) => {
    const token = userStore.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = userStore.refreshToken;
        if (refreshToken) {
          const response = await refreshApiToken(refreshToken);
          const userData = {
            ...response,
            email: response.email ?? null,  // Eğer undefined ise null yap
          };
          userStore.setUser(userData);
          originalRequest.headers['Authorization'] = `Bearer ${response.token}`;
          return client(originalRequest);
        }
      } catch (err: any) {
        // Burada navigasyonu kaldırdık
        // Eğer token geçersizse, yönlendirme LoginPage'e yapılmalı ancak API katmanında yapılmamalı
        userStore.clearData(); // Token hatası ile login işlemi yapıyor private route kısmında
      }
    }
    return Promise.reject(error);
  }
);

const get = async (
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return client.get(endpoint, { ...config });
};

const post = async (
  endpoint: string,
  data: any = null,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return client.post(endpoint, data, { ...config });
};

const put = async (
  endpoint: string,
  data: any = null,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return client.put(endpoint, data, { ...config });
};

const del = async (
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return client.delete(endpoint, { ...config });
};

export { client, baseURL, get, post, put, del };
