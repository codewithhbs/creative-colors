"use client";

import React, { useState, useEffect } from "react";
import { X, Leaf, Mail, Phone, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

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
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.92) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 8px 24px rgba(168, 120, 40, 0.1);
    }
    50% {
      box-shadow: 0 8px 32px rgba(168, 120, 40, 0.2);
    }
  }

  .popup-animate {
    animation: fadeInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .popup-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  .input-focus {
    transition: all 0.3s ease;
  }

  .input-focus:focus {
    box-shadow: 0 0 0 3px rgba(200, 151, 58, 0.1), 0 0 0 1px rgba(200, 151, 58, 0.5);
  }

  .grain-texture {
    background-image: 
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  @media (max-width: 640px) {
    .popup-modal {
      max-width: 95vw;
    }
  }
`;

const PopupDetailsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);



const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("popup_last_closed", Date.now().toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        Phone: phoneNumber,
        subject: "Website Visitor Details",
        message: `New visitor details from popup:\n\nName: ${name}\nPhone: ${phoneNumber}\nEmail: ${email}`,
      };

      const res = await axios.post(
        "https://www.api.creativencolourful.com/api/v1/support-request",
        payload
      );

      toast.success(res.data.message || "Details submitted successfully!");
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setIsChecked(false);

      // Close popup and set cooldown after success
      setTimeout(() => {
        handleClose();
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
    const STORAGE_KEY = "popup_last_closed";

    const hasBeenClosed = localStorage.getItem(STORAGE_KEY);
    if (hasBeenClosed) {
      return; 
    }

    setIsOpen(true);
  }, []); 

  return (
    <>
      <style>{styleSheet}</style>

      {/* BACKDROP */}
      {isOpen && (
        <>
            <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className="popup-modal pointer-events-auto popup-animate popup-pulse bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border-soft)] overflow-hidden grain-texture">
          {/* DECORATIVE TOP BAR */}
          <div className="h-1 bg-gradient-to-r from-[#C8973A] via-[#81190B] to-[#C8973A]" />

          {/* HEADER */}
          <div className="relative px-6 pt-6 pb-4 border-b border-[var(--border-soft)]">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-[#C8973A]" />
                <h2 className="text-xs font-light uppercase tracking-widest text-[#C8973A]">
                  Connect With Us
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-[#5C4033] hover:text-[#2A1F14] transition-colors duration-200 flex-shrink-0"
                aria-label="Close popup"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <h1 className="text-3xl font-serif text-[#2A1F14] leading-tight">
              Get in Touch
            </h1>
            <p className="mt-2 text-sm text-[#5C4033] font-light">
              Share your details and we'll reach out soon
            </p>
          </div>

          {/* FORM CONTENT */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* SUCCESS MESSAGE */}
            {isSubmitted && (
              <div className="p-4 bg-gradient-to-r from-[#6B9E7E]/10 to-[#6B9E7E]/5 border border-[#6B9E7E]/20 rounded-lg">
                <p className="text-sm text-[#6B9E7E] font-medium">
                  ✓ Thank you! We'll be in touch shortly.
                </p>
              </div>
            )}

            {/* NAME FIELD */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-light uppercase tracking-widest text-[#C8973A] mb-3"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-[#C8973A] opacity-60" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input-focus w-full pl-10 pr-4 py-3 bg-[#FDF8F3] border border-[#E8DCC8] rounded-lg text-[#2A1F14] placeholder-[#5C4033]/40 focus:border-[#C8973A] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-light uppercase tracking-widest text-[#C8973A] mb-3"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#C8973A] opacity-60" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-focus w-full pl-10 pr-4 py-3 bg-[#FDF8F3] border border-[#E8DCC8] rounded-lg text-[#2A1F14] placeholder-[#5C4033]/40 focus:border-[#C8973A] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* PHONE FIELD */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-light uppercase tracking-widest text-[#C8973A] mb-3"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-[#C8973A] opacity-60" />
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 XXXX XXXX XX"
                  className="input-focus w-full pl-10 pr-4 py-3 bg-[#FDF8F3] border border-[#E8DCC8] rounded-lg text-[#2A1F14] placeholder-[#5C4033]/40 focus:border-[#C8973A] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* CHECKBOX */}
            <div className="bg-[#FDF8F3] border border-[#E8DCC8] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#C8973A] border-[#E8DCC8] rounded focus:ring-[#C8973A] cursor-pointer"
                  required
                />
                <label htmlFor="agree" className="text-xs text-[#5C4033] leading-relaxed cursor-pointer">
                  I agree to share my details and be contacted for follow-ups.
                  Read our{" "}
                  <a
                    href="/privacy"
                    className="text-[#C8973A] font-medium hover:text-[#A67828] transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </div>
          </form>

          {/* FOOTER */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#FDF8F3] to-white border-t border-[#E8DCC8] flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-[#5C4033] bg-white border border-[#E8DCC8] rounded-lg hover:bg-[#FDF8F3] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8973A] focus:ring-offset-2"
            >
              Later
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                !isChecked ||
                !phoneNumber ||
                !name ||
                !email ||
                isLoading ||
                isSubmitted
              }
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#C8973A] to-[#A67828] rounded-lg hover:shadow-lg hover:from-[#B8873A] hover:to-[#9B6820] focus:outline-none focus:ring-2 focus:ring-[#C8973A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Get in Touch"
              )}
            </button>
          </div>

          {/* FOOTER TEXT */}
          <div className="px-6 py-3 bg-[#2A1F14] text-[#FAF6EF] text-center text-xs font-light">
            We respect your privacy • Will contact you within 24 hours
          </div>
        </div>
      </div>
        </>
      )}
  
    </>
  );
};

export default PopupDetailsForm;