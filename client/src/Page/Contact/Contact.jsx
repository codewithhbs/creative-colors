import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/* ─────────────────────────────────────────────
   INLINE STYLES  (no separate CSS file needed)
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cp-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: #f0f4ff;
    color: #050a30;
    overflow-x: hidden;
  }

  @keyframes cp-fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cp-blob {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(22px,-18px) scale(1.06); }
    66%      { transform: translate(-14px,12px) scale(0.96); }
  }
  @keyframes cp-spin { to { transform: rotate(360deg); } }
  @keyframes cp-pulse {
    0%   { transform: scale(0.85); opacity: 1; }
    100% { transform: scale(1.5);  opacity: 0; }
  }

  .cp-au  { animation: cp-fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .cp-d1  { animation-delay: 0.05s; }
  .cp-d2  { animation-delay: 0.13s; }
  .cp-d3  { animation-delay: 0.22s; }
  .cp-d4  { animation-delay: 0.31s; }

  /* ── HERO ── */
  .cp-hero {
    position: relative;
    background: #050a30;
    padding: 96px 24px 110px;
    overflow: hidden;
    clip-path: polygon(0 0, 100% 0, 100% 86%, 0 100%);
  }
  .cp-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(65px);
    pointer-events: none;
    animation: cp-blob 9s ease-in-out infinite;
  }
  .cp-blob-1 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(61,90,241,.38), transparent 68%);
    top: -90px; right: 4%;
  }
  .cp-blob-2 {
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(0,212,255,.22), transparent 68%);
    bottom: -20px; left: 8%;
    animation-delay: -3s;
  }
  .cp-blob-3 {
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(107,140,255,.28), transparent 68%);
    top: 42%; left: 42%;
    animation-delay: -6s;
  }
  .cp-hero-inner {
    position: relative;
    max-width: 820px;
    margin: 0 auto;
    text-align: center;
  }
  .cp-badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 7px 20px;
    border: 1px solid rgba(107,140,255,.4);
    border-radius: 100px;
    background: rgba(255,255,255,.07);
    backdrop-filter: blur(8px);
    margin-bottom: 30px;
    font-size: 11px;
    font-weight: 500;
    color: #6b8cff;
    letter-spacing: .09em;
    text-transform: uppercase;
  }
  .cp-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #00d4ff;
    box-shadow: 0 0 9px #00d4ff;
    position: relative;
    flex-shrink: 0;
  }
  .cp-dot::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1px solid #00d4ff;
    animation: cp-pulse 1.9s ease-out infinite;
  }
  .cp-hero h1 {
    font-size: clamp(2.8rem, 7vw, 5rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -.025em;
    margin-bottom: 22px;
  }
  .cp-hero h1 em {
    font-style: normal;
    background: linear-gradient(130deg, #6b8cff, #00d4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .cp-hero-sub {
    font-size: 1.02rem;
    font-weight: 300;
    color: rgba(255,255,255,.6);
    max-width: 530px;
    margin: 0 auto;
    line-height: 1.75;
  }

  /* ── INFO CARDS ── */
  .cp-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 18px;
    max-width: 1140px;
    margin: -50px auto 0;
    padding: 0 24px;
    position: relative;
    z-index: 10;
  }
  .cp-info-card {
    background: #fff;
    border-radius: 20px;
    padding: 26px 22px;
    box-shadow: 0 4px 24px rgba(5,10,48,.09);
    border: 1px solid rgba(5,10,48,.09);
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform .3s, box-shadow .3s, border-color .3s;
  }
  .cp-info-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 48px rgba(5,10,48,.14);
    border-color: rgba(5,10,48,.2);
  }
  .cp-ic-icon {
    width: 46px; height: 46px;
    border-radius: 13px;
    background: linear-gradient(135deg, #050a30, #0f1a6e);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(5,10,48,.22);
    margin-bottom: 4px;
  }
  .cp-ic-icon svg {
    width: 20px; height: 20px;
    stroke: #6b8cff;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .cp-ic-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: #6b7fc4;
  }
  .cp-ic-val {
    font-size: .87rem;
    font-weight: 600;
    color: #050a30;
    line-height: 1.4;
  }
  .cp-ic-sub {
    font-size: .74rem;
    font-weight: 400;
    color: #9aa5d4;
  }

  /* ── MAIN GRID ── */
  .cp-main {
    max-width: 1140px;
    margin: 0 auto;
    padding: 80px 24px 60px;
    display: grid;
    grid-template-columns: 1fr 370px;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 960px) { .cp-main { grid-template-columns: 1fr; } }

  /* ── FORM CARD ── */
  .cp-form-card {
    background: #fff;
    border-radius: 28px;
    padding: 52px 48px;
    box-shadow: 0 4px 28px rgba(5,10,48,.08);
    border: 1px solid rgba(5,10,48,.09);
  }
  @media (max-width: 600px) { .cp-form-card { padding: 30px 20px; } }

  .cp-fh h2 {
    font-size: 1.85rem;
    font-weight: 700;
    color: #050a30;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .cp-fh p {
    font-size: .87rem;
    font-weight: 400;
    color: #6b7fc4;
    line-height: 1.65;
    margin-bottom: 34px;
  }

  .cp-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 18px;
  }
  @media (max-width: 560px) { .cp-row { grid-template-columns: 1fr; } }

  .cp-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
  }
  .cp-field:last-of-type { margin-bottom: 0; }

  .cp-field label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: #2d3a8c;
  }
  .cp-field input,
  .cp-field select,
  .cp-field textarea {
    font-family: 'Poppins', sans-serif;
    font-size: .86rem;
    font-weight: 400;
    color: #050a30;
    background: #f0f4ff;
    border: 1.5px solid transparent;
    border-radius: 12px;
    padding: 13px 15px;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    width: 100%;
  }
  .cp-field input::placeholder,
  .cp-field textarea::placeholder { color: #b0b8d8; font-weight: 300; }
  .cp-field input:focus,
  .cp-field select:focus,
  .cp-field textarea:focus {
    border-color: #3d5af1;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(61,90,241,.09);
  }
  .cp-field.err input,
  .cp-field.err select,
  .cp-field.err textarea { border-color: #e74c3c; background: #fff5f5; }
  .cp-field textarea { resize: none; min-height: 128px; }
  .cp-field select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236b7fc4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    cursor: pointer;
  }
  .cp-err-msg { font-size: 11px; font-weight: 500; color: #e74c3c; }

  /* ── BUTTON ── */
  .cp-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px 28px;
    background: #050a30;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: .88rem;
    font-weight: 600;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    letter-spacing: .045em;
    position: relative;
    overflow: hidden;
    margin-top: 10px;
    transition: transform .3s, box-shadow .3s;
  }
  .cp-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #1a2fa8, #3d5af1);
    opacity: 0;
    transition: opacity .3s;
  }
  .cp-btn:hover::before { opacity: 1; }
  .cp-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(5,10,48,.26), 0 0 22px rgba(61,90,241,.22);
  }
  .cp-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }
  .cp-btn > * { position: relative; z-index: 1; }
  .cp-btn svg {
    width: 17px; height: 17px;
    stroke: currentColor; fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }
  .cp-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cp-spin .7s linear infinite;
  }
  .cp-privacy {
    text-align: center;
    font-size: 11px;
    font-weight: 400;
    color: #9aa5d4;
    margin-top: 14px;
  }

  /* ── SUCCESS ── */
  .cp-success {
    display: flex;
    align-items: flex-start;
    gap: 13px;
    padding: 16px 18px;
    background: linear-gradient(135deg, #edfaf4, #d9f5e8);
    border: 1px solid #7edcad;
    border-radius: 14px;
    margin-bottom: 26px;
    animation: cp-fadeUp .5s ease both;
  }
  .cp-s-check {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #27ae60;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cp-s-check svg {
    width: 14px; height: 14px;
    stroke: #fff; fill: none;
    stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
  }
  .cp-s-title { font-size: .86rem; font-weight: 600; color: #1a6b3c; margin-bottom: 2px; }
  .cp-s-sub   { font-size: .75rem; font-weight: 400; color: #2d8855; }

  /* ── SIDEBAR ── */
  .cp-sidebar { display: flex; flex-direction: column; gap: 22px; }

  .cp-map {
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(5,10,48,.09);
    border: 1px solid rgba(5,10,48,.09);
    height: 250px;
  }
  .cp-map iframe { width: 100%; height: 100%; display: block; }

  .cp-qi-card {
    background: #fff;
    border-radius: 22px;
    padding: 26px;
    box-shadow: 0 4px 24px rgba(5,10,48,.08);
    border: 1px solid rgba(5,10,48,.09);
  }
  .cp-qi-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #9aa5d4;
    margin-bottom: 20px;
  }
  .cp-qi-item {
    display: flex;
    align-items: flex-start;
    gap: 13px;
    padding: 13px 0;
    border-bottom: 1px solid rgba(5,10,48,.08);
  }
  .cp-qi-item:last-child { border-bottom: none; padding-bottom: 0; }
  .cp-qi-item:first-of-type { padding-top: 0; }
  .cp-qi-ico {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: #f0f4ff;
    border: 1px solid rgba(5,10,48,.09);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cp-qi-ico svg {
    width: 16px; height: 16px;
    stroke: #050a30; fill: none;
    stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
  }
  .cp-qi-lbl { font-size: 10.5px; font-weight: 500; color: #9aa5d4; margin-bottom: 2px; }
  .cp-qi-val { font-size: .82rem; font-weight: 600; color: #050a30; word-break: break-all; }

  /* ── SOCIAL ── */
  .cp-social-card {
    background: linear-gradient(145deg, #050a30, #0a1250);
    border-radius: 22px;
    padding: 26px;
    box-shadow: 0 8px 32px rgba(5,10,48,.22);
  }
  .cp-sc-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.38);
    margin-bottom: 18px;
  }
  .cp-sc-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 15px;
    border-radius: 11px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.09);
    text-decoration: none;
    color: #fff;
    font-size: .83rem;
    font-weight: 500;
    margin-bottom: 9px;
    transition: background .2s, transform .2s;
  }
  .cp-sc-link:last-child { margin-bottom: 0; }
  .cp-sc-link:hover { background: rgba(255,255,255,.12); transform: translateX(4px); }
  .cp-sc-link svg {
    width: 15px; height: 15px;
    stroke: #6b8cff; fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    transition: transform .2s;
  }
  .cp-sc-link:hover svg { transform: translateX(3px); }

  /* ── FOOTER ── */
  .cp-footer {
    background: #030720;
    text-align: center;
    padding: 44px 24px;
    margin-top: 20px;
    font-size: .85rem;
    font-weight: 300;
    color: rgba(255,255,255,.35);
    letter-spacing: .04em;
  }
  .cp-footer strong { color: #6b8cff; font-weight: 600; }
`;

/* ─── SVG Icons ─── */
const IPhone = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 13a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2.23h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const IMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IPin = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IClock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);
const ISend = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9" />
  </svg>
);
const IArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
);
const ICheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

/* ─── Main Component ─── */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    Phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [errors, setErrors] = useState({});

  const handleFetchSetting = async () => {
    try {
      const { data } = await axios.get(
        "https://www.api.creativencolourful.com/api/v1/admin/settings",
      );
      setSettings(data.data);
    } catch {
      setSettings({
        siteName: "Creative N Colourful",
        contactNumber: "+91 9910100120",
        supportEmail: "creativencolourful7777@gmail.com",
        address: "B-14 Amar Colony Lajpat Nagar IV, New Delhi",
      });
    }
  };

  useEffect(() => {
    handleFetchSetting();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email address";
    if (!formData.Phone.trim()) e.Phone = "Phone is required";
    if (!formData.subject) e.subject = "Please select a subject";
    if (!formData.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all fields correctly");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://www.api.creativencolourful.com/api/v1/support-request",
        formData,
      );
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", Phone: "", message: "" });
      toast.success(res.data.message || "Message sent successfully!");
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const siteName = settings.siteName || "Creative N Colourful";

  const infoCards = [
    {
      icon: <IPhone />,
      label: "Call Us",
      value: settings.contactNumber || "+91 9910100120",
      sub: "Mon–Sat  10 AM – 6 PM",
    },
    {
      icon: <IMail />,
      label: "Email",
      value: settings.supportEmail || "creativencolourful7777@gmail.com",
      sub: "Reply within 24 hours",
    },
    {
      icon: <IPin />,
      label: "Address",
      value: settings.address || "B-14 Amar Colony, Lajpat Nagar IV",
      sub: "Visit our store",
    },
    {
      icon: <IClock />,
      label: "Store Hours",
      value: "Mon – Sat",
      sub: "10:00 AM – 6:00 PM",
    },
  ];

  const qiItems = [
    {
      icon: <IPhone />,
      label: "Phone",
      val: settings.contactNumber || "+91 9910100120",
    },
    {
      icon: <IMail />,
      label: "Email",
      val: settings.supportEmail || "support@example.com",
    },
    {
      icon: <IPin />,
      label: "Address",
      val: settings.address || "New Delhi, India",
    },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="cp-root">
        {/* ── HERO ── */}
        <section className="cp-hero">
          <div className="cp-blob cp-blob-1" />
          <div className="cp-blob cp-blob-2" />
          <div className="cp-blob cp-blob-3" />

          <div className="cp-hero-inner">
            <div className="cp-badge cp-au cp-d1">
              <span className="cp-dot" />
              {siteName}
            </div>
            <h1 className="cp-au cp-d2">
              Get in <em>Touch</em>
            </h1>
            <p className="cp-hero-sub cp-au cp-d3">
              Have questions about our handcrafted products? We're here — reach
              out and let's connect.
            </p>
          </div>
        </section>

        {/* ── INFO CARDS ── */}
        <div className="cp-info-grid">
          {infoCards.map((card, i) => (
            <div key={i} className={`cp-info-card cp-au cp-d${i + 1}`}>
              <div className="cp-ic-icon">{card.icon}</div>
              <p className="cp-ic-label">{card.label}</p>
              <p className="cp-ic-val">{card.value}</p>
              <p className="cp-ic-sub">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── MAIN ── */}
        <div className="cp-main">
          {/* Form Card */}
          <div className="cp-form-card cp-au cp-d2">
            <div className="cp-fh">
              <h2>Send us a Message</h2>
              <p>
                We'd love to hear from you. Drop us a line and we'll respond as
                soon as possible.
              </p>
            </div>

            {isSubmitted && (
              <div className="cp-success">
                <div className="cp-s-check">
                  <ICheck />
                </div>
                <div>
                  <p className="cp-s-title">Message Sent Successfully!</p>
                  <p className="cp-s-sub">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="cp-row">
                <div className={`cp-field${errors.name ? " err" : ""}`}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <span className="cp-err-msg">{errors.name}</span>
                  )}
                </div>
                <div className={`cp-field${errors.email ? " err" : ""}`}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <span className="cp-err-msg">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="cp-row">
                <div className={`cp-field${errors.Phone ? " err" : ""}`}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXXXXXXX"
                  />
                  {errors.Phone && (
                    <span className="cp-err-msg">{errors.Phone}</span>
                  )}
                </div>
                <div className={`cp-field${errors.subject ? " err" : ""}`}>
                  <label>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a subject…</option>
                    <option value="order">Order &amp; Shipping</option>
                    <option value="returns">Returns &amp; Refunds</option>
                    <option value="product">Product Questions</option>
                    <option value="bulk">Bulk Orders</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <span className="cp-err-msg">{errors.subject}</span>
                  )}
                </div>
              </div>

              <div className={`cp-field${errors.message ? " err" : ""}`}>
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell us how we can help you…"
                />
                {errors.message && (
                  <span className="cp-err-msg">{errors.message}</span>
                )}
              </div>

              <button type="submit" className="cp-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="cp-spinner" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <ISend />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <p className="cp-privacy">
                🔒 We respect your privacy. Your information is safe with us.
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="cp-sidebar cp-au cp-d3">
            <div className="cp-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224321.99615187824!2d77.05362179185872!3d28.538782213942742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdf0017871669%3A0x19f6e3672f8e9e3e!2sJai%20Hind!5e0!3m2!1sen!2sin!4v1757331443153!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              />
            </div>

            <div className="cp-qi-card">
              <p className="cp-qi-title">Contact Details</p>
              {qiItems.map((item, i) => (
                <div key={i} className="cp-qi-item">
                  <div className="cp-qi-ico">{item.icon}</div>
                  <div>
                    <p className="cp-qi-lbl">{item.label}</p>
                    <p className="cp-qi-val">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {settings.socialMediaLinks && (
              <div className="cp-social-card">
                <p className="cp-sc-title">Follow Us</p>
                {settings.socialMediaLinks.instagram && (
                  <a
                    href={settings.socialMediaLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cp-sc-link"
                  >
                    <span>Instagram</span>
                    <IArrow />
                  </a>
                )}
                {settings.socialMediaLinks.facebook && (
                  <a
                    href={settings.socialMediaLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cp-sc-link"
                  >
                    <span>Facebook</span>
                    <IArrow />
                  </a>
                )}
                {settings.socialMediaLinks.youtube && (
                  <a
                    href={settings.socialMediaLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cp-sc-link"
                  >
                    <span>YouTube</span>
                    <IArrow />
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* ── FOOTER ── */}
        <footer className="cp-footer">
          Thank you for choosing <strong>{siteName}</strong>
        </footer>
      </div>
    </>
  );
};

export default Contact;
