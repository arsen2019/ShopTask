import React from 'react';
import { type UseFormRegister,type FieldError,type FieldValues,type Path } from 'react-hook-form';

type FormInputProps<T extends FieldValues> = {
  type: React.HTMLInputTypeAttribute;
  name: Path<T>;
  placeholder?: string;
  error?: FieldError;
  register: UseFormRegister<T>;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export const FormInput = <T extends FieldValues>({
  type,
  name,
  placeholder,
  error,
  register,
  onFocus,
}: FormInputProps<T>) => {
  const isDate = type === 'date';

  return (
    <div>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name)}
        onFocus={onFocus}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${isDate ? 'text-gray-400' : 'text-gray-700'}
        `}
        style={isDate ? { colorScheme: 'light' } : undefined}
        aria-invalid={error ? 'true' : 'false'}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};