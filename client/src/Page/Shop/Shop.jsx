import React, { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, Grid, SlidersHorizontal, X, Leaf, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "./bg-about.jpg";
import ProductCard from "../../Components/FeatureProduct/ProductCard";
import ProductModal from "../../Components/FeatureProduct/ProductModel";

const API = "https://www.api.creativencolourful.com/api/v1";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

/* ── Font loader ── */
const FontLoader = () => {
  useEffect(() => {
    if (document.getElementById("shop-fonts")) return;
    const link = document.createElement("link");
    link.id = "shop-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@1,300;1,400&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ── Loading skeleton grid ── */
const SkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
        style={{ background: "rgba(200,151,58,0.05)", border: "1px solid rgba(200,151,58,0.1)", animationDelay: `${i * 0.07}s` }}>
        <div style={{ height: "clamp(130px,30vw,220px)", background: "rgba(200,151,58,0.08)" }} />
        <div className="p-3 flex flex-col gap-2">
          <div className="h-2.5 w-16 rounded-full" style={{ background: "rgba(200,151,58,0.12)" }} />
          <div className="h-4 w-3/4 rounded-full" style={{ background: "rgba(200,151,58,0.1)" }} />
          <div className="h-3 w-1/2 rounded-full" style={{ background: "rgba(200,151,58,0.08)" }} />
        </div>
      </div>
    ))}
  </div>
);

/* ── Select dropdown — branded ── */
const BrandedSelect = ({ value, onChange, children, label }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none w-full pr-8 pl-4 py-2.5 rounded-xl focus:outline-none transition-all duration-200 cursor-pointer"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.78rem",
          color: "#000000",
          background: "rgba(255, 255, 255, 0.9)",
          border: "1.5px solid rgba(0, 0, 0, 0.25)",
          letterSpacing: "0.03em",
        }}
      >
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "#C8973A" }} />
    </div>
  );
};

/* ── Transform API product → component-friendly shape ── */
const transformProduct = (p) => {
  const getLowest = () => {
    if (p.isVarient && p.Varient?.length)
      return Math.min(...p.Varient.map((v) => v.price_after_discount || v.price));
    return p.afterDiscountPrice || p.price || 0;
  };
  const getOriginal = () => {
    if (p.isVarient && p.Varient?.length) return Math.max(...p.Varient.map((v) => v.price));
    return p.price || 0;
  };
  const getDiscount = () => {
    if (p.isVarient && p.Varient?.length) return p.Varient[0].discount_percentage || 0;
    return p.discount || 0;
  };
  return {
    ...p,
    id: p._id,
    name: p.product_name,
    brand: p.category?.name || "Creative N Colourful ",
    price: getLowest(),
    originalPrice: getOriginal(),
    discount: getDiscount(),
    image: p.ProductMainImage?.url || "",
    category: p.category?.name || "Uncategorized",
    rating: p.reviews?.length > 0 ? p.reviews.reduce((a, r) => a + (r.rating || 0), 0) / p.reviews.length : 4.5,
    isNew: new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    inStock: p.isVarient ? p.Varient?.some((v) => v.isStock) : p.stock > 0,
    variants: p.Varient || [],
    isVarient: p.isVarient,
  };
};

/* ── Main Shop Component ── */
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Quick View modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    const cat = params.get("category");
    if (cat) setSelectedCategory(cat);
    setIsInitialized(true);
  }, [location.search]);

  const fetchProducts = useCallback(async (query = "") => {
    try {
      setLoading(true);
      const url = query.trim()
        ? `${API}/search_product_and_filter?query=${encodeURIComponent(query.trim())}`
        : `${API}/get-product`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        const transformed = (data.products || data.data || []).map(transformProduct);
        setProducts(transformed);
        setFiltered(transformed);
        const cats = ["All", ...new Set(transformed.map((p) => p.category))];
        setCategories(cats);
        const initVariants = {};
        transformed.forEach((p) => {
          if (p.isVarient && p.variants.length) initVariants[p.id] = p.variants[0]._id;
        });
        setSelectedVariants(initVariants);
      } else {
        setProducts([]); setFiltered([]);
      }
    } catch (err) {
      console.error(err); setProducts([]); setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) fetchProducts(searchTerm);
  }, [searchTerm, isInitialized, fetchProducts]);

  /* Local filter + sort */
  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((p) => {
        const price = selectedVariants[p.id]?.price_after_discount || selectedVariants[p.id]?.price || p.price;
        return max ? price >= min && price <= max : price >= min;
      });
    }
    if (localSearch.trim()) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(localSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(localSearch.toLowerCase())
      );
    }
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      default: break;
    }
    setFiltered(result);
  }, [products, selectedCategory, priceRange, sortBy, selectedVariants, localSearch]);

  const handleVariantChange = (productId, variantId) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const handleOpenQuickView = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const clearSearch = () => { setSearchTerm(""); setLocalSearch(""); navigate("/shop"); };
  const activeFiltersCount = [selectedCategory !== "All", priceRange !== "all", sortBy !== "featured"].filter(Boolean).length;

  return (
    <>
      <FontLoader />

      <style>{`
        @keyframes shop-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .shop-enter { animation: shop-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .filter-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .filter-panel.open { max-height: 220px; }
        .chip-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          padding: 5px 14px;
          border-radius: 999px;
          border: 1.5px solid rgba(200,151,58,0.25);
          background: rgba(250,246,239,0.8);
          color: rgba(42,31,20,0.55);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .chip-btn:hover, .chip-btn.active {
          background: linear-gradient(135deg,#C8973A,#A67828);
          color: #FAF6EF;
          border-color: transparent;
          box-shadow: 0 2px 10px rgba(200,151,58,0.3);
        }
      `}</style>

      <div style={{ background: "linear-gradient(160deg,#FFF 0%,#FFF 55%,#FFF 100%)", minHeight: "100vh" }}>

        {/* Hero Banner */}
        <div
          className="relative text-white overflow-hidden"
          style={{ minHeight: 320, backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center top" }}
        >
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(rgb(5 10 48) 0%, rgb(17 35 37 / 69%) 100%, rgb(255, 255, 255) 100%)" }} />
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: GRAIN, backgroundSize: "180px" }} />

          <div className="relative max-w-5xl mx-auto px-5 py-20 sm:py-28 text-center shop-enter">
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#E6C882", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Leaf size={10} /> Creative N Colourful
            </p>
            <h1 style={{ fontFamily: "'poppins',serif", fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: 800, color: "#FAF6EF", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Our{" "}
              <span style={{ fontFamily: "'poppins',serif", fontStyle: "italic", fontWeight: 400, background: "linear-gradient(90deg,#C8973A,#E6C882)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Collection
              </span>
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "rgba(250,246,239,0.6)", fontWeight: 300, marginTop: 12, lineHeight: 1.75, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
              {filtered.length}+ premium  handcrafted Products.
            </p>

            {/* Search in hero */}
            <div className="mt-8 mx-auto max-w-md">
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-4 pointer-events-none" style={{ color: "rgba(42,31,20,0.4)" }} />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search gifts, decor & more..."
                  className="w-full pl-10 pr-4 py-3 rounded-full focus:outline-none"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.85rem",
                    background: "rgba(250,246,239,0.92)",
                    border: "1.5px solid rgba(200,151,58,0.3)",
                    color: "#2A1F14",
                    backdropFilter: "blur(16px)",
                  }}
                />
                {localSearch && (
                  <button onClick={() => setLocalSearch("")} className="absolute right-4"
                    style={{ color: "rgba(42,31,20,0.4)" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Search result banner */}
          {(searchTerm || localSearch) && (
            <div className="mb-5 shop-enter flex items-center justify-between px-4 py-3 rounded-xl bg-[rgba(200,151,58,0.07)] border border-[rgba(200,151,58,0.2)]">
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: "#2A1F14" }}>
                <span style={{ color: "rgba(42,31,20,0.5)" }}>Results for</span>{" "}
                <strong style={{ color: "#C8973A" }}>"{searchTerm || localSearch}"</strong>
                <span style={{ color: "rgba(42,31,20,0.45)", marginLeft: 6 }}>— {filtered.length} found</span>
              </p>
              <button onClick={clearSearch} className="flex items-center gap-1 text-xs"
                style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(42,31,20,0.4)", border: "none", background: "none", cursor: "pointer" }}>
                <X size={12} /> Clear
              </button>
            </div>
          )}

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 shop-enter" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`chip-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter bar */}
          <div className="shop-enter mb-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">

              <div className="flex items-center gap-3 flex-wrap">
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: "rgba(42,31,20,0.45)" }}>
                  <span style={{ fontFamily: "'poppins',serif", fontSize: "1rem", fontWeight: 700, color: "#2A1F14" }}>{filtered.length}</span>
                  {" "}products
                </p>
                <div className="h-4 w-px hidden sm:block" style={{ background: "rgba(200,151,58,0.25)" }} />

                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.75rem",
                    color: filtersOpen ? "#C8973A" : "rgba(42,31,20,0.5)",
                    background: filtersOpen ? "rgba(200,151,58,0.08)" : "transparent",
                    border: `1.5px solid ${filtersOpen ? "rgba(200,151,58,0.3)" : "rgba(200,151,58,0.15)"}`,
                  }}
                >
                  <SlidersHorizontal size={13} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-r from-[#C8973A] to-[#A67828] text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => { setSelectedCategory("All"); setPriceRange("all"); setSortBy("featured"); }}
                    className="text-xs flex items-center gap-1 transition-colors"
                    style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(42,31,20,0.4)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <X size={11} /> Reset
                  </button>
                )}
              </div>

              <div className="w-44 sm:w-52">
                <BrandedSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="rating">Highest Rated</option>
                </BrandedSelect>
              </div>
            </div>

            {/* Expandable filters */}
            <div className={`filter-panel ${filtersOpen ? "open" : ""}`}>
              <div className="flex flex-wrap gap-4 pt-4 pb-1 border-t border-[rgba(200,151,58,0.12)] mt-3">
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C8973A" }}>
                    Price Range
                  </label>
                  <BrandedSelect value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                    <option value="all">All Prices</option>
                    <option value="0-100">Under ₹100</option>
                    <option value="100-300">₹100 – ₹300</option>
                    <option value="300-600">₹300 – ₹600</option>
                    <option value="600-">Above ₹600</option>
                  </BrandedSelect>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <SkeletonGrid />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {filtered.map((product, index) => (
                <div key={product.id || product._id} className="shop-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard
                    product={product}
                    index={index}
                    selectedVariants={selectedVariants}
                    onVariantChange={handleVariantChange}
                    onQuickView={() => handleOpenQuickView(product)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="shop-enter flex flex-col items-center py-20 gap-4 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[rgba(200,151,58,0.08)] border border-[rgba(200,151,58,0.2)]">
                <Search size={24} style={{ color: "rgba(200,151,58,0.5)" }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                No products found
              </h3>
              <p className="text-sm text-gray-600 max-w-md">
                {searchTerm || localSearch
                  ? `No results for "${searchTerm || localSearch}". Try a different search.`
                  : "Try adjusting your filters or browse all products."}
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#C8973A] to-[#A67828] text-white shadow-md hover:shadow-lg transition-all"
              >
                Show All Products
              </button>
            </div>
          )}

          {/* Bottom trust strip */}
          {!loading && filtered.length > 0 && (
            <div className="mt-12 shop-enter flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 rounded-2xl bg-[rgba(200,151,58,0.05)] border border-[rgba(200,151,58,0.12)]">
              {[
                { v: "100%", l: "Natural" },
                { v: "50+", l: "Products" },
                { v: "Free", l: "Shipping ₹299+" },
                { v: "7-Day", l: "Easy Returns" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-center">
                    <p style={{ fontFamily: "'poppins',serif", fontSize: "1.1rem", fontWeight: 700, color: "#C8973A" }}>{s.v}</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: "rgba(42,31,20,0.5)", marginTop: 2 }}>{s.l}</p>
                  </div>
                  {i < 3 && <div className="w-px h-8 hidden sm:block" style={{ background: "rgba(200,151,58,0.2)" }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </>
  );
};

export default Shop;