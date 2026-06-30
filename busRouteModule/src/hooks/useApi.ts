import { BaseUrl } from '@api/baseUrl';
import { HttpMethod } from 'src/types/types';
import { useState, useCallback, useEffect, useRef } from 'react';

export type RequestOptions = {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: BodyInit | null;
};

export type UseApiConfig<T> = {
  autoLoad?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export interface UseApiReturn<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function buildUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const base = BaseUrl.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}`;
}

export const useApi = <T = unknown>(
  url: string,
  options?: RequestOptions,
  config?: UseApiConfig<T>
): UseApiReturn<T> => {
  const { autoLoad = true, onSuccess, onError } = config || {};

  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Refs для хранения актуальных значений, чтобы не включать их в зависимости useCallback
  const optionsRef = useRef(options);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Обновляем рефы при каждом рендере (но это не вызывает пересоздание execute)
  useEffect(() => {
    optionsRef.current = options;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  const execute = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const currentOptions = optionsRef.current || {};
      const fetchOptions: RequestInit = {
        method: currentOptions.method || 'GET',
        headers: currentOptions.headers,
        body: currentOptions.body,
        signal: abortController.signal,
      };

      const response = await fetch(buildUrl(url), fetchOptions);

      if (abortController.signal.aborted) return;

      if (!response.ok) {
        let errorMessage = `HTTP error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }

      const result: T = await response.json();

      if (!mountedRef.current || abortController.signal.aborted) return;

      setData(result);
      onSuccessRef.current?.(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (!mountedRef.current) return;

      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onErrorRef.current?.(errorObj);
    } finally {
      if (mountedRef.current && !abortController.signal.aborted) {
        setLoading(false);
      }
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [url]); // Единственная зависимость — url. Всё остальное берётся из рефов.

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    mountedRef.current = true;
    if (autoLoad) {
      execute();
    }
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoLoad, execute]); // execute стабилен (меняется только при изменении url)

  return { data, loading, error, refetch };
};