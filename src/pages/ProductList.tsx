import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { products as allProducts } from "../data/products";
import { Product } from "../types/Product";
import "./ProductList.css";

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });

  // Filter and sort products based on criteria
  const filterProducts = (
    category: string,
    search: string,
    sort: string,
    supplier: string = "all",
    price: { min: number; max: number } = { min: 0, max: 0 }
  ) => {
    let filtered = [...allProducts];

    // Category filter
    if (category !== "all")
      filtered = filtered.filter((p) => p.category === category);

    // Search filter
    if (search) {
      const normalized = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          p.sku.toLowerCase().includes(normalized)
      );
    }

    // Supplier filter
    if (supplier !== "all")
      filtered = filtered.filter((p) => p.supplier === supplier);

    // Price range filter
    if (price.min || price.max) {
      filtered = filtered.filter(
        (p) =>
          p.basePrice >= price.min && (!price.max || p.basePrice <= price.max)
      );
    }

    // Sorting
    switch (sort) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "stock":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(category, searchQuery, sortBy);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    filterProducts(selectedCategory, search, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    filterProducts(selectedCategory, searchQuery, sort);
  };

  const handleSupplierChange = (supplier: string) => {
    setSelectedSupplier(supplier);
    filterProducts(selectedCategory, searchQuery, sortBy, supplier, priceRange);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    filterProducts(selectedCategory, searchQuery, sortBy, selectedSupplier, {
      min,
      max,
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("name");
    setSelectedSupplier("all");
    setPriceRange({ min: 0, max: 0 });
    filterProducts("all", "", "name");
  };

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>

          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">
                {filteredProducts.length}
              </span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">
                {[...new Set(allProducts.map((p) => p.category))].length}
              </span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          selectedSupplier={selectedSupplier}
          priceRange={priceRange}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onSupplierChange={handleSupplierChange}
          onPriceRangeChange={handlePriceRangeChange}
          onClearFilters={clearAllFilters}
        />

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
              <button
                className="btn btn-primary cta1"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  filterProducts("all", "", sortBy);
                }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
