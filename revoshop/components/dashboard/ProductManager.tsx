"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import Card from "../Card";
import Modal from "../Modal";
import ConfirmDelete from "./ConfirmDelete";
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import { actionClass, primaryButtonClass, tableHeadClass } from "./styles";
import { deleteProduct } from "@/lib/client-api";
import { formatPrice, pluralize } from "@/lib/format";
import { getProductImage } from "@/lib/images";
import type { Category, Product } from "@/lib/types";

type DialogState =
  | { type: "create" }
  | { type: "edit"; product: Product }
  | { type: "delete"; product: Product }
  | null;

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
}

export default function ProductManager({ products, categories }: ProductManagerProps) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [isRefreshing, startTransition] = useTransition();
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  // Newest first
  const rows = [...products].sort((a, b) => b.id - a.id);

  function handleDone() {
    setDialog(null);
    startTransition(() => router.refresh());
  }

  async function handleDelete(product: Product) {
    await deleteProduct(product.id);
    toast.success(`${product.name} deleted`);
    handleDone();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">Products</h1>
          <p className="mt-0.5 text-sm text-muted">
            {pluralize(products.length, "product")}
            {isRefreshing && <span className="text-subtle">, updating</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ type: "create" })}
          className={primaryButtonClass}
        >
          <Plus size={16} weight="bold" aria-hidden />
          New product
        </button>
      </div>

      <Card padded={false} className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">All products</caption>
          <thead className={tableHeadClass}>
            <tr>
              <th scope="col" className="px-4 py-3">
                Product
              </th>
              <th scope="col" className="px-4 py-3">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Price
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Stock
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-line transition-opacity duration-200 ${isRefreshing ? "opacity-60" : ""}`}>
            {rows.map((product) => {
              const imageUrl = getProductImage(product);
              return (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-sunken">
                        {imageUrl && <Image src={imageUrl} alt="" fill sizes="40px" className="object-cover" />}
                      </span>
                      <div className="min-w-0">
                        <p className="max-w-[28ch] truncate font-medium text-ink">{product.name}</p>
                        <p className="text-xs text-subtle">#{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {(product.category_id !== null && categoryNames.get(product.category_id)) || "Uncategorized"}
                  </td>
                  <td className="px-4 py-3 text-right text-ink tabular-nums">{formatPrice(product.price)}</td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums ${product.stock === 0 ? "font-semibold text-danger" : "text-ink"}`}
                  >
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        product.is_active ? "bg-success-soft text-success" : "bg-sunken text-subtle"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setDialog({ type: "edit", product })}
                        aria-label={`Edit ${product.name}`}
                        className={`${actionClass} text-accent hover:bg-accent-soft`}
                      >
                        <PencilSimple size={16} aria-hidden />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDialog({ type: "delete", product })}
                        aria-label={`Delete ${product.name}`}
                        className={`${actionClass} text-danger hover:bg-danger-soft`}
                      >
                        <Trash size={16} aria-hidden />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-4 py-12 text-center text-sm text-muted">No products yet.</p>}
      </Card>

      {dialog?.type === "create" && (
        <Modal labelledBy="product-form-heading" onClose={() => setDialog(null)}>
          <CreateProductForm categories={categories} onDone={handleDone} onCancel={() => setDialog(null)} />
        </Modal>
      )}

      {dialog?.type === "edit" && (
        <Modal labelledBy="product-form-heading" onClose={() => setDialog(null)}>
          <EditProductForm
            product={dialog.product}
            categories={categories}
            onDone={handleDone}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}

      {dialog?.type === "delete" && (
        <Modal labelledBy="confirm-delete-heading" onClose={() => setDialog(null)}>
          <ConfirmDelete
            title="Delete this product?"
            message={`"${dialog.product.name}" will be removed from the shop for good.`}
            conflictHint="Products that appear in orders are kept for order history. Edit it and untick Active to hide it from the shop instead."
            onConfirm={() => handleDelete(dialog.product)}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}
    </div>
  );
}
