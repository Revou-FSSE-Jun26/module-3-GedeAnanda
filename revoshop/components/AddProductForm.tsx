"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import Card from "./Card";
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
  "h-11 w-full rounded-full border bg-surface px-4 text-sm text-ink transition-colors duration-200 placeholder:text-subtle focus:outline-none focus:ring-3";

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
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // Re-check live only after the first submit, so the form does not shout while typing.
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
      // Negative ids never collide with API ids and mark the product as local.
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

    setLastAdded(values.name.trim());
    setValues(emptyValues);
    setErrors({});
    setSubmitted(false);
  }

  const describedBy = (id: keyof FormValues, hasHint = false) =>
    errors[id] || hasHint ? `${id}-message` : undefined;

  return (
    <Card as="section" aria-labelledby="add-product-heading" className="motion-safe:animate-rise">
      <h2 id="add-product-heading" className="text-lg font-semibold tracking-tight">
        Add a product
      </h2>
      <p className="mt-1 max-w-[60ch] text-sm text-muted">
        New products join the end of the list below. They stay on this page and are not saved to the API yet.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
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

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition-[background-color,transform] duration-200 hover:bg-accent-hover active:scale-[0.98]"
          >
            Add product
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-muted transition-colors duration-200 hover:bg-sunken hover:text-ink"
            >
              Close
            </button>
          )}
          {lastAdded && (
            <p role="status" className="inline-flex items-center gap-2 text-sm text-on-accent-soft">
              <CheckCircle size={18} weight="fill" aria-hidden />
              Added &ldquo;{lastAdded}&rdquo; to the list.
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}
