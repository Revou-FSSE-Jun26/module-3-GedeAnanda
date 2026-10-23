"use client";

import toast from "react-hot-toast";
import CategoryForm from "./CategoryForm";
import { createCategory, type CategoryInput } from "@/lib/client-api";

interface CreateCategoryFormProps {
  onDone: () => void;
  onCancel: () => void;
}

export default function CreateCategoryForm({ onDone, onCancel }: CreateCategoryFormProps) {
  async function handleSubmit(input: CategoryInput) {
    const category = await createCategory(input);
    toast.success(`${category.name} created`);
    onDone();
  }

  return (
    <CategoryForm
      title="New category"
      subtitle="Group products so shoppers can find them faster."
      submitLabel="Create category"
      pendingLabel="Creating"
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
