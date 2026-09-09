import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, BadgeCheck, ChevronLeft, Minus, Plus, ShoppingBag, Store } from "lucide-react";
import { productService } from "../services/productService";
import { getErrorMessage } from "../services/errorMessage";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import type { ProductDetail } from "../types";
import { Button } from "../components/Button";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddedToast, setShowAddedToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    productService
      .getById(Number(id))
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load this product."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!showAddedToast) return;
    const timer = setTimeout(() => setShowAddedToast(false), 2500);
    return () => clearTimeout(timer);
  }, [showAddedToast]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-text-secondary">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 px-4 text-center">
        <h1 className="text-2xl font-extrabold text-primary-900">Product not found</h1>
        <p className="text-text-secondary">{error ?? "This product could not be found."}</p>
        <Link to="/products" className="mt-2 text-sm font-semibold text-primary-800 underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const cartItem = items.find((item) => item.productId === product.id);

  function handleAdd() {
    if (!product) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    addToCart(
      { id: product.id, name: product.name, imageUrl: product.imageUrl, price: product.price },
      product.shopId,
      product.shopName,
    );
    setShowAddedToast(true);
  }

  return (
    <div className="min-h-svh pb-32">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/60 bg-white/55 text-primary-900 backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="truncate text-lg font-extrabold text-primary-900">{product.name}</h1>
      </header>

      <div className="mx-auto mt-4 flex w-full max-w-md flex-col gap-4 px-6">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-primary-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary-500">
              <ShoppingBag size={32} />
            </div>
          )}
        </div>

        <div>
          <p className="text-xl font-extrabold text-primary-900">
            {product.price.toFixed(2)} MKD
          </p>
          <Link
            to={`/shop/${product.shopId}`}
            className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-secondary-900"
          >
            <Store size={14} />
            {product.shopName}
            {product.shopIsVerified && (
              <span
                title="Verified artisan"
                aria-label="Verified artisan"
                className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary-700 text-white"
              >
                <BadgeCheck size={11} />
              </span>
            )}
          </Link>
        </div>

        {product.description && (
          <p className="text-sm text-text-secondary">{product.description}</p>
        )}

        {showAddedToast && (
          <p className="rounded-lg bg-secondary-100 px-3 py-2 text-sm font-semibold text-secondary-900">
            Added to your list
          </p>
        )}

        {cartItem ? (
          <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/55 p-4 backdrop-blur-md">
            <p className="text-sm font-semibold text-text-primary">In your list</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-text-primary"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-sm font-bold text-text-primary">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-text-primary"
              >
                <Plus size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                className="text-xs font-semibold text-nosija-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            Add to list
          </Button>
        )}

        <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs text-amber-700">
          <AlertCircle size={14} className="flex-none" />
          <span>Availability isn't guaranteed - confirm with the seller before your visit.</span>
        </div>
      </div>
    </div>
  );
}
