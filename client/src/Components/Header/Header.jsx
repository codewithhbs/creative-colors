"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, User, X, LogIn, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import "./header.css";

const FontLoader = () => {
  useEffect(() => {
    if (document.getElementById("spice-fonts")) return;
    const link = document.createElement("link");
    link.id = "spice-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
};

const marqueeItems = [
  "Handmade · Traditional · Unique Creations",
  "✦",
  "Flat 20% Off on First Order",
  "✦",
  "Authentic Handcrafted Decor & Gifts",
  "✦",
  "Free Shipping Above ₹999",
  "✦",
  "Artisan-Made Home Accessories",
  "✦",
  "Support Local Craftsmanship",
  "✦",
  "Handmade · Traditional · Unique Creations",
  "✦",
  "Flat 20% Off on First Order",
  "✦",
  "Authentic Handcrafted Decor & Gifts",
  "✦",
  "Free Shipping Above ₹999",
  "✦",
];

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About us" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "Custom Orders" },
  { to: "/Blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const [isToken, setIsToken] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  const cartCount = cartItems.length;

  useEffect(() => {
    setIsToken(!!sessionStorage.getItem("token_login"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <FontLoader />

      <header className={`hdr-root ${scrolled ? "scrolled" : ""}`}>
        <div className="hdr-promo-bar">
          <span className="hdr-promo-text">
            Sign Up And <strong>20% off</strong> special discount on your first
            order&nbsp;
            <Link to="/register" className="hdr-promo-link">
              Sign Up Now
            </Link>
          </span>
        </div>

        <div className="hdr-info-bar">
          <div className="hdr-marquee-strip">
            <div className="hdr-marquee-inner">
              {marqueeItems.map((item, i) =>
                item === "✦" ? (
                  <span key={i} className="dot">
                    ✦
                  </span>
                ) : (
                  <span key={i}>{item}</span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="hdr-band">
          <div className="hdr-inner">
            <div className="hdr-row">
              <div className="hdr-mobile-controls">
                <button
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="hamburger-btn"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X size={18} />
                  ) : (
                    <>
                      <span />
                      <span />
                      <span />
                    </>
                  )}
                </button>
              </div>

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="hdr-brand"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt="CREATIVE N COLOURFUL"
                    className="hdr-logo-img"
                  />
                ) : (
                  <>
                    <span className="brand-eyebrow">Est. 2023</span>
                    <span className="brand-name">
                      Asvada<em>vat</em>
                    </span>
                    <div className="brand-rule" />
                    <span className="brand-sub">Spices &amp; Artisan Teas</span>
                  </>
                )}
              </Link>

              <div className="hdr-desktop-icons">
                <form onSubmit={handleSearch} className="hdr-search-form">
                  <input
                    className="hdr-search-input"
                    type="text"
                    placeholder="Search Product, Category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="hdr-search-btn">
                    <Search size={15} />
                  </button>
                </form>

                {isToken ? (
                  <Link to="/profile" className="icon-btn" title="My Account">
                    <User size={17} />
                  </Link>
                ) : (
                  <Link to="/login" className="icon-btn" title="Login">
                    <LogIn size={17} />
                  </Link>
                )}

                <Link
                  to="/wishlist"
                  className="icon-btn cart-icon-wrap"
                  title="Wishlist"
                >
                  <Heart size={17} />
                </Link>

                <Link
                  to="/cart"
                  className="icon-btn cart-icon-wrap"
                  title="Cart"
                >
                  <ShoppingCart size={17} />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
              </div>

              <div className="hdr-mobile-controls">
                <button
                  onClick={() => setIsSearchOpen((v) => !v)}
                  className="icon-btn"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
                <Link to="/cart" className="icon-btn cart-icon-wrap">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {isSearchOpen && (
            <div className="hdr-search-bar">
              <form onSubmit={handleSearch} className="hdr-search-form">
                <input
                  ref={searchRef}
                  className="hdr-search-input"
                  type="text"
                  placeholder="Search gifts, decor, nameplates & more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="hdr-search-btn">
                  <Search size={15} />
                </button>
              </form>
            </div>
          )}

          {isMenuOpen && (
            <div className="hdr-mobile-menu">
              <div className="hdr-mobile-menu-inner">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="mob-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                    <span className="mob-nav-link-arrow">›</span>
                  </Link>
                ))}
                <div className="hdr-mobile-auth">
                  {isToken ? (
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="mob-account-link"
                    >
                      <User size={17} /> My Account
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="mob-signin-btn"
                    >
                      <LogIn size={16} /> Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="hdr-nav-bar">
          <div className="hdr-nav-bar-inner">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hdr-nav-link">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
