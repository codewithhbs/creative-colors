"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  Phone,
  X,
  ShoppingBag,
  Mail,
  Printer,
  Download,
  Leaf,
} from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const API_BASE = "https://www.api.creativencolourful.com/api/v1";

const styleSheet = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Lora:wght@400;500;600&display=swap');

  :root {
    --primary-cream: #FDF8F3;
    --primary-dark: #2A1F14;
    --primary-gold: #C8973A;
    --accent-warm: #A67828;
    --accent-red: #81190B;
    --text-light: #5C4033;
    --border-soft: #E8DCC8;
    --success-green: #6B9E7E;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes softGlow {
    0%, 100% {
      box-shadow: 0 8px 32px rgba(168, 120, 40, 0.08);
    }
    50% {
      box-shadow: 0 8px 48px rgba(168, 120, 40, 0.15);
    }
  }

  .animate-fade-up {
    animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
  }

  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }

  .glow-soft {
    animation: softGlow 3s ease-in-out infinite;
  }

  .grain-texture {
    background-image: 
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .ornament::before,
  .ornament::after {
    content: '✦';
    color: var(--primary-gold);
    opacity: 0.6;
    margin: 0 8px;
  }

  @media print {
    body {
      background: white;
      margin: 0;
      padding: 0;
    }
    .no-print {
      display: none !important;
    }
    .main-card {
      box-shadow: none;
      border: 1px solid #ddd;
    }
  }

  @media (max-width: 768px) {
    .header-grid {
      grid-template-columns: 1fr;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// Helper function (add this at top of your file)
const formatCurrencySafe = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return "₹" + Number(amount ?? 0).toFixed(2);
  }
}

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateFull(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SuccessPage() {
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Extract order ID from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const dataParam = params.get("data") || params.get("orderId") || params.get("id");

      if (dataParam) {
        setOrderId(dataParam);
      } else {
        setError("Order id not found in URL.");
        setLoading(false);
      }

      const t = sessionStorage.getItem("token_login") || null;
      setToken(t);
    } catch (err) {
      console.error(err);
      setError("Unable to read URL parameters.");
      setLoading(false);
    }
  }, []);

  // Fetch order and settings
  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        // Fetch order
        const orderUrl = `${API_BASE}/my-recent-order/${encodeURIComponent(orderId)}`;
        const orderResp = await axios.get(orderUrl, { headers });
        console.log(orderResp?.data?.data)
        if (orderResp?.data?.success && orderResp?.data?.data) {
          setOrder(orderResp?.data?.data);
        } else {
          setError(orderResp.data?.message || "Order not found");
        }

        // Fetch settings
        try {
          const settingsUrl = `${API_BASE}/admin/settings`;
          const settingsResp = await axios.get(settingsUrl, { headers });
          if (settingsResp.data?.success && settingsResp.data?.data) {
            setSettings(settingsResp.data.data);
          }
        } catch (err) {
          console.log("Settings fetch failed, using defaults");
        }
      } catch (err) {
        console.error("Fetch error:", err);

        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("You are not logged in. Please login to view this order.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load order. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, token]);

  // Calculate totals with GST
  const calculateTotals = () => {
    if (!order || !settings) return null;

    const itemsSubtotal = order.items?.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    ) ?? 0;

    const taxRate = settings.isTaxEnables ? settings.taxRate || 18 : 0;
    const taxAmount = (itemsSubtotal * taxRate) / 100;
    const itemsWithTax = itemsSubtotal + taxAmount;

    const shipping = order.shippingAmount ?? 0;
    const discount = order.offerId ? (order.totalAmount - order.payAmt) || 0 : 0;

    const grandTotal = order.payAmt ?? itemsWithTax + shipping - discount;

    return {
      itemsSubtotal,
      taxRate,
      taxAmount,
      itemsWithTax,
      shipping,
      discount,
      grandTotal,
    };
  };

  const totals = calculateTotals();

  // Generate PDF Receipt
  const handleDownloadPDF = () => {
    if (!order || !totals) return;

    const siteName = settings?.siteName || "Creative N Colourful ";
    const companyGST = "22AAAAA0000A1Z5"; 
    const companyAddress = "Creative N Colourful , Mumbai, Maharashtra - 400001";
    const companyEmail = settings?.supportEmail || "support@Creative N Colourful .com";

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 8;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // ── Logo + Company Name + TAX INVOICE ──────────────────────────────
    doc.addImage("https://i.ibb.co/7x12jcpj/alogo.png", "PNG", margin, y, 32, 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(42, 31, 20);
    doc.text(siteName.toUpperCase(), margin + 40, y + 12);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("TAX INVOICE", pageWidth - margin, y + 12, { align: "right" });

    y += 28;

    // Company GST & Address (left)
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);

    doc.text("GSTIN:", margin, y);
    doc.text(companyGST, margin + 25, y);

    doc.text("Address:", margin, y + 6);
    const companyAddrLines = doc.splitTextToSize(companyAddress, contentWidth - 80);
    doc.text(companyAddrLines, margin + 25, y + 6);

    let companyY = y + 6 + (companyAddrLines.length - 1) * 5;

    doc.text("Email:", margin, companyY + 6);
    doc.text(companyEmail, margin + 25, companyY + 6);

    // Invoice Number & Date (right)
    doc.text("Invoice No:", pageWidth - margin - 60, y);
    doc.text(order.orderId || "—", pageWidth - margin, y, { align: "right" });

    doc.text("Date:", pageWidth - margin - 60, y + 6);
    doc.text(formatDateFull(order.orderDate) || "—", pageWidth - margin, y + 6, { align: "right" });

    y = companyY + 18;

    // ── Bill To (Buyer Details) ────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Bill To", margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const buyerName = order.shipping?.name || user?.name || "—";
    const buyerGST = order.shipping?.gst || "—";
    const buyerPhone = order.shipping?.mobileNumber || user?.ContactNumber || "—";
    const buyerEmail = order.shipping?.email || user?.Email || "—";
    const buyerAddr = [
      order.shipping?.addressLine || "—",
      `${order.shipping?.city || "—"}, ${order.shipping?.state || "—"} ${order.shipping?.postCode || "—"}`,
    ].filter(Boolean).join(", ");

    const buyerLines = doc.splitTextToSize(buyerAddr, contentWidth - 60);

    doc.text("Name:", margin, y + 8);
    doc.text(buyerName, margin + 25, y + 8);

    doc.text("GSTIN:", margin, y + 14);
    doc.text(buyerGST, margin + 25, y + 14);

    doc.text("Address:", margin, y + 20);
    doc.text(buyerLines, margin + 25, y + 20);

    doc.text("Phone:", margin, y + 20 + buyerLines.length * 5 + 6);
    doc.text(buyerPhone, margin + 25, y + 20 + buyerLines.length * 5 + 6);

    y += 20 + buyerLines.length * 5 + 18;

  

    // ── Items Table ────────────────────────────────────────────────────
    const tableData = order.items?.map(item => [
      item.name,
      item.size || "—",
      item.quantity,
      item.price,
      item.price * item.quantity
    ]) || [];

    autoTable(doc, {
      startY: y,
      head: [["Description", "Size", "Qty", "Rate", "Amount"]],
      body: tableData,
      margin: { left: margin, right: margin },
      theme: "grid",
      headStyles: {
        fillColor: [200, 151, 58],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.1,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [42, 31, 20],
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [253, 248, 243],
      },
      columnStyles: {
        0: { cellWidth: 80, halign: "left" },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 30, halign: "right" },
      },
      styles: { cellPadding: 3, overflow: "linebreak" },
    });

    y = doc.lastAutoTable.finalY + 12;

    // ── Totals ─────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Payment Summary", margin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const totalsData = [
      ["Subtotal", formatCurrencySafe(totals.itemsSubtotal)],
      ...(totals.taxRate > 0 ? [[`GST (${totals.taxRate}%)`, formatCurrencySafe(totals.taxAmount)]] : []),
      ...(totals.shipping > 0 ? [["Shipping", formatCurrencySafe(totals.shipping)]] : []),
      ...(totals.discount > 0 ? [["Discount", `-${formatCurrencySafe(totals.discount)}`]] : []),
      ["Grand Total", formatCurrencySafe(totals.grandTotal)],
    ];

    totalsData.forEach(([label, value], i) => {
      const isTotal = i === totalsData.length - 1;
      doc.setFont("helvetica", isTotal ? "bold" : "normal");
      doc.setFontSize(isTotal ? 11 : 9);
      doc.setTextColor(92, 64, 51);

      doc.text(label, margin, y + i * 7);
      doc.text(value, pageWidth - margin, y + i * 7, { align: "right" });
    });

    y += totalsData.length * 7 + 20;

    // ── Thank You & Footer ────────────────────────────────────────────
    doc.setFontSize(10);
    doc.setTextColor(200, 151, 58);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for shopping with us!", pageWidth / 2, y, { align: "center" });

    y += 10;

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Authorized by ${siteName} | GSTIN: ${companyGST} | For support: ${companyEmail}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`Tax_Invoice_${order.orderId || "Order"}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] to-[#FAF6EF] flex items-center justify-center grain-texture">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#E8DCC8] rounded-full" />
            <div
              className="absolute inset-0 border-4 border-transparent border-t-[#C8973A] rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <p className="text-[#5C4033] font-light tracking-wide">
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] to-[#FAF6EF] flex items-center justify-center p-6 grain-texture">
        <div className="bg-white max-w-lg w-full p-12 rounded-lg shadow-lg border border-[#E8DCC8]">
          <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-serif text-[#2A1F14] mb-3 text-center">
            Oops!
          </h2>
          <p className="text-[#5C4033] mb-8 text-center">{error}</p>
          <div className="flex gap-3 justify-center">
            <a
              href="/login"
              className="px-6 py-3 bg-[#C8973A] text-white rounded-lg hover:bg-[#A67828] transition-colors"
            >
              Login
            </a>
            <a
              href="/"
              className="px-6 py-3 border-2 border-[#C8973A] text-[#C8973A] rounded-lg hover:bg-[#FDF8F3] transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!order || !totals) {
    return null;
  }

  const siteName = settings?.siteName || "Creative N Colourful ";
  const contactEmail = settings?.supportEmail || "support@grandmasala.com";
  const contactPhone = settings?.contactNumber || "+91 XXXX XXXX";

  return (
    <>
      <style>{styleSheet}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] to-[#FAF6EF] py-12 px-4 md:px-6 grain-texture">
        <div className="max-w-4xl mx-auto">
          {/* Success Card */}
          <div className="main-card bg-white rounded-lg shadow-xl border border-[#E8DCC8] overflow-hidden  animate-fade-up">
            {/* Decorative header */}
            <div className="h-1 " />

            <div className="p-8 md:p-12">
              {/* Header with checkmark */}
              <div className="flex items-center justify-center mb-8 animate-fade-up stagger-1">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C8973A] to-[#A67828] flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Main heading */}
              <div className="text-center mb-8 animate-fade-up stagger-1">
                <h1 className="text-5xl md:text-6xl font-serif text-[#2A1F14] tracking-tight mb-3">
                  Order Confirmed
                </h1>
                <p className="text-[#5C4033] text-sm font-light tracking-wider mb-4">
                  ✦ Your aromatic journey begins ✦
                </p>
                <p className="text-[#5C4033]">
                  Order ID:{" "}
                  <span className="font-mono text-[#C8973A] font-medium tracking-wider">
                    {order.orderId}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 no-print justify-center animate-fade-up stagger-2">

                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#C8973A] text-[#C8973A] rounded-lg font-medium text-sm hover:bg-[#FDF8F3] transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Receipt
                </button>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-12 animate-fade-up stagger-3">
                {[
                  { label: "Date", value: formatDate(order.orderDate), icon: Package },
                  { label: "Time", value: formatTime(order.orderDate), icon: Truck },
                  { label: "Payment", value: order.paymentType || "COD", icon: CreditCard },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-[#FDF8F3] rounded-lg border border-[#E8DCC8]">
                    <item.icon className="w-5 h-5 text-[#C8973A] mx-auto mb-2 opacity-60" />
                    <p className="text-xs font-light text-[#5C4033] uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-[#2A1F14]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Items Section */}
              <div className="mb-12 animate-fade-up stagger-3">
                <h2 className="text-sm font-light uppercase tracking-widest text-[#C8973A] mb-6 ornament">
                  Your Order
                </h2>

                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start p-5 bg-[#FDF8F3] border border-[#E8DCC8] rounded-lg hover:border-[#C8973A] transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-[#2A1F14] font-medium mb-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#5C4033] font-light">
                          {item.size || "—"} {item.color ? `• ${item.color}` : ""} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#C8973A] font-semibold">
                          {formatCurrency(item.quantity * item.price)}
                        </p>
                        <p className="text-xs text-[#5C4033] font-light">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Shipping Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-fade-up stagger-4">
                {/* Payment Card */}
                <div className="bg-gradient-to-br from-[#FDF8F3] to-white p-6 rounded-lg border border-[#E8DCC8]">
                  <h3 className="text-sm font-light uppercase tracking-widest text-[#C8973A] mb-4 ornament">
                    Payment Details
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#5C4033] font-light">Method</span>
                      <span className="text-[#2A1F14] font-medium">
                        {order.payment?.method ||
                          order.paymentType ||
                          "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C4033] font-light">Status</span>
                      <span className="text-[#2A1F14] font-medium">
                        {order.payment?.isPaid
                          ? "Paid"
                          : order.payment?.status || "Pending"}
                      </span>
                    </div>
                    <div className="border-t border-[#E8DCC8] pt-3">
                      <div className="flex justify-between">
                        <span className="text-[#5C4033] font-light">
                          Total Paid
                        </span>
                        <span className="text-[#C8973A] font-semibold">
                          {formatCurrency(totals.grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Card */}
                <div className="bg-gradient-to-br from-[#FDF8F3] to-white p-6 rounded-lg border border-[#E8DCC8]">
                  <h3 className="text-sm font-light uppercase tracking-widest text-[#C8973A] mb-4 ornament">
                    Shipping Address
                  </h3>

                  <div className="text-sm text-[#5C4033] font-light space-y-1">
                    <p className="font-medium text-[#2A1F14]">
                      {order.shipping?.name || "—"}
                    </p>
                    <p>{order.shipping?.addressLine || "—"}</p>
                    <p>
                      {order.shipping?.city}, {order.shipping?.state} -{" "}
                      {order.shipping?.postCode}
                    </p>
                    {order.shipping?.addressType && (
                      <p className="text-xs">
                        Type: {order.shipping?.addressType}
                      </p>
                    )}
                    <p className="flex items-center gap-2 pt-2">
                      <Phone className="w-4 h-4 text-[#C8973A]" />
                      {order.shipping?.mobileNumber}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#C8973A]" />
                      {order.shipping?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Summary Section */}
              <div className="mb-12 animate-fade-up stagger-4 bg-gradient-to-br from-[#FDF8F3] to-white p-8 rounded-lg border border-[#E8DCC8]">
                <h2 className="text-sm font-light uppercase tracking-widest text-[#C8973A] mb-6 ornament">
                  Payment Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5C4033] font-light">Subtotal</span>
                    <span className="text-[#2A1F14] font-medium">
                      {formatCurrency(totals.itemsSubtotal)}
                    </span>
                  </div>

                  {totals.taxRate > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5C4033] font-light">
                          GST ({totals.taxRate}%)
                        </span>
                        <span className="text-[#2A1F14] font-medium">
                          {formatCurrency(totals.taxAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-[#5C4033] font-light">
                          Subtotal (after tax)
                        </span>
                        <span className="text-[#2A1F14] font-medium">
                          {formatCurrency(totals.itemsWithTax)}
                        </span>
                      </div>
                    </>
                  )}

                  {totals.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C4033] font-light">
                        Shipping
                      </span>
                      <span className="text-[#2A1F14] font-medium">
                        {formatCurrency(totals.shipping)}
                      </span>
                    </div>
                  )}

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C4033] font-light">
                        Discount
                      </span>
                      <span className="text-[#6B9E7E] font-medium">
                        -{formatCurrency(totals.discount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E8DCC8] pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-light text-[#5C4033] uppercase tracking-wider">
                    Total Payable
                  </span>
                  <span className="text-3xl font-serif text-[#C8973A]">
                    {formatCurrency(totals.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Store Info Footer */}
              <div className="mb-8 p-6 bg-gradient-to-r from-[#FDF8F3] to-white rounded-lg border border-[#E8DCC8] text-center no-print animate-fade-up stagger-5">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Leaf className="w-4 h-4 text-[#C8973A] opacity-60" />
                  <p className="text-xs font-light text-[#5C4033] uppercase tracking-wider">
                    {siteName}
                  </p>
                  <Leaf className="w-4 h-4 text-[#C8973A] opacity-60" />
                </div>
                <p className="text-xs text-[#5C4033] font-light mb-3">
                  Questions? We're here to help
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-[#5C4033] font-light">
                  <a
                    href={`tel:${contactPhone}`}
                    className="hover:text-[#C8973A] transition-colors"
                  >
                    {contactPhone}
                  </a>
                  <span>•</span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-[#C8973A] transition-colors"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center no-print animate-fade-up stagger-5">
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8973A] text-white rounded-lg font-medium hover:bg-[#A67828] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </a>

                <p className="mt-6 text-xs text-[#5C4033] font-light tracking-wider">
                  Thank you for choosing {siteName}
                  <br />
                  Where every spice tells a story
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#2A1F14] text-[#FAF6EF] py-5 px-8 text-center text-xs font-light">
              © {new Date().getFullYear()} {siteName} • Pure • Aromatic •
              Handcrafted
            </div>
          </div>
        </div>
      </div>
    </>
  );
}