import { useState } from "react";
import { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import "./PricingCalculator.css";
import { useToast } from "../context/ToastContext";
import jsPDF from "jspdf";

interface PricingCalculatorProps {
  product: Product;
}

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const PricingCalculator = ({ product }: PricingCalculatorProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedBreak, setSelectedBreak] = useState<number>(0);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState<CompanyInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  // --- Pricing Calculations ---
  const calculatePrice = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return product.basePrice * qty;
    }

    const sortedBreaks = [...product.priceBreaks].sort(
      (a, b) => a.minQty - b.minQty
    );

    let applicableBreak = sortedBreaks[0];
    for (let i = 0; i < sortedBreaks.length; i++) {
      if (qty >= sortedBreaks[i].minQty) {
        applicableBreak = sortedBreaks[i];
      }
    }

    return applicableBreak.price * qty;
  };

  const getDiscount = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) return 0;
    const baseTotal = product.basePrice * qty;
    const discountedTotal = calculatePrice(qty);
    return ((baseTotal - discountedTotal) / baseTotal) * 100;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const currentPrice = calculatePrice(quantity);
  const discountPercent = getDiscount(quantity);
  const maxQty = product.maxQuantity || product.stock || 10000;

  // --- PDF Export ---
  const exportQuote = () => {
    const doc = new jsPDF();
    doc.text(`Cotización para ${company.name}`, 10, 10);
    doc.text(`Email: ${company.email}`, 10, 20);
    doc.text(`Teléfono: ${company.phone}`, 10, 30);
    if (company.address) doc.text(`Dirección: ${company.address}`, 10, 40);
    doc.text(`Producto: ${product.name}`, 10, 50);
    doc.text(`Cantidad: ${quantity} unidades`, 10, 60);
    doc.text(
      `Precio unitario: ${formatPrice(currentPrice / quantity)}`,
      10,
      70
    );
    if (discountPercent > 0)
      doc.text(`Descuento: ${discountPercent.toFixed(1)}%`, 10, 80);
    doc.text(`Total: ${formatPrice(currentPrice)}`, 10, 90);
    doc.save(`cotizacion_${product.name}.pdf`);
  };

  return (
    <div className="pricing-calculator">
      {/* --- Header --- */}
      <div className="calculator-header">
        <h3 className="calculator-title p1-medium">Calculadora de Precios</h3>
        <p className="calculator-subtitle l1">
          Calcula el precio según la cantidad que necesitas
        </p>
      </div>

      <div className="calculator-content">
        {/* --- Quantity Input --- */}
        <div className="quantity-section">
          <label className="quantity-label p1-medium">Cantidad</label>
          <div className="quantity-input-group">
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(Math.max(1, val), maxQty));
              }}
              className="quantity-input p1"
              min="1"
              max={maxQty}
            />
            <span className="quantity-unit l1">unidades</span>
          </div>
        </div>

        {/* --- Price Breaks --- */}
        {product.priceBreaks && product.priceBreaks.length > 0 && (
          <div className="price-breaks-section">
            <h4 className="breaks-title p1-medium">Descuentos por volumen</h4>
            <div className="price-breaks">
              {product.priceBreaks.map((priceBreak, index) => {
                const isActive = quantity >= priceBreak.minQty;
                const isSelected = selectedBreak === index;

                return (
                  <div
                    key={index}
                    className={`price-break ${isActive ? "active" : ""} ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedBreak(index);
                      setQuantity(priceBreak.minQty);
                    }}
                  >
                    <div className="break-quantity l1">
                      {priceBreak.minQty}+ unidades
                    </div>
                    <div className="break-price p1-medium">
                      {formatPrice(priceBreak.price)}
                    </div>
                    {priceBreak.discount && (
                      <div className="break-discount l1">
                        -{priceBreak.discount}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- Price Summary --- */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label p1">Precio unitario:</span>
            <span className="summary-value p1-medium">
              {formatPrice(currentPrice / quantity)}
            </span>
          </div>

          <div className="summary-row">
            <span className="summary-label p1">Cantidad:</span>
            <span className="summary-value p1-medium">{quantity} unidades</span>
          </div>

          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label p1">Descuento:</span>
              <span className="summary-value discount-value p1-medium">
                -{discountPercent.toFixed(1)}%
              </span>
            </div>
          )}

          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Total:</span>
            <span className="summary-value total-value h2">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="calculator-actions">
          <button
            className="btn btn-secondary cta1"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-icons">email</span>
            Solicitar cotización oficial
          </button>

          <button
            className="btn btn-primary cta1"
            onClick={() => {
              addToCart({
                product,
                quantity,
              });
              addToast({
                message: `${product.name} agregado al carrito`,
                type: "success",
              });
            }}
          >
            <span className="material-icons">shopping_cart</span>
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* --- Cotización Modal --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="p1-medium">Formulario de Cotización</h3>

            {/* Formulario empresa */}
            <div className="company-form">
              <input
                type="text"
                name="name"
                placeholder="Nombre de la empresa"
                value={company.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={company.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={company.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="address"
                placeholder="Dirección (opcional)"
                value={company.address}
                onChange={handleInputChange}
              />
            </div>

            {/* Resumen */}
            <div className="quote-summary">
              <h4 className="p1-medium">Resumen de Cotización</h4>
              <p>Producto: {product.name}</p>
              <p>Cantidad: {quantity} unidades</p>
              <p>Precio unitario: {formatPrice(currentPrice / quantity)}</p>
              {discountPercent > 0 && (
                <p>Descuento: {discountPercent.toFixed(1)}%</p>
              )}
              <p>Total: {formatPrice(currentPrice)}</p>
            </div>

            {/* Botones */}
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={exportQuote}>
                Exportar a PDF
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;
