/**
 * Standard backend API response wrapper
 * All successful responses from the backend are wrapped in this structure
 */
export interface BackendResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

/**
 * Backend error response structure
 */
export interface BackendErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
