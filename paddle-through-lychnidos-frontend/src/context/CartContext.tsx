import { createContext, useEffect, useState, type ReactNode } from "react";

const CART_STORAGE_KEY = "cart";

export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  shopId: number;
  shopName: string;
}

export interface AddToCartProduct {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addToCart: (product: AddToCartProduct, shopId: number, shopName: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  clearShopItems: (shopId: number) => void;
  isInCart: (productId: number) => boolean;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(product: AddToCartProduct, shopId: number, shopName: string) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl,
          price: product.price,
          quantity: 1,
          shopId,
          shopName,
        },
      ];
    });
  }

  function removeFromCart(productId: number) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  }

  function clearCart() {
    setItems([]);
  }

  function clearShopItems(shopId: number) {
    setItems((current) => current.filter((item) => item.shopId !== shopId));
  }

  function isInCart(productId: number) {
    return items.some((item) => item.productId === productId);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearShopItems,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
