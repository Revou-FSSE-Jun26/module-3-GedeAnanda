"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
import FormAlert from "../FormAlert";
import SubmitButton from "../SubmitButton";
import { Field, inputClass, messageId } from "../FormField";
import { useAuth } from "@/hooks/useAuth";
import { errorMessage } from "@/lib/http";
import { isEmail } from "@/lib/validation";

interface LoginValues {
  email: string;
  password: string;
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

function validate(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};

  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!isEmail(values.email)) errors.email = "Enter a valid email, like name@example.com.";

  if (!values.password) errors.password = "Enter your password.";

  return errors;
}

export default function LoginForm() {
  const { login } = useAuth();
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);
    // Live after submit
    if (submitted) setErrors(validate(next));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const found = validate(values);
    setErrors(found);
    setSubmitted(true);
    setFormError(null);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      const field = form.elements.namedItem(firstInvalid);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setPending(true);
    try {
      const user = await login(values.email.trim(), values.password);
      toast.success(`Welcome back, ${user.username}!`);
    } catch (error) {
      setFormError(errorMessage(error));
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && <FormAlert>{formError}</FormAlert>}

      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          placeholder="name@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={messageId("email", errors.email)}
          className={inputClass(Boolean(errors.email))}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={messageId("password", errors.password)}
          className={inputClass(Boolean(errors.password))}
        />
      </Field>

      <SubmitButton pending={pending} pendingLabel="Logging in">
        Log in
      </SubmitButton>
    </form>
  );
}
