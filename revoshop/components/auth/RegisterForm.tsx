"use client";

import { useLayoutEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
import FormAlert from "../FormAlert";
import SubmitButton from "../SubmitButton";
import { Field, inputClass, messageId } from "../FormField";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, errorMessage } from "@/lib/http";
import { isEmail } from "@/lib/validation";

interface RegisterValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>;

const MIN_PASSWORD = 8;

function validate(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {};

  const username = values.username.trim();
  if (!username) errors.username = "Enter a username.";
  else if (username.length < 3) errors.username = "Use at least 3 characters.";
  else if (username.length > 50) errors.username = "Keep it under 50 characters.";

  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!isEmail(values.email)) errors.email = "Enter a valid email, like name@example.com.";

  if (!values.password) errors.password = "Create a password.";
  else if (values.password.length < MIN_PASSWORD) errors.password = `Use at least ${MIN_PASSWORD} characters.`;

  if (!values.confirmPassword) errors.confirmPassword = "Type your password again.";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match.";

  return errors;
}

const emptyValues: RegisterValues = { username: "", email: "", password: "", confirmPassword: "" };

export default function RegisterForm() {
  const { register } = useAuth();
  const [values, setValues] = useState<RegisterValues>(emptyValues);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Clear on leave
  useLayoutEffect(
    () => () => {
      setValues((current) => ({ ...current, password: "", confirmPassword: "" }));
      setFormError(null);
    },
    [],
  );

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
      const user = await register(values.username.trim(), values.email.trim(), values.password);
      toast.success(`Account created. Welcome, ${user.username}!`);
    } catch (error) {
      // Email taken
      if (error instanceof ApiError && error.status === 409) {
        setErrors({ email: `${error.message}. Log in instead, or use another email.` });
        const field = form.elements.namedItem("email");
        if (field instanceof HTMLElement) field.focus();
      } else {
        setFormError(errorMessage(error));
      }
      setPending(false);
    }
  }

  const field = (id: keyof RegisterValues) => ({
    id,
    name: id,
    value: values[id],
    onChange: handleChange,
    "aria-invalid": Boolean(errors[id]),
    className: inputClass(Boolean(errors[id])),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && <FormAlert>{formError}</FormAlert>}

      <Field id="username" label="Username" error={errors.username}>
        <input
          {...field("username")}
          autoComplete="nickname"
          placeholder="e.g. Nanda"
          aria-describedby={messageId("username", errors.username)}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email}>
        <input
          {...field("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          aria-describedby={messageId("email", errors.email)}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password} hint={`At least ${MIN_PASSWORD} characters.`}>
        <PasswordInput
          {...field("password")}
          autoComplete="new-password"
          aria-describedby={messageId("password", errors.password, "hint")}
        />
      </Field>

      <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
        <PasswordInput
          {...field("confirmPassword")}
          autoComplete="new-password"
          aria-describedby={messageId("confirmPassword", errors.confirmPassword)}
        />
      </Field>

      <SubmitButton pending={pending} pendingLabel="Creating account">
        Create account
      </SubmitButton>
    </form>
  );
}
