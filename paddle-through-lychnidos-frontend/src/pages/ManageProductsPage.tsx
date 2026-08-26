import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { productService } from "../services/productService";
import { getErrorMessage } from "../services/errorMessage";
import type { ProductListItem } from "../types";
import { Button } from "../components/Button";

function ProductRow({
  product,
  shopId,
  onDelete,
}: {
  product: ProductListItem;
  shopId: number;
  onDelete: () => void;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await productService.remove(product.id);
      onDelete();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card p-3">
      <div className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-primary-100">
        {product.imageUrl && (
          <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-text-primary">{product.name}</p>
        <p className="text-xs text-text-secondary">{product.price.toFixed(2)} MKD</p>
      </div>

      {isConfirming ? (
        <div className="flex flex-none items-center gap-1.5">
          <span className="text-xs text-text-secondary">Delete?</span>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="rounded-full bg-nosija-red-700 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50"
          >
            {isDeleting ? "..." : "Yes"}
          </button>
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            className="rounded-full border border-border-default px-2.5 py-1 text-xs font-semibold text-text-secondary"
          >
            No
          </button>
        </div>
      ) : (
        <div className="flex flex-none items-center gap-1">
          <Link
            to={`/artisan/shops/${shopId}/products/${product.id}/edit`}
            aria-label={`Edit ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            onClick={() => setIsConfirming(true)}
            aria-label={`Delete ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export function ManageProductsPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    productService
      .getByShopId(Number(shopId))
      .then((items) => {
        if (!cancelled) setProducts(items);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load your products."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shopId]);

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-extrabold text-primary-900">Manage Products</h1>
        </div>
        <Link to={`/artisan/shops/${shopId}/products/new`}>
          <Button className="!px-3 !py-2">
            <Plus size={16} />
          </Button>
        </Link>
      </header>

      <div className="mt-6 flex flex-col gap-2.5 px-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading your products...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default p-8 text-center">
            <Package size={24} className="text-text-secondary" />
            <p className="text-sm text-text-secondary">
              You haven't added any products yet.
            </p>
            <Link to={`/artisan/shops/${shopId}/products/new`}>
              <Button>Add Product</Button>
            </Link>
          </div>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              shopId={Number(shopId)}
              onDelete={() =>
                setProducts((current) => current.filter((p) => p.id !== product.id))
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
