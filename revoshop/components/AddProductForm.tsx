"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import type { Category, Product } from "@/lib/types";

interface AddProductFormProps {
  categories: Category[];
  onAddProduct: (product: Product) => void;
  onCancel?: () => void;
}

interface FormValues {
  name: string;
  price: string;
  stock: string;
  categoryId: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyValues: FormValues = { name: "", price: "", stock: "1", categoryId: "", description: "" };

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = "Enter a product name.";
  else if (name.length < 3) errors.name = "Use at least 3 characters.";
  else if (name.length > 100) errors.name = "Keep the name under 100 characters.";

  const price = Number(values.price);
  if (!values.price.trim()) errors.price = "Enter a price.";
  else if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be a number above 0.";

  const stock = Number(values.stock);
  if (!values.stock.trim()) errors.stock = "Enter how many are in stock.";
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number, 0 or more.";

  if (!values.categoryId) errors.categoryId = "Choose a category.";

  return errors;
}

const inputBase =
  "h-10 w-full rounded-lg border bg-surface px-3 text-sm text-ink transition-colors duration-150 placeholder:text-subtle focus:outline-none focus:ring-3";

function inputClass(hasError: boolean) {
  return `${inputBase} ${
    hasError
      ? "border-danger focus:border-danger focus:ring-danger/15"
      : "border-line hover:border-subtle/60 focus:border-accent focus:ring-accent/15"
  }`;
}

interface FieldProps {
  id: keyof FormValues;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-message`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-message`} className="text-xs text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function AddProductForm({ categories, onAddProduct, onCancel }: AddProductFormProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // Live after submit
    if (submitted) setErrors(validate(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setSubmitted(true);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      const field = event.currentTarget.elements.namedItem(firstInvalid);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    const now = new Date().toISOString();
    onAddProduct({
      // Local id
      id: -Date.now(),
      category_id: Number(values.categoryId),
      name: values.name.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description.trim() || null,
      is_active: true,
      created_at: now,
      updated_at: now,
    });

    setValues(emptyValues);
    setErrors({});
    setSubmitted(false);
  }

  const describedBy = (id: keyof FormValues, hasHint = false) =>
    errors[id] || hasHint ? `${id}-message` : undefined;

  function handleCancel() {
    setValues(emptyValues);
    setErrors({});
    setSubmitted(false);
    onCancel?.();
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="add-product-heading">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 id="add-product-heading" className="text-base font-bold text-ink">
            Add a product
          </h2>
          <p className="mt-0.5 text-sm text-muted">It joins the end of the list on this page. Saving to the API comes later.</p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-sunken hover:text-ink"
          >
            <X size={20} aria-hidden />
          </button>
        )}
      </div>

      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="name" label="Product name" error={errors.name}>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Linen Tote Bag"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy("name")}
              className={inputClass(Boolean(errors.name))}
            />
          </Field>
        </div>

        <Field id="price" label="Price (IDR)" error={errors.price}>
          <input
            id="price"
            name="price"
            type="number"
            inputMode="numeric"
            min={0}
            value={values.price}
            onChange={handleChange}
            placeholder="e.g. 125000"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={describedBy("price")}
            className={inputClass(Boolean(errors.price))}
          />
        </Field>

        <Field id="stock" label="Stock" error={errors.stock}>
          <input
            id="stock"
            name="stock"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={values.stock}
            onChange={handleChange}
            aria-invalid={Boolean(errors.stock)}
            aria-describedby={describedBy("stock")}
            className={inputClass(Boolean(errors.stock))}
          />
        </Field>

        <Field id="categoryId" label="Category" error={errors.categoryId}>
          <select
            id="categoryId"
            name="categoryId"
            value={values.categoryId}
            onChange={handleChange}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={describedBy("categoryId")}
            className={`${inputClass(Boolean(errors.categoryId))} ${values.categoryId ? "" : "text-subtle"}`}
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field id="description" label="Description" hint="Optional, one short sentence.">
          <input
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            aria-describedby={describedBy("description", true)}
            className={inputClass(false)}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="h-10 rounded-lg border border-line px-4 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-sunken hover:text-ink"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="h-10 rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
        >
          Add product
        </button>
      </div>
    </form>
  );
}
