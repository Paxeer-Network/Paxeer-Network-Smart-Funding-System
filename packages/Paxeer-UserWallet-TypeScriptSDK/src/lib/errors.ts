/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly response?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /** Check if error is a client error (4xx) */
  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /** Check if error is a server error (5xx) */
  get isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /** Check if error is a network error */
  get isNetworkError(): boolean {
    return this.statusCode === 0;
  }

  /** Check if error is a timeout */
  get isTimeout(): boolean {
    return this.statusCode === 408;
  }

  /** Check if error is unauthorized */
  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /** Check if error is forbidden */
  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /** Check if error is not found */
  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      response: this.response,
    };
  }
}

/**
 * Validation error
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly errors: string[],
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
