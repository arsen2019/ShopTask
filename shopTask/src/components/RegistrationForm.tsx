import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "./FormatInput";
import { registrationSchema, type RegistrationFormData } from "../schemas/register.schema";



const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const fields = [
    {
      name: "name" as const,
      type: "text" as const,
      placeholder: "Name",
    },
    {
      name: "email" as const,
      type: "email" as const,
      placeholder: "Email",
    },
    {
      name: "education_start_date" as const,
      type: "date" as const,
      placeholder: "Education Start Date",
    },
    {
      name: "education_end_date" as const,
      type: "date" as const,
      placeholder: "Education End Date",
    },
    {
      name: "password" as const,
      type: "password" as const,
      placeholder: "Password",
    },
    {
      name: "password_confirmation" as const,
      type: "password" as const,
      placeholder: "Confirm Password",
    },
  ];

  const onSubmit = async (data: RegistrationFormData) => {
    setSubmitSuccess(false);
    setGeneralError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors) {
          Object.keys(responseData.errors).forEach((key) => {
            const formKey = key.replace(/_([a-z])/g, (g: string) => g[1].toUpperCase());
            setError(formKey as keyof RegistrationFormData, {
              type: "manual",
              message: responseData.errors[key],
            });
          });
        } else {
          setGeneralError(responseData.message || "Registration failed. Please try again.");
        }
      } else {
        if (responseData.accessToken || responseData.access_token) {
          const token = responseData.accessToken || responseData.access_token;
          localStorage.setItem("accessToken", token);

          if (responseData.user) {
            localStorage.setItem("user", JSON.stringify(responseData.user));
          }
        }

        setSubmitSuccess(true);
        reset();

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      setGeneralError("Network error. Please check your connection and try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Register
        </h2>

        {submitSuccess && (
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {fields.map((field) => (
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
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#792573] text-white py-2 px-4 rounded-md hover:bg-[#7925749f] focus:outline-none focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Registering..." : "Get Started"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;