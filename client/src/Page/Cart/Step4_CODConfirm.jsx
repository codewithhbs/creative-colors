import React from "react";
import { Truck, CheckCircle, Loader, Leaf } from "lucide-react";

const Step4_CODConfirm = ({ orderTotal, codAdvancePaid, onPayAdvance, loading, setting }) => {
  const codFee = setting?.shippingCost || 40;
  const siteName = setting?.siteName || "Creative N Colourful ";

  return (
    <div className="co-card">
      <div className="co-card-header">
        <div className="co-icon-wrap" style={{ background: "linear-gradient(135deg,#4E6845,#3a5032)" }}>
          <Truck size={18} style={{ color: "#FAF6EF" }} />
        </div>
        <div>
          <h2 className="co-card-title">Confirm Your Order</h2>
          <p className="co-card-sub">Cash on Delivery — pay when it arrives</p>
        </div>
      </div>

      {/* Order total */}
      <div className="rounded-2xl p-5 text-center my-4"
        style={{ background: "linear-gradient(135deg,rgba(78,104,69,0.06),rgba(78,104,69,0.03))", border: "1.5px solid rgba(78,104,69,0.2)" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(42,31,20,0.4)", marginBottom: 6 }}>
          Pay on Delivery
        </p>
        <p style={{ fontFamily: "'poppins',serif", fontSize: "2rem", fontWeight: 800, color: "#2A1F14", letterSpacing: "-0.02em" }}>
          ₹{orderTotal?.toFixed(2)}
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Leaf size={11} style={{ color: "#C8973A" }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: "rgba(42,31,20,0.45)" }}>
            {siteName}
          </p>
        </div>
      </div>

      {/* COD advance */}
      {!codAdvancePaid ? null: (
        <div className="rounded-xl p-3 mb-4 flex items-center gap-2"
          style={{ background: "rgba(78,104,69,0.08)", border: "1px solid rgba(78,104,69,0.25)" }}>
          <CheckCircle size={16} style={{ color: "#4E6845", flexShrink: 0 }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "#4E6845", fontWeight: 500 }}>
            ₹{codFee} advance paid successfully ✓
          </p>
        </div>
      )}

      {!codAdvancePaid && (
        <button onClick={onPayAdvance} disabled={loading} className="co-btn-gold">
          {loading
            ? <><Loader size={16} className="co-spin" /> Processing…</>
            : <>Place Order</>}
        </button>
      )}
    </div>
  );
};

export default Step4_CODConfirm;