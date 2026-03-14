// Hooks personnalisés pour l'API
import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiResponse } from './api-service';

// Hook pour les requêtes GET avec cache
export function useApiQuery<T = any>(
  url: string,
  options?: {
    enabled?: boolean;
    cache?: boolean;
    ttl?: number;
    refetchInterval?: number;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!options?.enabled && options?.enabled === false) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Vérifier le cache d'abord
      if (options?.cache !== false) {
        const cached = await apiService.getCached<T>(url, options?.ttl);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }
      }

      const response = await apiService.get<T>(url);
      
      if (response.success && response.data) {
        setData(response.data);
        
        // Mettre en cache
        if (options?.cache !== false) {
          apiService.setCached(url, response.data);
        }
      } else {
        setError(response.message || 'Erreur lors de la récupération des données');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();

    // Configuration du rafraîchissement automatique
    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options?.refetchInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hook pour les mutations (POST, PUT, DELETE)
export function useApiMutation<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (
    method: 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse<T>;

      switch (method) {
        case 'post':
          response = await apiService.post<T>(url, data);
          break;
        case 'put':
          response = await apiService.put<T>(url, data);
          break;
        case 'patch':
          response = await apiService.patch<T>(url, data);
          break;
        case 'delete':
          response = await apiService.delete<T>(url);
          break;
        default:
          throw new Error('Méthode non supportée');
      }

      if (!response.success) {
        setError(response.message || 'Erreur lors de la mutation');
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mutate,
    loading,
    error,
  };
}

// Hook pour l'upload de fichiers
export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    url: string,
    file: File,
    chunked: boolean = false
  ): Promise<ApiResponse | null> => {
    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      let response: ApiResponse;

      if (chunked && file.size > 1024 * 1024) { // > 1MB
        response = await apiService.uploadChunkedFile(url, file, setProgress);
      } else {
        response = await apiService.uploadFile(url, file, setProgress);
      }

      if (!response.success) {
        setError(response.message || 'Erreur lors de l\'upload');
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
      return null;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  return {
    uploadFile,
    loading,
    progress,
    error,
  };
}

// Hook pour la pagination
export function usePaginatedQuery<T = any>(
  url: string,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPage = useCallback(async (pageNum: number = page, pageLimit: number = limit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.get<{
        data: T[];
        meta: {
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      }>(url, {
        params: {
          page: pageNum,
          limit: pageLimit,
        },
      });

      if (response.success && response.data) {
        setData(response.data.data);
        setTotal(response.data.meta.pagination.total);
        setTotalPages(response.data.meta.pagination.totalPages);
        setPage(response.data.meta.pagination.page);
        setLimit(response.data.meta.pagination.limit);
      } else {
        setError(response.message || 'Erreur lors de la récupération des données');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [url, page, limit]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      fetchPage(page + 1, limit);
    }
  }, [page, totalPages, limit, fetchPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      fetchPage(page - 1, limit);
    }
  }, [page, fetchPage]);

  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchPage(pageNum, limit);
    }
  }, [totalPages, limit, fetchPage]);

  const refresh = useCallback(() => {
    fetchPage(page, limit);
  }, [fetchPage, page, limit]);

  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    refresh,
    setLimit,
  };
}

// Hook pour la recherche avec debounce
export function useDebounceSearch<T = any>(
  searchFunction: (query: string) => Promise<ApiResponse<T[]>>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        setError(null);

        try {
          const response = await searchFunction(query);
          if (response.success && response.data) {
            setResults(response.data);
          } else {
            setError(response.message || 'Erreur lors de la recherche');
            setResults([]);
          }
        } catch (err: any) {
          setError(err.message || 'Erreur réseau');
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setError(null);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, searchFunction, delay]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
}

// Hook pour le health check de l'API
export function useApiHealth() {
  const [isOnline, setIsOnline] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiService.healthCheck();
        setIsOnline(true);
        setLastCheck(new Date());
      } catch (error) {
        setIsOnline(false);
        setLastCheck(new Date());
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Vérifier chaque minute

    return () => clearInterval(interval);
  }, []);

  return {
    isOnline,
    lastCheck,
  };
}

// Hook pour l'authentification
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        await checkAuth();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      // Forcer la déconnexion même en cas d'erreur
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
