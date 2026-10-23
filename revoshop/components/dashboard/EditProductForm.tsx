"use client";

import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import { updateProduct, type ProductInput } from "@/lib/client-api";
import type { Category, Product } from "@/lib/types";

interface EditProductFormProps {
  product: Product;
  categories: Category[];
  onDone: () => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, categories, onDone, onCancel }: EditProductFormProps) {
  async function handleSubmit(input: ProductInput) {
    const updated = await updateProduct(product.id, input);
    toast.success(`${updated.name} updated`);
    onDone();
  }

  return (
    <ProductForm
      title="Edit product"
      subtitle={`Changes to #${product.id} apply to the shop right away.`}
      submitLabel="Save changes"
      pendingLabel="Saving"
      categories={categories}
      product={product}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
