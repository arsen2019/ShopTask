import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../../hooks/useAuth";
import { AxiosError } from "axios";
import type { ApiError } from "../../../types/api.types";
import { FormInput } from "./FormatInput";
import { type LoginFormData, loginSchema } from "../../../schemas/login.schema";
import { loginFields } from "../form.fields";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const loginMutation = useLogin({
    onError: (error: AxiosError<ApiError>) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          setError(key as keyof LoginFormData, {
            type: "manual",
            message: value,
          });
        });
      } else if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError(
          "Network error. Please check your connection and try again."
        );
      }
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError("");
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h2>

        {generalError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{generalError}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {loginFields.map((field) => (
            <FormInput
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              error={errors[field.name]}
              register={register}
            />
          ))}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[#792573] text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
