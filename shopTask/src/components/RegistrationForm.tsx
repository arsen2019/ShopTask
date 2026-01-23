import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  education_start_date: string;
  education_end_date: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  education_start_date?: string;
  education_end_date?: string;
  password?: string;
  password_confirmation?: string;
  terms?: string;
  general?: string;
}

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    education_start_date: '',
    education_end_date: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Education dates validation
    if (!formData.education_start_date) {
      newErrors.education_start_date = 'Education start date is required';
    }

    if (!formData.education_end_date) {
      newErrors.education_end_date = 'Education end date is required';
    }

    if (formData.education_start_date && formData.education_end_date) {
      if (new Date(formData.education_start_date) >= new Date(formData.education_end_date)) {
        newErrors.education_end_date = 'End date must be after start date';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
    }

    // Confirm password validation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    // Terms and conditions validation
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setErrors({});

    // Frontend validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const req = {
        name: formData.name,
        email: formData.email,
        education_start_date: formData.education_start_date,
        education_end_date: formData.education_end_date,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        terms: formData.terms,
      }
      console.log(req)
      const response = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const apiErrors: FormErrors = {};
          Object.keys(data.errors).forEach((key) => {
            const formKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            apiErrors[formKey as keyof FormErrors] = data.errors[key];
          });
          setErrors(apiErrors);
        } else {
          setErrors({ general: data.message || 'Registration failed. Please try again.' });
        }
      } else {
        if (data.accessToken || data.access_token) {
          const token = data.accessToken || data.access_token;
          localStorage.setItem('accessToken', token);
          
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }

        setSubmitSuccess(true);
        
        setFormData({
          name: '',
          email: '',
          education_start_date: '',
          education_end_date: '',
          password: '',
          password_confirmation: '',
          terms: false,
        });

        setTimeout(() => {
          navigate('/dashboard'); 
        }, 1500);
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register</h2>

        {submitSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">Registration successful! Redirecting...</p>
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <input
              type="date"
              id="education_start_date"
              name="education_start_date"
              placeholder='Education Start Date'
              value={formData.education_start_date}
              onChange={handleChange}
              onFocus={(e) => e.target.showPicker?.()}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 ${
                errors.education_start_date ? 'border-red-500' : 'border-gray-300'
              } ${!formData.education_start_date ? 'text-gray-400' : ''}`}
              style={{ colorScheme: 'light' }}
            />
            {errors.education_start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.education_start_date}</p>
            )}
          </div>

          <div>
            <input
              type="date"
              id="education_end_date"
              name="education_end_date"
              placeholder='Education End Date'  
              value={formData.education_end_date}
              onChange={handleChange}
              onFocus={(e) => e.target.showPicker?.()}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 ${
                errors.education_end_date ? 'border-red-500' : 'border-gray-300'
              } ${!formData.education_end_date ? 'text-gray-400' : ''}`}
              style={{ colorScheme: 'light' }}
            />
            {errors.education_end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.education_end_date}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
            )}
          </div>

          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className={`mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.terms ? 'border-red-500' : ''
                }`}
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the terms and conditions <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#792573] text-white py-2 px-4 rounded-md hover:bg-[#7925749f] focus:outline-none  focus:ring-blue-500  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Registering...' : 'Get Started'}
          </button>

          {/* <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Login here
              </button>
            </p>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;