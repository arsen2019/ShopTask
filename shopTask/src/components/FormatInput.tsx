import React from 'react';

type FormInputProps = {
  type: React.HTMLInputTypeAttribute;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  value,
  placeholder,
  error,
  onChange,
  onFocus,
}) => {
  const isDate = type === 'date';

  return (
    <div>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${isDate && !value ? 'text-gray-400' : 'text-gray-700'}
        `}
        style={isDate ? { colorScheme: 'light' } : undefined}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
