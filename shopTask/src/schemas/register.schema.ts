import { z } from "zod";

export const registrationSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    education_start_date: z.string().min(1, "Education start date is required"),
    education_end_date: z.string().min(1, "Education end date is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*\d)/, "Password must contain at least one number"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),
  })
  .refine(
    (data) => {
      if (data.education_start_date && data.education_end_date) {
        return (
          new Date(data.education_start_date) <
          new Date(data.education_end_date)
        );
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["education_end_date"],
    }
  )
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

