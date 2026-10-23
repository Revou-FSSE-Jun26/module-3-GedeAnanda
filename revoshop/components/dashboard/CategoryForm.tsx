"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { X } from "@phosphor-icons/react";
import FormAlert from "../FormAlert";
import SubmitButton from "../SubmitButton";
import { Field, inputClass, messageId, textareaClass } from "../FormField";
import type { CategoryInput } from "@/lib/client-api";
import { ApiError, errorMessage } from "@/lib/http";
import type { Category } from "@/lib/types";

interface FormValues {
  name: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = "Enter a category name.";
  else if (name.length < 2) errors.name = "Use at least 2 characters.";
  else if (name.length > 100) errors.name = "Keep the name under 100 characters.";

  if (values.description.trim().length > 300) errors.description = "Keep it under 300 characters.";

  return errors;
}

interface CategoryFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  pendingLabel: string;
  category?: Category;
  onSubmit: (input: CategoryInput) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({
  title,
  subtitle,
  submitLabel,
  pendingLabel,
  category,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [values, setValues] = useState<FormValues>({
    name: category?.name ?? "",
    description: category?.description ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
      await onSubmit({ name: values.name.trim(), description: values.description.trim() || null });
    } catch (error) {
      const message = errorMessage(error);
      // Duplicate name
      if (error instanceof ApiError && error.status === 409) {
        setErrors({ name: `${message}. Pick another name.` });
        const field = form.elements.namedItem("name");
        if (field instanceof HTMLElement) field.focus();
      } else {
        setFormError(message);
      }
      toast.error(message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="category-form-heading">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 id="category-form-heading" className="text-base font-bold text-ink">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-sunken hover:text-ink"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      <div className="space-y-4 px-5 py-5">
        {formError && <FormAlert>{formError}</FormAlert>}

        <Field id="name" label="Category name" error={errors.name}>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="e.g. Sports"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={messageId("name", errors.name)}
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <Field id="description" label="Description" error={errors.description} hint="Optional. Shown on the home banner.">
          <textarea
            id="description"
            name="description"
            rows={3}
            value={values.description}
            onChange={handleChange}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={messageId("description", errors.description, "hint")}
            className={textareaClass(Boolean(errors.description))}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-lg border border-line px-4 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-sunken hover:text-ink"
        >
          Cancel
        </button>
        <SubmitButton pending={pending} pendingLabel={pendingLabel} className="">
          {submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
