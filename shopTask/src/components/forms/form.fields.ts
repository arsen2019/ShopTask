import type { LoginFormData } from "./form.types";
import { type RegistrationFormData, type Field } from "./form.types";

export const registrationFields: Field<RegistrationFormData>[] = [
  { name: "name", type: "text", placeholder: "Name" },
  { name: "email", type: "email", placeholder: "Email" },
  {
    name: "education_start_date",
    type: "date",
    placeholder: "Education Start Date",
  },
  {
    name: "education_end_date",
    type: "date",
    placeholder: "Education End Date",
  },
  { name: "password", type: "password", placeholder: "Password" },
  {
    name: "password_confirmation",
    type: "password",
    placeholder: "Confirm Password",
  },
];

export const loginFields: Field<LoginFormData>[] = [
  {
    name: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
  },
];
