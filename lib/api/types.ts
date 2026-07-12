export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  source: "campaign" | "default" | "checkout";
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
}

export interface CustomerAuthData {
  user: CustomerProfile;
  tokens: AuthTokens;
}

export interface AdminAuthData {
  user: AdminProfile;
  tokens: AuthTokens;
}
