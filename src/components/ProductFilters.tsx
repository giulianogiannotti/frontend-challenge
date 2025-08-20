import { categories, suppliers } from "../data/products";
import "./ProductFilters.css";

interface ProductFiltersProps {
  selectedCategory: string;
  searchQuery: string;
  selectedSupplier: string;
  priceRange: { min: number; max: number };
  onSupplierChange: (supplier: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onClearFilters: () => void;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  selectedSupplier,
  priceRange,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSupplierChange,
  onPriceRangeChange,
  onClearFilters,
}: ProductFiltersProps) => {
  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => onSearchChange("")}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price">Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Supplier Filter */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <select
            value={selectedSupplier}
            onChange={(e) => onSupplierChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="all">Todos</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Rango de precios</h3>
          <div
            className="price-range-inputs"
            style={{ display: "flex", gap: "8px" }}
          >
            <input
              type="number"
              placeholder="Mín"
              value={priceRange.min}
              onChange={(e) =>
                onPriceRangeChange(Number(e.target.value), priceRange.max)
              }
              className="sort-select p1" // reutilizamos la misma clase para un estilo uniforme
              style={{ flex: 1 }} // para que ocupe espacio equitativamente
            />
            <input
              type="number"
              placeholder="Máx"
              value={priceRange.max}
              onChange={(e) =>
                onPriceRangeChange(priceRange.min, Number(e.target.value))
              }
              className="sort-select p1"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Clear All Filters */}
        <div className="filter-section">
          <button className="btn btn-secondary cta1" onClick={onClearFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
