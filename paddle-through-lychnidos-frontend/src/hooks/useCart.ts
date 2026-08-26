import { useContext } from "react";
import { CartContext, type CartContextValue, type CartItem } from "../context/CartContext";

export type { CartItem };

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
