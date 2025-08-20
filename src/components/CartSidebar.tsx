import { useCart } from "../context/CartContext";
import { Product } from "../types/Product";
import "./CartSidebar.css";

interface CartSidebarProps {
  onClose: () => void;
}

const getPriceForQuantity = (product: Product, quantity: number) => {
  const priceBreaks = product.priceBreaks ?? [];
  const sortedBreaks = [...priceBreaks].sort((a, b) => b.minQty - a.minQty);
  for (const breakPoint of sortedBreaks) {
    if (quantity >= breakPoint.minQty) return breakPoint.price;
  }
  return product.basePrice;
};

const CartSidebar = ({ onClose }: CartSidebarProps) => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) =>
      sum + getPriceForQuantity(item.product, item.quantity) * item.quantity,
    0
  );

  return (
    <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
      <button className="close-cart-btn" onClick={onClose}>
        ✕
      </button>

      <h3>Mi Carrito ({cart.length})</h3>

      {cart.length === 0 && <p>Tu carrito está vacío</p>}

      {cart.map((item, index) => (
        <div key={index} className="cart-item cart-item-actions">
          <div className="cart-item-info">
            <strong>{item.product.name}</strong>
            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
            {item.selectedSize && <span>Talla: {item.selectedSize}</span>}
          </div>
          <div className="cart-item-actions">
            <span>
              {item.quantity} × $
              {getPriceForQuantity(item.product, item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() =>
                removeFromCart(
                  item.product.id,
                  item.selectedColor,
                  item.selectedSize
                )
              }
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <button onClick={clearCart} className="clear-cart-btn">
            Vaciar carrito
          </button>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
