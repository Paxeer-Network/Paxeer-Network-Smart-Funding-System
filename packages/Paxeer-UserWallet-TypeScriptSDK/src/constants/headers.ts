/**
 * Common HTTP headers
 */
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  API_KEY: 'X-API-Key',
  USER_AGENT: 'User-Agent',
  ACCEPT_LANGUAGE: 'Accept-Language',
  CACHE_CONTROL: 'Cache-Control',
  IF_NONE_MATCH: 'If-None-Match',
  IF_MODIFIED_SINCE: 'If-Modified-Since',
} as const;

/**
 * Common content types
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
  OCTET_STREAM: 'application/octet-stream',
} as const;
