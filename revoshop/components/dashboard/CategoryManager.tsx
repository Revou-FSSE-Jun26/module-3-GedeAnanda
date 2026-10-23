"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import Card from "../Card";
import Modal from "../Modal";
import ConfirmDelete from "./ConfirmDelete";
import CreateCategoryForm from "./CreateCategoryForm";
import EditCategoryForm from "./EditCategoryForm";
import { actionClass, primaryButtonClass, tableHeadClass } from "./styles";
import { deleteCategory } from "@/lib/client-api";
import { pluralize } from "@/lib/format";
import type { Category } from "@/lib/types";

type DialogState =
  | { type: "create" }
  | { type: "edit"; category: Category }
  | { type: "delete"; category: Category }
  | null;

interface CategoryManagerProps {
  categories: Category[];
  productCounts: Record<number, number>;
}

export default function CategoryManager({ categories, productCounts }: CategoryManagerProps) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [isRefreshing, startTransition] = useTransition();

  function handleDone() {
    setDialog(null);
    startTransition(() => router.refresh());
  }

  async function handleDelete(category: Category) {
    await deleteCategory(category.id);
    toast.success(`${category.name} deleted`);
    handleDone();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">Categories</h1>
          <p className="mt-0.5 text-sm text-muted">
            {pluralize(categories.length, "category", "categories")}
            {isRefreshing && <span className="text-subtle">, updating</span>}
          </p>
        </div>
        <button type="button" onClick={() => setDialog({ type: "create" })} className={primaryButtonClass}>
          <Plus size={16} weight="bold" aria-hidden />
          New category
        </button>
      </div>

      <Card padded={false} className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">All categories</caption>
          <thead className={tableHeadClass}>
            <tr>
              <th scope="col" className="px-4 py-3">
                Name
              </th>
              <th scope="col" className="px-4 py-3">
                Description
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Products
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-line transition-opacity duration-200 ${isRefreshing ? "opacity-60" : ""}`}>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{category.name}</p>
                  <p className="text-xs text-subtle">#{category.id}</p>
                </td>
                <td className="px-4 py-3 text-muted">
                  <p className="line-clamp-2 max-w-[44ch]">{category.description ?? "—"}</p>
                </td>
                <td className="px-4 py-3 text-right text-ink tabular-nums">{productCounts[category.id] ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setDialog({ type: "edit", category })}
                      aria-label={`Edit ${category.name}`}
                      className={`${actionClass} text-accent hover:bg-accent-soft`}
                    >
                      <PencilSimple size={16} aria-hidden />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDialog({ type: "delete", category })}
                      aria-label={`Delete ${category.name}`}
                      className={`${actionClass} text-danger hover:bg-danger-soft`}
                    >
                      <Trash size={16} aria-hidden />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="px-4 py-12 text-center text-sm text-muted">No categories yet.</p>}
      </Card>

      {dialog?.type === "create" && (
        <Modal labelledBy="category-form-heading" onClose={() => setDialog(null)}>
          <CreateCategoryForm onDone={handleDone} onCancel={() => setDialog(null)} />
        </Modal>
      )}

      {dialog?.type === "edit" && (
        <Modal labelledBy="category-form-heading" onClose={() => setDialog(null)}>
          <EditCategoryForm category={dialog.category} onDone={handleDone} onCancel={() => setDialog(null)} />
        </Modal>
      )}

      {dialog?.type === "delete" && (
        <Modal labelledBy="confirm-delete-heading" onClose={() => setDialog(null)}>
          <ConfirmDelete
            title="Delete this category?"
            message={`"${dialog.category.name}" will be removed for good.`}
            conflictHint="Move its products to another category, or delete them, before deleting this category."
            onConfirm={() => handleDelete(dialog.category)}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}
    </div>
  );
}
