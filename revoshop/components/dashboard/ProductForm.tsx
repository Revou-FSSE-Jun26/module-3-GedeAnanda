"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { X } from "@phosphor-icons/react";
import FormAlert from "../FormAlert";
import SubmitButton from "../SubmitButton";
import { Field, inputClass, messageId, textareaClass } from "../FormField";
import type { ProductInput } from "@/lib/client-api";
import { errorMessage } from "@/lib/http";
import type { Category, Product } from "@/lib/types";

interface FormValues {
  name: string;
  price: string;
  stock: string;
  categoryId: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function toValues(product?: Product): FormValues {
  if (!product) return { name: "", price: "", stock: "1", categoryId: "", description: "", imageUrl: "", isActive: true };
  return {
    name: product.name,
    price: String(product.price),
    stock: String(product.stock),
    categoryId: product.category_id ? String(product.category_id) : "",
    description: product.description ?? "",
    imageUrl: product.image_url ?? "",
    isActive: product.is_active,
  };
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

// Real image check
function canLoadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new window.Image();
    const timer = setTimeout(() => resolve(false), 10_000);
    image.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };
    image.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    image.src = url;
  });
}

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

  if (values.description.trim().length > 500) errors.description = "Keep it under 500 characters.";

  const imageUrl = values.imageUrl.trim();
  if (imageUrl && !isHttpsUrl(imageUrl)) errors.imageUrl = "Use a full https:// link to an image.";
  else if (imageUrl.length > 500) errors.imageUrl = "Keep the link under 500 characters.";

  return errors;
}

interface ProductFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  pendingLabel: string;
  categories: Category[];
  product?: Product;
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  title,
  subtitle,
  submitLabel,
  pendingLabel,
  categories,
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(() => toValues(product));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    const isCheckbox = event.target instanceof HTMLInputElement && event.target.type === "checkbox";
    const next = { ...values, [name]: isCheckbox ? (event.target as HTMLInputElement).checked : value };
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
    const imageUrl = values.imageUrl.trim();
    if (imageUrl && !(await canLoadImage(imageUrl))) {
      setErrors({ imageUrl: "This link does not open an image. Right-click the photo and choose Copy image address." });
      const field = form.elements.namedItem("imageUrl");
      if (field instanceof HTMLElement) field.focus();
      setPending(false);
      return;
    }

    try {
      await onSubmit({
        name: values.name.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
        category_id: Number(values.categoryId),
        description: values.description.trim() || null,
        image_url: imageUrl || null,
        is_active: values.isActive,
      });
    } catch (error) {
      const message = errorMessage(error);
      setFormError(message);
      toast.error(message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="product-form-heading">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 id="product-form-heading" className="text-base font-bold text-ink">
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

      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
        {formError && (
          <div className="sm:col-span-2">
            <FormAlert>{formError}</FormAlert>
          </div>
        )}

        <div className="sm:col-span-2">
          <Field id="name" label="Product name" error={errors.name}>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Linen Tote Bag"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={messageId("name", errors.name)}
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
            aria-describedby={messageId("price", errors.price)}
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
            aria-describedby={messageId("stock", errors.stock)}
            className={inputClass(Boolean(errors.stock))}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field id="categoryId" label="Category" error={errors.categoryId}>
            <select
              id="categoryId"
              name="categoryId"
              value={values.categoryId}
              onChange={handleChange}
              aria-invalid={Boolean(errors.categoryId)}
              aria-describedby={messageId("categoryId", errors.categoryId)}
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
        </div>

        <div className="sm:col-span-2">
          <Field id="description" label="Description" error={errors.description} hint="Optional.">
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

        <div className="sm:col-span-2">
          <Field id="imageUrl" label="Image URL" error={errors.imageUrl} hint="Optional. A direct https:// link to a photo.">
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              inputMode="url"
              value={values.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              aria-invalid={Boolean(errors.imageUrl)}
              aria-describedby={messageId("imageUrl", errors.imageUrl, "hint")}
              className={inputClass(Boolean(errors.imageUrl))}
            />
          </Field>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            checked={values.isActive}
            onChange={handleChange}
            className="size-4 accent-accent"
          />
          Active, visible for sale in the shop
        </label>
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
