"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2,
  Truck,
  Phone,
  Mail,
  CreditCard,
  Package,
  ArrowRight,
  Download,
  Printer,
  X,
  Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";
import { findSettings } from "../../utils/Api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  body {
    font-family: 'Lora', serif;
    background: linear-gradient(135deg, var(--primary-cream) 0%, #FAF6EF 100%);
    color: var(--primary-dark);
    line-height: 1.6;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-up {
    animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
  }

  .grain-texture {
    background-image: 
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .no-print { @media print { display: none !important; } }
  .print-section { page-break-inside: avoid; }

  @media print {
    body { background: white; margin: 0; padding: 0; }
    .main-card { box-shadow: none; border: 1px solid #ddd; }
  }
`;

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
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function SuccessPageCOD() {
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token] = useState(sessionStorage.getItem("token_login"));

  // Fetch settings
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const res = await findSettings();
        if (res) setSettings(res);
      } catch (err) {
        console.log("Failed to fetch settings:", err);
      }
    };

    if (token) fetchSettingsData();
  }, [token]);

  // Get order ID from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setOrderId(id);
    } else {
      setError("Order ID missing in URL");
      setLoading(false);
    }
  }, []);

  // Fetch order details
  useEffect(() => {
    if (!orderId || !token) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://www.api.creativencolourful.com/api/v1/my-recent-cod-order/${encodeURIComponent(orderId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError(data.message || "Could not load order details");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  // Calculate totals safely
const totals = useMemo(() => {
  if (!order || !settings) return null;

  const itemsSubtotal =
    order.items?.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    ) ?? 0;

  const shipping = Number(order.shippingAmount ?? 0);

  const taxRate = settings.isTaxEnables ? Number(settings.taxRate || 18) : 0;

  /* taxable amount */
  const taxableAmount = itemsSubtotal + shipping;

  const taxAmount = (taxableAmount * taxRate) / 100;

  const grandTotal = taxableAmount + taxAmount;

  return {
    itemsSubtotal,
    shipping,
    taxRate,
    taxableAmount,
    taxAmount,
    grandTotal,
  };
}, [order, settings]);
  // Download real PDF invoice
  const handleDownloadReceipt = () => {
    if (!order || !totals) {
      alert("Order details not loaded yet.");
      return;
    }

    const siteName = "Creative N Colourful ";
    const companyGST = "22AAAAA0000A1Z5"; // ← Replace with real GSTIN
    const companyAddress = "Creative N Colourful , Mumbai, Maharashtra - 400001";
    const companyEmail = settings?.supportEmail || "support@Creative N Colourful .com";

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Logo + Company Name + TAX INVOICE
    // doc.addImage("https://i.ibb.co/S7v1KXm5/logo.png", "PNG", margin, y, 32, 32);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(42, 31, 20);
    doc.text(siteName.toUpperCase(), margin + 40, y + 12);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("TAX INVOICE", pageWidth - margin, y + 12, { align: "right" });

    y += 28;

    // Company GST & Address
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

    // Invoice Details (right)
    doc.text("Invoice No:", pageWidth - margin - 60, y);
    doc.text(order.orderId || "—", pageWidth - margin, y, { align: "right" });

    doc.text("Date:", pageWidth - margin - 60, y + 6);
    doc.text(formatDate(order.orderDate) || "—", pageWidth - margin, y + 6, { align: "right" });

    y = companyY + 18;

    // Bill To
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Bill To", margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const buyerName = order.shipping?.name || "—";
    const buyerGST = order.shipping?.gst || "—";
    const buyerPhone = order.shipping?.mobileNumber || "—";
    const buyerEmail = order.shipping?.email || "—";
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

    // Items Table
    const tableData = order.items?.map(item => [
      item.name,
      item.size || "—",
      item.quantity,
      formatCurrencySafe(item.price),
      formatCurrencySafe(item.quantity * item.price),
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
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [42, 31, 20],
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

    // Totals
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
      ["Grand Total", formatCurrencySafe(totals.grandTotal)],
    ];

    totalsData.forEach(([label, value], i) => {
      const isTotal = i === totalsData.length - 1;
      doc.setFont("helvetica", isTotal ? "bold" : "normal");
      doc.setFontSize(isTotal ? 11 : 9);
      doc.setTextColor(200, 151, 58 );

      doc.text(label, margin, y + i * 7);
      doc.text(value, pageWidth - margin, y + i * 7, { align: "right" });
    });

    y += totalsData.length * 7 + 20;

    // Thank You & Footer
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

    // Save PDF
    doc.save(`Tax_Invoice_${order.orderId || "Order"}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

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
            Confirming your order...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order || !totals) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] to-[#FAF6EF] flex items-center justify-center p-6 grain-texture">
        <div className="bg-white max-w-lg w-full p-12 rounded-lg shadow-lg border border-[#E8DCC8] text-center">
          <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-serif text-[#2A1F14] mb-3">
            Something went wrong
          </h2>
          <p className="text-[#5C4033] mb-8">{error || "Order details not available"}</p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-[#C8973A] text-white rounded-lg font-medium hover:bg-[#A67828] transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const siteName = "Creative N Colourful ";
  const contactNumber = settings?.contactNumber || "+91 XXXX XXXX";
  const supportEmail = settings?.supportEmail || "support@Creative N Colourful .com";

  return (
    <>
      <style>{styleSheet}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] to-[#FAF6EF] py-12 px-4 md:px-6 grain-texture">
        <div className="max-w-3xl mx-auto">
          <div className="main-card bg-white rounded-lg shadow-xl border border-[#E8DCC8] overflow-hidden glow-soft">
            <div className="h-1 bg-gradient-to-r from-[#C8973A] via-[#81190B] to-[#C8973A]" />

            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="mb-12 animate-fade-up text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#C8973A] to-[#A67828] flex items-center justify-center shadow-lg mb-6">
                  <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>

                <h1 className="text-5xl md:text-6xl font-serif text-[#2A1F14] tracking-tight mb-2">
                  Order Confirmed
                </h1>
                <p className="text-[#5C4033] text-sm font-light tracking-wider">
                  ✦ Your aromatic journey begins ✦
                </p>
                <p className="mt-4 text-[#5C4033]">
                  Order ID:{" "}
                  <span className="font-mono text-[#C8973A] font-medium tracking-wider">
                    {order.orderId}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 no-print animate-fade-up justify-center">
               
                <button
                  onClick={handleDownloadReceipt}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#C8973A] text-[#C8973A] rounded-lg font-medium text-sm hover:bg-[#FDF8F3] transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download Tax Invoice
                </button>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 animate-fade-up">
                {[
                  { label: "Date", value: formatDate(order.orderDate), icon: Package },
                  { label: "Time", value: formatTime(order.orderDate), icon: Truck },
                  { label: "Payment", value: "COD", icon: CreditCard },
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

              {/* Items */}
              <div className="mb-12 animate-fade-up print-section">
                <h2 className="text-sm font-light uppercase tracking-widest text-[#C8973A] mb-6">
                  Your Order
                </h2>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start p-5 bg-[#FDF8F3] border border-[#E8DCC8] rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-[#2A1F14] font-medium mb-1">{item.name}</h3>
                        <p className="text-xs text-[#5C4033]">
                          {item.size} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#C8973A] font-semibold">
                          {formatCurrency(item.quantity * item.price)}
                        </p>
                        <p className="text-xs text-[#5C4033]">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mb-12 animate-fade-up print-section bg-gradient-to-br from-[#FDF8F3] to-white p-8 rounded-lg border border-[#E8DCC8]">
                <h2 className="text-sm font-light uppercase tracking-widest text-[#C8973A] mb-6">
                  Payment Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5C4033]">Subtotal</span>
                    <span>{formatCurrency(totals.itemsSubtotal)}</span>
                  </div>

                  {totals.taxRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C4033]">GST ({totals.taxRate}%)</span>
                      <span>{formatCurrency(totals.taxAmount)}</span>
                    </div>
                  )}

                  {totals.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C4033]">Shipping</span>
                      <span>{formatCurrency(totals.shipping)}</span>
                    </div>
                  )}

                  {totals.codFeeDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span>COD Advance Discount</span>
                      <span>-{formatCurrency(totals.codFeeDiscount)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E8DCC8] pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-light uppercase tracking-wider text-[#5C4033]">
                    Total Payable at Delivery
                  </span>
                  <span className="text-3xl font-serif text-[#C8973A]">
                    {formatCurrency(totals.grandTotal)}
                  </span>
                </div>

                <p className="text-xs text-[#5C4033] mt-6 font-light text-center italic">
                  Please keep exact change ready. Delivery partner will collect{" "}
                  <strong>{formatCurrency(totals.grandTotal)}</strong> on arrival.
                </p>
              </div>

              {/* Delivery Address */}
              <div className="mb-12 animate-fade-up print-section">
                <h2 className="text-sm font-light uppercase tracking-widest text-[#C8973A] mb-6">
                  Delivery Address
                </h2>

                <div className="bg-white p-6 rounded-lg border border-[#E8DCC8]">
                  <p className="text-[#2A1F14] font-medium mb-2">{order.shipping.name}</p>
                  <p className="text-sm text-[#5C4033] leading-relaxed">
                    {order.shipping.addressLine}
                    <br />
                    {order.shipping.city}, {order.shipping.state} – {order.shipping.postCode}
                  </p>
                  {order.shipping.addressType && (
                    <span className="inline-block mt-3 px-3 py-1 bg-[#FDF8F3] text-[#C8973A] rounded-full text-xs">
                      {order.shipping.addressType}
                    </span>
                  )}

                  <div className="mt-6 space-y-2 border-t border-[#E8DCC8] pt-4">
                    <div className="flex items-center gap-3 text-sm text-[#5C4033]">
                      <Phone className="w-4 h-4 text-[#C8973A] opacity-60" />
                      <span>{order.shipping.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#5C4033]">
                      <Mail className="w-4 h-4 text-[#C8973A] opacity-60" />
                      <span>{order.shipping.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="text-center no-print">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8973A] text-white rounded-lg font-medium hover:bg-[#A67828] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="mt-6 text-xs text-[#5C4033] font-light tracking-wider">
                  Thank you for choosing {siteName}
                  <br />
                  Where every spice tells a story
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#2A1F14] text-[#FAF6EF] py-5 px-8 text-center text-xs font-light">
              © {new Date().getFullYear()} {siteName} • Pure • Aromatic • Handcrafted
            </div>
          </div>
        </div>
      </div>
    </>
  );
}