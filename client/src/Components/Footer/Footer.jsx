import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Send,
  ShieldCheck,
  Lock,
} from "lucide-react";
import "./Footer.css";

const API = "https://www.api.creativencolourful.com/api/v1";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Blogs", to: "/blogs" },
];

const policies = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Refund & Return", to: "/return" },
  { label: "Shipping Policy", to: "/shipping" },
];

const Footer = () => {
  const [setting, setSetting] = useState({});
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [products, setProducts] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/get-product`);
      if (res.data) {
        setProducts(res.data?.products?.slice(0, 7) || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const fetchSetting = async () => {
      try {
        const { data } = await axios.get(`${API}/admin/settings`);
        setSetting(data.data || {});
      } catch (err) {
        console.error("Footer settings error:", err);
      }
    };
    fetchSetting();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubLoading(true);
      const res = await axios.post(`${API}/create-newsletter`, { email });
      setIsSubscribed(true);
      setEmail("");
      toast.success(res.data.message || "Subscribed successfully!");
    } catch (err) {
      toast.error("Something went wrong. Please try again!");
    } finally {
      setSubLoading(false);
    }
  };

  const social = setting?.socialMediaLinks || {};
  const address =
    setting?.address || "B-14 Amar Colony Lajpat Nagar Iv New Delhi";
  const phone = setting?.contactNumber || "+91 9910100120";
  const supportEmail = setting?.supportEmail || "creativencolourful7777@gmail.com ";
  const siteName = setting?.siteName || "Creative N Colourful";
  const year = new Date().getFullYear();

  return (
    <>
      {/* ── Newsletter Band ── */}
      <div className="ftr-newsletter-band">
        <div className="ftr-grain" />
        <div className="ftr-newsletter-inner">
          {/* Left: copy */}
          <div>
            <p className="ftr-newsletter-eyebrow">
              <span className="ftr-newsletter-eyebrow-dot" />
              Stay In The Loop
              <span className="ftr-newsletter-eyebrow-dot" />
            </p>
            <h3 className="ftr-newsletter-title">
              Discover Handmade <em>Crafts & Creations</em>
            </h3>
            <p className="ftr-newsletter-sub">
              Join 25,000+ art lovers. Get updates on new arrivals, exclusive
              deals & traditional craftsmanship.
            </p>
          </div>

          {/* Right: form */}
          <div className="ftr-form-wrap">
            {isSubscribed ? (
              <div className="ftr-subscribed-msg">
                <span>✓ You're subscribed — thank you!</span>
              </div>
            ) : (
              <>
                <div className="ftr-input-row">
                  <input
                    className="ftr-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address…"
                    required
                  />
                  <button
                    className="ftr-sub-btn"
                    onClick={handleSubmit}
                    disabled={subLoading}
                  >
                    <Send size={13} />
                    {subLoading ? "Sending…" : "Subscribe"}
                  </button>
                </div>
                <p className="ftr-form-note">
                  <Lock size={9} />
                  Your data is safe with us. No spam, ever.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <footer className="ftr-root">
        <div className="ftr-grain" />
        <div className="ftr-orb ftr-orb-1" />
        <div className="ftr-orb ftr-orb-2" />

        <div className="ftr-content">
          <div className="ftr-grid">
            {/* ── Col 1: Brand ── */}
            <div className="ftr-brand-col">
              <img src={logo} alt="CREATIVE N COLOURFUL" className="ftr-logo" />

              <p className="ftr-tagline">
                Pure. Aromatic. Handcrafted
                <br />
                for your kitchen &amp; your cup.
              </p>

              <div className="ftr-contact-list">
                {[
                  { icon: MapPin, text: address },
                  { icon: Phone, text: phone, href: `tel:${phone}` },
                  {
                    icon: Mail,
                    text: supportEmail,
                    href: `mailto:${supportEmail}`,
                  },
                ].map(({ icon: Icon, text, href }) => (
                  <a
                    key={text}
                    href={href || undefined}
                    className="ftr-contact-item"
                  >
                    <div className="ftr-contact-icon">
                      <Icon size={11} color="var(--gold)" />
                    </div>
                    <span className="ftr-contact-text">{text}</span>
                  </a>
                ))}
              </div>

              <div className="ftr-socials">
                {[
                  { href: social.facebook, Icon: FaFacebookF },
                  { href: social.instagram, Icon: FaInstagram },
                  { href: social.twitter, Icon: FaXTwitter },
                  { href: social.youtube, Icon: FaYoutube },
                  ...(social.linkedin
                    ? [{ href: social.linkedin, Icon: FaLinkedinIn }]
                    : []),
                ].map(({ href, Icon }, i) => (
                  <a
                    key={i}
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ftr-social-btn"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Col 2: Quick Links ── */}
            <div>
              <h4 className="ftr-section-title">Quick Links</h4>
              <div className="ftr-section-rule" />
              <ul className="ftr-links-list">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="ftr-link">
                      <ArrowRight size={10} className="ftr-link-arrow" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Products ── */}
            <div>
              <h4 className="ftr-section-title">Our Products</h4>
              <div className="ftr-section-rule" />
              <ul className="ftr-links-list">
                {products.map((p) => (
                  <li key={p._id}>
                    <Link to={`/product-page/${p._id}`} className="ftr-link">
                      <ArrowRight size={10} className="ftr-link-arrow" />
                      {p.product_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 4: Store Info ── */}
            <div>
              <h4 className="ftr-section-title">Store Info</h4>
              <div className="ftr-section-rule" />

              <div className="ftr-stats-grid">
                {[
                  { v: "50+", l: "Premium Products" },
                  { v: "25k+", l: "Happy Customers" },
                  { v: "100%", l: "Natural Ingredients" },
                ].map((s) => (
                  <div key={s.l} className="ftr-stat-item">
                    <span className="ftr-stat-num">{s.v}</span>
                    <span className="ftr-stat-label">{s.l}</span>
                  </div>
                ))}
              </div>

             
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="ftr-bottom-bar">
            <p className="ftr-copyright">
              © {year} <span>{siteName}</span>. All rights reserved.
            </p>

            <div className="ftr-policy-links">
              {policies.map((p) => (
                <Link key={p.label} to={p.to} className="ftr-policy-link">
                  {p.label}
                </Link>
              ))}
            </div>

            <p className="ftr-made-with">
              Made with <span className="ftr-made-with-heart"></span> Hover Business Services LLP
            </p>
          </div>
        </div>
      </footer>

      {/* ── WhatsApp FAB ── */}
      <a
        href={`https://api.whatsapp.com/send?phone=91${(phone || "").replace(/\D/g, "")}&text=Hi%2C%20I%20found%20you%20on%20the%Creative N Colourful%20website`}
        target="_blank"
        rel="noopener noreferrer"
        className="ftr-whatsapp-fab"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={22} color="#fff" />
      </a>
    </>
  );
};

export default Footer;
