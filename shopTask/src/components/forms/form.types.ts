import type { Path } from "react-hook-form";

export type FieldType = "text" | "email" | "password" | "date";

export interface Field<T> {
  name: Path<T>;       
  type: FieldType;
  placeholder: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegistrationFormData {
    name: string;
    email: string;
    education_start_date: string; 
    education_end_date: string;   
    password: string;
    password_confirmation: string;
    terms: boolean;
}




