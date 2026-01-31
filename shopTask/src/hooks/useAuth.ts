import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/services/auth.service';
import type { AuthResponse, LoginCredentials, RegistrationData, ApiError } from '../types/api.types';
import { AxiosError } from 'axios';

export const useRegister = (
  options?: UseMutationOptions<AuthResponse, AxiosError<ApiError>, RegistrationData>
) => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, AxiosError<ApiError>, RegistrationData>({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const token = data.accessToken || data.access_token;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    },
    ...options,
  });
};

export const useLogin = (
  options?: UseMutationOptions<AuthResponse, AxiosError<ApiError>, LoginCredentials>
) => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, AxiosError<ApiError>, LoginCredentials>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const token = data.accessToken || data.access_token;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      
      navigate('/dashboard');
    },
    ...options,
  });
};

export const useLogout = (
  options?: UseMutationOptions<void, AxiosError<ApiError>, void>
) => {
  const navigate = useNavigate();

  return useMutation<void, AxiosError<ApiError>, void>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      
      navigate('/login');
    },
    onError: () => {
      localStorage.removeItem('accessToken');
      navigate('/login');
    },
    ...options,
  });
};