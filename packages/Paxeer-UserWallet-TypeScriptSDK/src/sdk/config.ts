export interface SDKConfig {
  /** Base URL for the API */
  baseUrl: string;
  /** Default headers to include in every request */
  headers?: Record<string, string>;
  /** Authentication token (Bearer) */
  token?: string;
  /** API key for authentication */
  apiKey?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Request interceptor */
  onRequest?: (config: RequestOptions) => RequestOptions | Promise<RequestOptions>;
  /** Response interceptor */
  onResponse?: (response: Response) => Response | Promise<Response>;
  /** Error interceptor */
  onError?: (error: SDKError) => void;
}

export interface RequestOptions {
  method: string;
  path: string;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string>;
}

export class SDKError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly response?: unknown,
  ) {
    super(message);
    this.name = 'SDKError';
  }
}
