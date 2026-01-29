import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRegister } from "../../../hooks/useAuth";
import { AxiosError } from "axios";
import type { ApiError } from "../../../types/api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "./FormatInput";
import {
  registrationSchema,
  type RegistrationFormData,
} from "../../../schemas/register.schema";
import { registrationFields } from "../form.fields";

const RegistrationForm: React.FC = () => {
  const [generalError, setGeneralError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const registerMutation = useRegister({
    onError: (error: AxiosError<ApiError>) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          setError(key as keyof RegistrationFormData, {
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

  const onSubmit = async (data: RegistrationFormData) => {
    setGeneralError("");
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Register
        </h2>

        {registerMutation.isPending && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">
              Registration successful! Redirecting...
            </p>
          </div>
        )}

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
          {registrationFields.map((field) => (
            <FormInput
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              error={errors[field.name]}
              register={register}
            />
          ))}

          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                {...register("terms")}
                className={`mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.terms ? "border-red-500" : ""
                }`}
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the terms and conditions{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">
                {errors.terms.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-[#792573] text-white py-2 px-4 rounded-md hover:bg-[#7925749f] focus:outline-none focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {registerMutation.isPending ? "Registering..." : "Get Started"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
