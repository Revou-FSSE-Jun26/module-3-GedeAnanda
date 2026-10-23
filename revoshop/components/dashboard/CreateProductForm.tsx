"use client";

import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import { createProduct, type ProductInput } from "@/lib/client-api";
import type { Category } from "@/lib/types";

interface CreateProductFormProps {
  categories: Category[];
  onDone: () => void;
  onCancel: () => void;
}

export default function CreateProductForm({ categories, onDone, onCancel }: CreateProductFormProps) {
  async function handleSubmit(input: ProductInput) {
    const product = await createProduct(input);
    toast.success(`${product.name} created`);
    onDone();
  }

  return (
    <ProductForm
      title="New product"
      subtitle="It shows up in the shop as soon as you save."
      submitLabel="Create product"
      pendingLabel="Creating"
      categories={categories}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
