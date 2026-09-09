import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { shopService } from "../services/shopService";
import { useCart, type CartItem } from "../hooks/useCart";
import type { ShopDetail } from "../types";
import { toWhatsAppNumber } from "../utils/whatsapp";
import { Button } from "../components/Button";

interface ShopGroup {
  shopId: number;
  shopName: string;
  items: CartItem[];
}

function groupByShop(items: CartItem[]): ShopGroup[] {
  const groups = new Map<number, ShopGroup>();
  for (const item of items) {
    const existing = groups.get(item.shopId);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(item.shopId, { shopId: item.shopId, shopName: item.shopName, items: [item] });
    }
  }
  return Array.from(groups.values());
}

function buildInquiryMessage(items: CartItem[]): string {
  const lines = items.map((item) => `${item.productName} x${item.quantity}`).join(", ");
  return `Здраво! Ме интересираат следните производи: ${lines}. Дали се достапни?`;
}

function ShopCartGroup({
  group,
  shopDetail,
}: {
  group: ShopGroup;
  shopDetail: ShopDetail | undefined;
}) {
  const { updateQuantity, removeFromCart, clearShopItems } = useCart();
  const [showClearPrompt, setShowClearPrompt] = useState(false);

  const subtotal = group.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleContact() {
    const message = buildInquiryMessage(group.items);

    if (shopDetail?.phoneNumber) {
      window.open(
        `https://wa.me/${toWhatsAppNumber(shopDetail.phoneNumber)}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (shopDetail?.email) {
      window.location.href = `mailto:${shopDetail.email}?subject=${encodeURIComponent(
        "Прашање за производи",
      )}&body=${encodeURIComponent(message)}`;
    } else {
      // Neither contact method available - nothing to open, direct them
      // to the shop page for other options (address, socials, etc).
      return;
    }

    setShowClearPrompt(true);
  }

  const hasContactMethod = Boolean(shopDetail?.phoneNumber || shopDetail?.email);

  return (
    <div className="rounded-2xl border border-white/60 bg-white/55 p-4 shadow-lg shadow-primary-900/5 backdrop-blur-xl">
      <Link
        to={`/shop/${group.shopId}`}
        className="text-sm font-extrabold text-primary-900 hover:underline"
      >
        {group.shopName}
      </Link>

      <div className="mt-3 flex flex-col gap-2.5">
        {group.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <Link
              to={`/product/${item.productId}`}
              className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-primary-100"
            >
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary-500">
                  <ShoppingBag size={18} />
                </div>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link to={`/product/${item.productId}`} className="block">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {item.productName}
                </p>
                <p className="text-xs text-text-secondary">{item.price.toFixed(2)} MKD</p>
              </Link>
            </div>
            <div className="flex flex-none items-center gap-1.5">
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                aria-label="Decrease quantity"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-text-primary"
              >
                <Minus size={12} />
              </button>
              <span className="w-4 text-center text-xs font-bold text-text-primary">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                aria-label="Increase quantity"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-text-primary"
              >
                <Plus size={12} />
              </button>
              <button
                type="button"
                onClick={() => removeFromCart(item.productId)}
                aria-label={`Remove ${item.productName}`}
                className="flex h-7 w-7 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-text-secondary">
        Availability isn't guaranteed for handmade items - confirm quantity with the seller.
      </p>

      <div className="mt-2 flex items-center justify-between border-t border-border-default pt-3">
        <div>
          <p className="text-xs text-text-secondary">Estimated subtotal</p>
          <p className="text-sm font-bold text-text-primary">{subtotal.toFixed(2)} MKD</p>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-text-secondary">
        Prices are estimates - confirm final price and availability directly with the shop.
      </p>

      {hasContactMethod ? (
        <Button
          onClick={handleContact}
          className="mt-3 flex w-full items-center justify-center gap-2"
        >
          <MessageCircle size={16} />
          Contact {group.shopName}
        </Button>
      ) : (
        <Link
          to={`/shop/${group.shopId}`}
          className="mt-3 block rounded-xl border border-border-default px-4 py-2.5 text-center text-sm font-semibold text-text-primary"
        >
          View shop for other contact options
        </Link>
      )}

      {showClearPrompt && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-secondary-100 p-3">
          <p className="text-xs font-semibold text-secondary-900">
            Did you complete your inquiry? Clear these items from your list?
          </p>
          <div className="flex flex-none gap-2">
            <button
              type="button"
              onClick={() => setShowClearPrompt(false)}
              className="rounded-full border border-secondary-700 px-3 py-1.5 text-xs font-semibold text-secondary-900"
            >
              Keep
            </button>
            <button
              type="button"
              onClick={() => {
                clearShopItems(group.shopId);
                setShowClearPrompt(false);
              }}
              className="rounded-full bg-secondary-700 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CartPage() {
  const navigate = useNavigate();
  const { items } = useCart();
  const [shopDetails, setShopDetails] = useState<Record<number, ShopDetail>>({});

  const groups = groupByShop(items);

  useEffect(() => {
    const shopIds = Array.from(new Set(items.map((item) => item.shopId)));
    let cancelled = false;

    Promise.all(
      shopIds.map((shopId) =>
        shopService
          .getById(shopId)
          .then((shop) => ({ shopId, shop }))
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      const next: Record<number, ShopDetail> = {};
      for (const result of results) {
        if (result) next[result.shopId] = result.shop;
      }
      setShopDetails(next);
    });

    return () => {
      cancelled = true;
    };
    // Re-fetch whenever the set of shops represented in the cart changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((item) => item.shopId).join(",")]);

  const grandTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-svh pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/60 bg-white/55 text-primary-900 backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">My List</h1>
      </header>

      <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col gap-4 px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary-300/60 bg-white/40 p-8 text-center backdrop-blur-md">
            <ShoppingBag size={28} className="text-text-secondary" />
            <p className="text-sm text-text-secondary">
              Your list is empty - browse shops to add products you're interested in.
            </p>
            <div className="flex gap-2">
              <Link to="/home">
                <Button variant="outline">Go home</Button>
              </Link>
              <Link to="/map">
                <Button variant="outline">Explore map</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-primary-200/50 bg-primary-100/50 p-4 backdrop-blur-lg">
              <p className="text-xs font-semibold text-primary-900">
                Estimated total across all shops
              </p>
              <p className="text-xl font-extrabold text-primary-900">
                {grandTotal.toFixed(2)} MKD
              </p>
              <p className="mt-1 text-[11px] text-primary-900/80">
                This is a rough estimate, not a real order - confirm final pricing with each
                seller directly.
              </p>
            </div>

            {groups.map((group) => (
              <ShopCartGroup
                key={group.shopId}
                group={group}
                shopDetail={shopDetails[group.shopId]}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
