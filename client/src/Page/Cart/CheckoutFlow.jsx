"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  ShoppingCart, ChevronLeft, ChevronRight,
  Plus, Minus, Leaf, Star, ArrowRight, Shield, Truck, RotateCcw,
  Check, Trash2, Loader2,
  User,
  MapPin,
  CreditCard,
  Smartphone,
  CheckCircle,
  Package,
  AlertCircle,
  X
} from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import {
  setCurrentStep, setError, clearError, updateAddress, setPaymentMethod,
  calculateTotals, removeCoupon, loadAppliedCoupon, resetCheckout,
  fetchSettings, createOrder,
} from "../store/slices/checkoutSlice"
import { fetchUserDetails } from "../store/slices/userSlice"
import { clearCart } from "../store/slices/cartSlice"
import axios from "axios"
import { toast } from "react-toastify"

import Step0_GuestDetails   from "./Step0_GuestDetails"
import Step1_Address        from "./Step1_Address"
import Step2_Payment        from "./Step2_Payment"
import Step3_OnlinePayment  from "./Step3_OnlinePayment"
import Step4_CODConfirm     from "./Step4_CODConfirm"

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price || 0)
}

/* ── Shared CSS injected once ── */
const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@1,300;1,400&display=swap');

  :root {
    --gold:     #C8973A;
    --gold-d:   #A67828;
    --ink:      #2A1F14;
    --cream:    #FAF6EF;
    --sage:     #4E6845;
    --border:   rgba(200,151,58,0.18);
  }

  .co-card { background: rgba(250,246,239,0.92); border: 1px solid var(--border); border-radius: 20px; padding: 24px; backdrop-filter: blur(12px); box-shadow: 0 4px 28px rgba(42,31,20,0.07); }
  .co-card-header { display:flex; align-items:center; gap:14px; margin-bottom:22px; }
  .co-icon-wrap { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow: 0 4px 12px rgba(42,31,20,0.18); }
  .co-card-title { font-family:'poppins',serif; font-size:clamp(1.05rem,2.5vw,1.25rem); font-weight:700; color:#2A1F14; margin:0; letter-spacing:-0.01em; }
  .co-card-sub { font-family:'DM Sans',sans-serif; font-size:0.78rem; color:rgba(42,31,20,0.45); font-weight:300; margin:2px 0 0; }

  .co-grid { display:grid; grid-template-columns: repeat(12,1fr); gap:12px; margin-bottom:4px; }
  .co-col-3 { grid-column: span 3; }
  .co-col-4 { grid-column: span 4; }
  .co-col-5 { grid-column: span 5; }
  .co-col-6 { grid-column: span 6; }
  .co-col-8 { grid-column: span 8; }
  .co-col-12 { grid-column: span 12; }
  @media (max-width:640px) { .co-col-3,.co-col-4,.co-col-5,.co-col-6,.co-col-8 { grid-column: span 12; } }

  .co-fields { display:flex; flex-direction:column; gap:14px; }
  .co-field { display:flex; flex-direction:column; }
  .co-label { font-family:'DM Sans',sans-serif; font-size:0.62rem; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold); margin-bottom:6px; font-weight:500; }
  .co-input { font-family:'DM Sans',sans-serif; font-size:0.85rem; color:var(--ink); background:rgba(250,246,239,0.8); border:1.5px solid rgba(200,151,58,0.2); border-radius:12px; padding:10px 14px; outline:none; transition:border-color 0.2s, box-shadow 0.2s; width:100%; }
  .co-input:focus { border-color:rgba(200,151,58,0.55); box-shadow: 0 0 0 3px rgba(200,151,58,0.1); }
  .co-input::placeholder { color:rgba(42,31,20,0.3); }

  .co-select-wrap { position:relative; }
  .co-select { font-family:'DM Sans',sans-serif; font-size:0.85rem; color:var(--ink); background:rgba(250,246,239,0.8); border:1.5px solid rgba(200,151,58,0.2); border-radius:12px; padding:10px 34px 10px 14px; outline:none; appearance:none; width:100%; transition:border-color 0.2s; cursor:pointer; }
  .co-select:focus { border-color:rgba(200,151,58,0.55); }
  .co-select-arrow { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--gold); pointer-events:none; font-size:0.75rem; }

  .co-type-btn { font-family:'DM Sans',sans-serif; font-size:0.72rem; padding:6px 14px; border-radius:999px; cursor:pointer; transition:all 0.2s; white-space:nowrap; font-weight:400; }
  .co-payment-btn { width:100%; display:flex; align-items:center; gap:14px; padding:16px; border-radius:16px; border:1.5px solid rgba(200,151,58,0.15); background:transparent; cursor:pointer; transition:all 0.3s cubic-bezier(0.22,1,0.36,1); text-align:left; }

  .co-btn-gold { width:100%; padding:13px; border-radius:14px; font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:500; letter-spacing:0.05em; background:linear-gradient(135deg,#C8973A,#A67828); color:#FAF6EF; border:none; cursor:pointer; box-shadow:0 4px 20px rgba(200,151,58,0.35); transition:box-shadow 0.3s, transform 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .co-btn-gold:hover { box-shadow:0 6px 28px rgba(200,151,58,0.5); transform:translateY(-1px); }
  .co-btn-gold:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

  .co-error { font-family:'DM Sans',sans-serif; font-size:0.75rem; color:#B94040; margin-top:8px; background:rgba(185,64,64,0.06); border:1px solid rgba(185,64,64,0.2); border-radius:10px; padding:8px 12px; }

  .co-spin { animation: co-rotate 0.8s linear infinite; }
  @keyframes co-rotate { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

  @keyframes co-fade-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  .co-enter { animation: co-fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both; }

  .co-step-dot { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; transition:all 0.35s; flex-shrink:0; }
  .co-step-line { flex:1; height:1.5px; max-width:60px; transition:background 0.4s; }
`;

/* ── Step meta ── */
const STEPS = [
  { icon: User,        label: "Details"  },
  { icon: MapPin,      label: "Address"  },
  { icon: CreditCard,  label: "Payment"  },
  { icon: Smartphone,  label: "Online"   },
  { icon: CheckCircle, label: "Confirm"  },
];

/* ── Progress Bar ── */
const ProgressBar = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-0 py-5">
    {STEPS.map((s, i) => {
      const Icon = s.icon;
      const active    = i === currentStep;
      const completed = i < currentStep;
      return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="co-step-dot"
              style={{
                background: active
                  ? "linear-gradient(135deg,#C8973A,#A67828)"
                  : completed
                  ? "#4E6845"
                  : "rgba(200,151,58,0.1)",
                border: active
                  ? "none"
                  : completed
                  ? "none"
                  : "1.5px solid rgba(200,151,58,0.25)",
                boxShadow: active ? "0 4px 14px rgba(200,151,58,0.4)" : "none",
                transform: active ? "scale(1.1)" : "scale(1)",
              }}
            >
              {completed
                ? <CheckCircle size={15} style={{ color: "#FAF6EF" }} />
                : <Icon size={15} style={{ color: active ? "#FAF6EF" : "rgba(42,31,20,0.35)" }} />}
            </div>
            <span style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase",
              color: active ? "#C8973A" : completed ? "#4E6845" : "rgba(42,31,20,0.3)",
              fontWeight: active ? 500 : 300,
            }}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="co-step-line mx-1 sm:mx-2"
              style={{ background: i < currentStep ? "#4E6845" : "rgba(200,151,58,0.15)" }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ── Order Summary Sidebar ── */
const OrderSummary = ({
  cartItems,
  cartSubtotal,
  shipping,
  orderTotal,
  discountAmount,
  appliedCoupon,
  onRemoveCoupon,
  address,
  user,
  paymentMethod,
  setting,
  taxAmount,
  currencySymbol
}) => (
  <div
    className="rounded-2xl sticky top-6"
    style={{
      background: "rgba(250,246,239,0.95)",
      border: "1px solid rgba(200,151,58,0.18)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 8px 40px rgba(42,31,20,0.09)",
      overflow: "hidden"
    }}
  >
    {/* Header */}
    <div
      className="px-5 py-4 flex items-center gap-2.5"
      style={{
        borderBottom: "1px solid rgba(200,151,58,0.12)",
        background: "rgba(200,151,58,0.04)"
      }}
    >
      <Package size={15} style={{ color: "#C8973A" }} />
      <h3 style={{ fontFamily: "'poppins',serif", fontSize: "0.95rem", fontWeight: 600, color: "#2A1F14", margin: 0 }}>
        Order Summary
      </h3>
      <span style={{ marginLeft: "auto", fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: "rgba(42,31,20,0.4)" }}>
        {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
      </span>
    </div>

    {/* Coupon */}
    {appliedCoupon && (
      <div className="mx-4 mt-3 px-3 py-2.5 rounded-xl flex items-center justify-between" style={{ background: "rgba(78,104,69,0.07)", border: "1px solid rgba(78,104,69,0.2)" }}>
        <div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#4E6845" }}>
            🎉 {appliedCoupon.code}
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", color: "rgba(78,104,69,0.7)" }}>
            Coupon applied
          </p>
        </div>
        <button onClick={onRemoveCoupon} style={{ color: "rgba(42,31,20,0.4)", background: "none", border: "none", cursor: "pointer" }}>
          <X size={13} />
        </button>
      </div>
    )}

    {/* Items */}
    <div className="px-4 py-3 flex flex-col gap-2" style={{ maxHeight: 220, overflowY: "auto" }}>
      {cartItems.map(item => (
        <div key={`${item.product}_${item.variantId}`} className="flex items-center gap-3 py-1.5" style={{ borderBottom: "1px solid rgba(200,151,58,0.08)" }}>
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "linear-gradient(135deg,#F5EDD8,#EDE0C4)", border: "1px solid rgba(200,151,58,0.12)" }}>
            <img src={item.image || "/placeholder.svg"} alt={item.product_name} className="w-full h-full object-cover" onError={e => (e.target.src = "/placeholder.svg")} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: "'poppins',serif", fontSize: "0.8rem", fontWeight: 600, color: "#2A1F14", lineHeight: 1.25, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {item.product_name}
            </p>
            {item.size && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", color: "#C8973A" }}>{item.size}</p>}
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: "rgba(42,31,20,0.4)" }}>Qty: {item.quantity}</p>
          </div>
          <p style={{ fontFamily: "'poppins',serif", fontSize: "0.85rem", fontWeight: 700, color: "#2A1F14", flexShrink: 0 }}>
            {currencySymbol}{formatPrice(item.price * item.quantity)}
          </p>
        </div>
      ))}
    </div>

    {/* Price Breakdown */}
    <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(200,151,58,0.1)" }}>
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between"><span className="text-sm text-gray-500">Subtotal</span><span>{currencySymbol}{formatPrice(cartSubtotal)}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Shipping</span><span>{shipping === 0 ? "Free" : `${currencySymbol}${formatPrice(shipping)}`}</span></div>
        {discountAmount > 0 && <div className="flex justify-between text-green-700"><span>Discount ({appliedCoupon?.code})</span><span>-{currencySymbol}{formatPrice(discountAmount)}</span></div>}
        {setting?.isTaxEnables && <div className="flex justify-between text-sm text-gray-500"><span>GST ({setting.taxRate}%)</span><span>{currencySymbol}{formatPrice(taxAmount)}</span></div>}
        <div className="pt-3 flex justify-between items-center" style={{ borderTop: "1px solid rgba(200,151,58,0.15)" }}>
          <span style={{ fontFamily: "'poppins',serif", fontSize: "0.95rem", fontWeight: 600 }}>Total</span>
          <span style={{ fontFamily: "'poppins',serif", fontSize: "1.3rem", fontWeight: 800 }}>{currencySymbol}{formatPrice(orderTotal)}</span>
        </div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN CHECKOUT FLOW
════════════════════════════════════════ */
const CheckoutFlow = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(s => s.cart);
  const {
    currentStep, loading, error, address, paymentMethod,
    cartSubtotal, shipping, orderTotal, discountAmount,
    taxAmount, currencySymbol,
    appliedCoupon, settings: reduxSettings,
  } = useSelector(s => s.checkout);
  

  const [guestDetails, setGuestDetails]       = useState({ Email: "", ContactNumber: "" });
  const [guestSubmitting, setGuestSubmitting] = useState(false);
  const [codAdvancePaid, setCodAdvancePaid]   = useState(false);
  const [user, setUser]                       = useState({});
  const [pageLoading, setPageLoading]         = useState(true);
  const [setting, setSetting]                 = useState(null);

  // New: Order processing / verification loading
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("Verifying payment...");

  /* ── Bootstrap ── */
  useEffect(() => {
  const boot = async () => {
    try {
      const storedCart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
      const storedCoupon = sessionStorage.getItem("appliedCoupon");
      const couponData = storedCoupon ? JSON.parse(storedCoupon) : null;

      // ✅ STEP 1: Settings pehle fetch karo
      const settingsRes = await axios.get("https://www.api.creativencolourful.com/api/v1/admin/settings");
      if (settingsRes.data?.data) {
        setSetting(settingsRes.data.data);
      }

      // ✅ STEP 2: fetchSettings dispatch karo aur WAIT karo
      await dispatch(fetchSettings()).unwrap();

      // ✅ STEP 3: AB calculateTotals — ab state.settings populated hai
      dispatch(loadAppliedCoupon());
      dispatch(calculateTotals({ cartItems: storedCart, appliedCoupon: couponData }));

      // STEP 4: User fetch
      const token = sessionStorage.getItem("token_login");
      if (token) {
        dispatch(fetchUserDetails());
        try {
          const { data } = await axios.get("https://www.api.creativencolourful.com/api/v1/my-details", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data.data || {});

          const lastOrder = await axios.get("https://www.api.creativencolourful.com/api/v1/my-last-order", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (lastOrder.data?.success && lastOrder.data.order?.shipping) {
            const s = lastOrder.data.order.shipping;
            dispatch(updateAddress({
              name: s.name || "", city: s.city || "", state: s.state || "",
              postCode: s.postCode || "", addressType: s.addressType || "", addressLine: s.addressLine || ""
            }));
          }
        } catch {}

        dispatch(setCurrentStep(1));
      } else {
        dispatch(setCurrentStep(0));
      }

      // Razorpay script
      if (!document.getElementById("rzp-script")) {
        const s = document.createElement("script");
        s.id = "rzp-script";
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.async = true;
        document.body.appendChild(s);
      }

    } catch (err) {
      console.error("Checkout boot error:", err);
    } finally {
      setPageLoading(false);
    }
  };
  boot();
  return () => { dispatch(resetCheckout()); };
}, [dispatch]);

  /* ── Step handlers ── */
  const handleGuestSubmit = async () => {
    const { Email, ContactNumber } = guestDetails;
    if (!Email || !ContactNumber) { dispatch(setError("Please enter both email and contact number")); return; }
    try {
      dispatch(clearError());
      setGuestSubmitting(true);
      const res = await axios.post("https://www.api.creativencolourful.com/api/v1/create_user_from_cart", { Email, ContactNumber });
      if (res.data?.success) {
        const { token } = res.data;
        if (token) sessionStorage.setItem("token_login", token);
        dispatch(fetchUserDetails());
        dispatch(setCurrentStep(1));
      } else {
        dispatch(setError(res.data?.message || "Failed to register"));
      }
    } catch { dispatch(setError("Failed to register. Please try again.")); }
    finally { setGuestSubmitting(false); }
  };

  const handleAddressSubmit = () => {
    const { name, city, state, postCode, addressLine, addressType } = address;
    if (!name || !city || !state || !postCode || !addressLine || !addressType) {
      dispatch(setError("Please fill in all address fields")); return;
    }
    dispatch(clearError());
    dispatch(setCurrentStep(2));
  };

  const handlePaymentSelect = (method) => {
    dispatch(setPaymentMethod(method));
    dispatch(setCurrentStep(method === "COD" ? 4 : 3));
  };

  const handleCreateOrder = async () => {
    const token = sessionStorage.getItem("token_login");

    if (!token) {
      dispatch(setError("Please enter your details to continue"));
      dispatch(setCurrentStep(0));
      return;
    }

    setOrderProcessing(true);
    setProcessingMessage(
      paymentMethod === "COD" 
        ? "Placing your COD order..." 
        : "Processing payment & verifying..."
    );

    const orderData = {
      items: cartItems.map(item => ({
        product_id: item.product,
        product_name: item.product_name,
        Qunatity: item.quantity,
        price_after_discount: item.price,
        Varient_id: item.variantId || "N/A",
        size: item.size || "N/A",
      })),
      totalAmount: cartSubtotal,
      payAmt: orderTotal,
      paymentType: paymentMethod,
      isVarientInCart: cartItems.some(i => i.variantId),
      offerId: appliedCoupon?.offerId || null,
      codFeePaid: true,
      shipping: {
        ...address,
        mobileNumber: user?.ContactNumber,
        email: user?.Email,
      },
      discountAmount,
      shippingAmount: shipping,
      couponCode: appliedCoupon?.code || null,
    };

    /* ── COD ORDER ── */
    if (paymentMethod === "COD") {
      try {
        const res = await axios.post(
          "https://www.api.creativencolourful.com/api/v1/create-cod-order",
          { orderData, amount: shipping || 50 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          // Fake verification delay (2–3 seconds)
          await new Promise(r => setTimeout(r, 2500));

          dispatch(clearCart());
          sessionStorage.removeItem("cartItems");
          sessionStorage.removeItem("appliedCoupon");

          toast.success("COD Order placed successfully!", { position: "top-center" });
          window.location.href = res.data.redirectUrl || "/order-success";
        } else {
          dispatch(setError("Failed to place COD order"));
        }
      } catch (error) {
        dispatch(setError("Unable to place COD order"));
      } finally {
        setOrderProcessing(false);
      }
      return;
    }

    /* ── ONLINE PAYMENT (Razorpay) ── */
    try {
      const result = await dispatch(createOrder({ orderData, token }));

      if (!createOrder.fulfilled.match(result)) {
        setOrderProcessing(false);
        return;
      }

      const { razorpayOrderId, amount, currency, rezorPayKey } = result.payload;
      console.log("razorpayOrderId",razorpayOrderId)

      const rzp = new window.Razorpay({
        key: rezorPayKey,
        amount: amount * 100,
        currency: currency || "INR",
        name: setting?.siteName || "Creative N Colourful ",
        description: "Order payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          setProcessingMessage("Verifying payment... Please wait");

          try {
            const verify = await axios.post(
              "https://www.api.creativencolourful.com/api/v1/verify-payment",
              response
            );

            if (verify.data.success) {
              // Fake final verification delay
              await new Promise(r => setTimeout(r, 2000));

              dispatch(clearCart());
              sessionStorage.removeItem("cartItems");
              sessionStorage.removeItem("appliedCoupon");

              toast.success("Payment successful! Order placed.", { position: "top-center" });
              window.location.href = verify.data.redirectUrl || "/order-success";
            } else {
              dispatch(setError("Payment verification failed."));
              toast.error("Payment verification failed.");
            }
          } catch {
            dispatch(setError("Payment verification error."));
            toast.error("Payment verification error.");
          } finally {
            setOrderProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setOrderProcessing(false);
            toast.info("Payment cancelled.");
          }
        }
      });

      rzp.open();
    } catch (err) {
      dispatch(setError("Failed to place order. Please try again."));
      setOrderProcessing(false);
    }
  };

  if (pageLoading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(160deg,#FAF6EF 0%,#F2E8D5 55%,#FAF6EF 100%)" }}>
      <div className="flex flex-col items-center gap-3">
        <div style={{ width: 40, height: 40, border: "2.5px solid rgba(200,151,58,0.2)", borderTopColor: "#C8973A", borderRadius: "50%", animation: "co-rotate 0.8s linear infinite" }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "rgba(42,31,20,0.4)" }}>Loading checkout…</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Shared styles */}
      <style>{SHARED_STYLES}</style>

      {/* Processing Overlay */}
      {orderProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white/95 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Loader2 size={64} className="text-amber-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-4 border-amber-200 animate-ping" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {processingMessage}
                </h3>
                <p className="text-sm text-gray-600">
                  Please do not close this window. This may take a few seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#FAF6EF 0%,#F2E8D5 55%,#FAF6EF 100%)" }}>
        {/* Grain */}
        <div className="fixed inset-0 pointer-events-none opacity-20 z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundSize: "180px" }} />

        {/* Top header */}
        <div className="relative z-10 border-b" style={{ borderColor: "rgba(200,151,58,0.12)", background: "rgba(250,246,239,0.8)", backdropFilter: "blur(16px)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-3">
              <button
                onClick={() => currentStep > 0 ? dispatch(setCurrentStep(currentStep - 1)) : window.history.back()}
                className="flex items-center gap-1.5 transition-colors"
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: "rgba(42,31,20,0.45)", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.color = "#C8973A"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(42,31,20,0.45)"}
              >
                <ChevronLeft size={14} /> Back
              </button>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <Leaf size={12} style={{ color: "#C8973A" }} />
                  <span style={{ fontFamily: "'poppins',serif", fontSize: "1rem", fontWeight: 700, color: "#2A1F14", letterSpacing: "-0.01em" }}>
                    {setting?.siteName?.split(" ")[0] || "Creative N Colourful "}
                  </span>
                </div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,151,58,0.6)" }}>
                  Secure Checkout
                </span>
              </div>

              <div style={{ width: 48 }} />
            </div>

            <ProgressBar currentStep={currentStep} />
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-7 lg:py-10">

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl flex items-center gap-3 co-enter"
              style={{ background: "rgba(185,64,64,0.06)", border: "1px solid rgba(185,64,64,0.2)" }}>
              <AlertCircle size={16} style={{ color: "#B94040", flexShrink: 0 }} />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "#B94040", flex: 1 }}>{error}</p>
              <button onClick={() => dispatch(clearError())} style={{ color: "rgba(185,64,64,0.5)", background: "none", border: "none", cursor: "pointer" }}>
                <X size={14} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Steps */}
            <div className="lg:col-span-2 co-enter">
              {currentStep === 0 && (
                <Step0_GuestDetails
                  guestDetails={guestDetails}
                  setGuestDetails={setGuestDetails}
                  onSubmit={handleGuestSubmit}
                  loading={guestSubmitting}
                  error={error}
                />
              )}
              {currentStep === 1 && (
                <Step1_Address
                  address={address}
                  updateAddress={fields => dispatch(updateAddress(fields))}
                  onSubmit={handleAddressSubmit}
                  error={error}
                />
              )}
              {currentStep === 2 && (
                <Step2_Payment
                  onSelect={handlePaymentSelect}
                  setting={setting}
                />
              )}
              {currentStep === 3 && (
                <Step3_OnlinePayment
                  orderTotal={orderTotal}
                  onPay={handleCreateOrder}
                  loading={loading}
                  setting={setting}
                />
              )}
              {currentStep === 4 && paymentMethod === "COD" && (
                <Step4_CODConfirm
                  orderTotal={orderTotal}
                  codAdvancePaid={codAdvancePaid}
                  onPayAdvance={handleCreateOrder}
                  loading={loading}
                  setting={setting}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                cartSubtotal={cartSubtotal}
                taxAmount={taxAmount}
                currencySymbol={currencySymbol}
                shipping={shipping}
                orderTotal={orderTotal}
                discountAmount={discountAmount}
                appliedCoupon={appliedCoupon}
                onRemoveCoupon={() => { dispatch(removeCoupon()); dispatch(calculateTotals({ cartItems, appliedCoupon: null })); }}
                address={address}
                user={user}
                paymentMethod={paymentMethod}
                setting={setting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutFlow;