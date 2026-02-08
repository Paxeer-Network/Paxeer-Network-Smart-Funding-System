interface HttpClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  token?: string;
  apiKey?: string;
  timeout?: number;
  onRequest?: (config: RequestOptions) => RequestOptions | Promise<RequestOptions>;
  onResponse?: (response: Response) => Response | Promise<Response>;
  onError?: (error: ApiError) => void;
}

interface RequestOptions {
  method: string;
  path: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
}

import { ApiError } from './errors';

class HttpClient {
  private config: HttpClientConfig = {
    baseUrl: '',
  };

  configure(config: Partial<HttpClientConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async request<T>(options: RequestOptions): Promise<T> {
    let reqOptions = { ...options };

    // Run request interceptor
    if (this.config.onRequest) {
      reqOptions = await this.config.onRequest(reqOptions);
    }

    // Build URL
    let url = `${this.config.baseUrl}${reqOptions.path}`;
    if (reqOptions.query && Object.keys(reqOptions.query).length > 0) {
      const params = new URLSearchParams(reqOptions.query);
      url += `?${params.toString()}`;
    }

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...reqOptions.headers,
    };

    // Add auth
    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }
    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    // Build fetch options
    const fetchOptions: RequestInit = {
      method: reqOptions.method,
      headers,
    };

    if (
      reqOptions.body !== undefined &&
      reqOptions.method !== 'GET' &&
      reqOptions.method !== 'HEAD'
    ) {
      fetchOptions.body = JSON.stringify(reqOptions.body);
    }

    // Add timeout via AbortController
    const controller = new AbortController();
    fetchOptions.signal = controller.signal;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (this.config.timeout) {
      timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    }

    try {
      let response = await fetch(url, fetchOptions);

      if (timeoutId) clearTimeout(timeoutId);

      // Run response interceptor
      if (this.config.onResponse) {
        response = await this.config.onResponse(response);
      }

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text();
        }

        const error = new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorBody,
        );

        if (this.config.onError) {
          this.config.onError(error);
        }

        throw error;
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (response.status === 204 || !contentType) {
        return undefined as T;
      }

      if (contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        const timeoutError = new ApiError('Request timeout', 408);
        if (this.config.onError) {
          this.config.onError(timeoutError);
        }
        throw timeoutError;
      }

      const networkError = new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
      );
      if (this.config.onError) {
        this.config.onError(networkError);
      }
      throw networkError;
    }
  }
}

export const httpClient = new HttpClient();
