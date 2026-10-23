"use client";

import toast from "react-hot-toast";
import CategoryForm from "./CategoryForm";
import { updateCategory, type CategoryInput } from "@/lib/client-api";
import type { Category } from "@/lib/types";

interface EditCategoryFormProps {
  category: Category;
  onDone: () => void;
  onCancel: () => void;
}

export default function EditCategoryForm({ category, onDone, onCancel }: EditCategoryFormProps) {
  async function handleSubmit(input: CategoryInput) {
    const updated = await updateCategory(category.id, input);
    toast.success(`${updated.name} updated`);
    onDone();
  }

  return (
    <CategoryForm
      title="Edit category"
      subtitle={`Changes to #${category.id} apply to the shop right away.`}
      submitLabel="Save changes"
      pendingLabel="Saving"
      category={category}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
