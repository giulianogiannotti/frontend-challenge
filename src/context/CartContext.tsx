import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/Product";

export type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (
    productId: number,
    selectedColor?: string,
    selectedSize?: string
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Agregar al carrito, sumando si ya existe
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product.id === item.product.id &&
          i.selectedColor === item.selectedColor &&
          i.selectedSize === item.selectedSize
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }

      return [...prev, item];
    });
  };

  // Eliminar un producto del carrito (puede ser por color/talla)
  const removeFromCart = (
    productId: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
