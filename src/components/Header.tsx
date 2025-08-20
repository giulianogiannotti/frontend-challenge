import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";
import "./Header.css";

const Header = () => {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <div className="logo-icon">
                <span className="material-icons">store</span>
              </div>
              <span className="logo-text p1-medium">SWAG Challenge</span>
            </Link>

            <nav className="nav">
              <Link to="/" className="nav-link l1">
                <span className="material-icons">home</span>
                Catálogo
              </Link>
              <button
                className="nav-link l1"
                onClick={() => setIsCartOpen(true)}
              >
                <span className="material-icons">shopping_cart</span>
                Carrito ({cart.length})
              </button>
            </nav>

            <div className="header-actions">
              <button className="btn btn-secondary cta1">
                <span className="material-icons">person</span>
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <CartSidebar onClose={() => setIsCartOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Header;
