import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;
