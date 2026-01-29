export interface IProduct {
    id: number;
    name: string;
    picture: string;
    price: number;
    description: string;
  }
  
  export interface PaginatedProductsResponse {
    data: IProduct[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    education_start_date?: string;
    education_end_date?: string;
  }
  
  export interface AuthResponse {
    accessToken?: string;
    access_token?: string;
    user?: User;
    message?: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegistrationData {
    name: string;
    email: string;
    education_start_date: string;
    education_end_date: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
  }
  
  export interface ApiError {
    message: string;
    errors?: Record<string, string>;
  }