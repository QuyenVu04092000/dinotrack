export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
