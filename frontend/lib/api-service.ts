import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, ApiResponse, ApiError } from './api-config';

// Service API principal
class ApiService {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.defaultHeaders,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor de requête
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Ajouter le token d'authentification
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Ajouter des headers CORS si nécessaire
        config.headers['Origin'] = API_CONFIG.appURL;

        // Log de la requête (en développement)
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de réponse
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log de la réponse (en développement)
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Log de l'erreur (en développement)
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error);
        }

        // Gestion du rafraîchissement du token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshToken();
            const newToken = this.getAuthToken();
            
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Échec du rafraîchissement, redirection vers login
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Gestion des erreurs réseau
        if (!error.response) {
          throw new Error(API_CONFIG.errors.networkError);
        }

        // Gestion des erreurs HTTP
        const { status, data } = error.response;
        let errorMessage = API_CONFIG.errors.serverError;

        switch (status) {
          case 400:
            errorMessage = data?.message || API_CONFIG.errors.validationError;
            break;
          case 401:
            errorMessage = API_CONFIG.errors.unauthorizedError;
            this.handleAuthError();
            break;
          case 403:
            errorMessage = API_CONFIG.errors.forbiddenError;
            break;
          case 404:
            errorMessage = API_CONFIG.errors.notFoundError;
            break;
          case 408:
          case 504:
            errorMessage = API_CONFIG.errors.timeoutError;
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = API_CONFIG.errors.serverError;
            break;
        }

        const apiError: ApiError = {
          message: errorMessage,
          status,
          data,
        };

        return Promise.reject(apiError);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await this.axiosInstance.post(API_CONFIG.endpoints.auth.refresh);
      const { token } = response.data;
      this.setAuthToken(token);
    } catch (error) {
      throw error;
    }
  }

  private handleAuthError(): void {
    this.removeAuthToken();
    if (typeof window !== 'undefined') {
      // Rediriger vers la page de login
      window.location.href = '/login';
    }
  }

  // Méthodes HTTP principales
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  // Upload de fichiers
  async uploadFile(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.axiosInstance.post(url, formData, config);
    return response.data;
  }

  // Upload de fichiers par chunks (pour les gros fichiers)
  async uploadChunkedFile(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse> {
    const chunkSize = API_CONFIG.chunkSize;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileId = `${Date.now()}-${file.name}`;
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileId', fileId);
      formData.append('fileName', file.name);
      formData.append('fileSize', file.size.toString());

      try {
        await this.axiosInstance.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (onProgress) {
          const progress = ((chunkIndex + 1) / totalChunks) * 100;
          onProgress(progress);
        }
      } catch (error) {
        // Retry logic
        let retries = 0;
        while (retries < API_CONFIG.maxRetries) {
          try {
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
            await this.axiosInstance.post(url, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            break;
          } catch (retryError) {
            retries++;
            if (retries >= API_CONFIG.maxRetries) {
              throw retryError;
            }
          }
        }
      }
    }

    // Finaliser l'upload
    const response = await this.axiosInstance.post(`${url}/complete`, {
      fileId,
      fileName: file.name,
      fileSize: file.size,
    });

    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.get(API_CONFIG.endpoints.health);
  }

  // Méthodes d'authentification
  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    const response = await this.post(API_CONFIG.endpoints.auth.login, credentials);
    const { token } = response.data;
    this.setAuthToken(token);
    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.post(API_CONFIG.endpoints.auth.logout);
    this.removeAuthToken();
    return response;
  }

  async register(userData: any): Promise<ApiResponse> {
    return this.post(API_CONFIG.endpoints.auth.register, userData);
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.get(API_CONFIG.endpoints.auth.me);
  }

  // Méthodes utilitaires
  getBaseURL(): string {
    return this.baseURL;
  }

  setBaseURL(url: string): void {
    this.baseURL = url;
    this.axiosInstance.defaults.baseURL = url;
  }

  // Configuration des headers
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers[key] = value;
  }

  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers[key];
  }

  // Gestion du cache
  private cache = new Map<string, { data: any; timestamp: number }>();

  async getCached<T = any>(url: string, ttl: number = API_CONFIG.cache.ttl): Promise<T | null> {
    if (!API_CONFIG.cache.enabled) {
      return null;
    }

    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    return null;
  }

  setCached(url: string, data: any): void {
    if (API_CONFIG.cache.enabled) {
      this.cache.set(url, { data, timestamp: Date.now() });
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export du service API singleton
export const apiService = new ApiService();
export default apiService;
