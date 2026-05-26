import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Img from "./bg-about.jpg";

const Return = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div
        className="relative text-white py-20"
        style={{
          backgroundImage: `url(${Img})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Refund
            <span className="bg-gradient-to-r from-[#FFB229] to-[#FFD966] bg-clip-text text-transparent">
              {" "}
              & Return Policy
            </span>
          </h1>

          <p className="text-xl opacity-90">
            Creative N Colourful – Refund & Return Policy
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 text-gray-700">
        <section>
          <p>
            <strong>Effective Date:</strong> 2 February 2026
          </p>
          <p>
            <strong>Last Updated:</strong> 2 February 2026
          </p>
        </section>

        {/* Intro */}
        <section>
          <p>
            At Creative N Colourful, we take pride in creating handcrafted and
            customized products with care and quality. If you are not satisfied
            with your order, please review our refund and return policy below.
          </p>
        </section>

        {/* 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            1. When Can You Request a Return or Refund?
          </h2>

          <p className="mb-2">You may request a return or refund if:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>You received the wrong item.</li>
            <li>The product arrived damaged or defective.</li>
            <li>
              The delivered item is significantly different from the confirmed
              order.
            </li>
          </ul>

          <p className="mt-4 mb-2">We do NOT accept returns or refunds for:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Customized or personalized handmade orders.</li>
            <li>Products damaged due to misuse after delivery.</li>
            <li>
              Minor variations in handmade products (color, texture, finish).
            </li>
            <li>
              Delivery delays caused by courier issues or incorrect address
              details.
            </li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            2. Time Limit for Reporting
          </h2>

          <p>
            All return or refund requests must be reported within 48 hours of
            receiving your order. Requests after this period may not be
            accepted.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Proof Required</h2>

          <p className="mb-2">To initiate a return or refund, please share:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Clear photos showing the issue.</li>
            <li>Your order number.</li>
            <li>Brief description of the concern.</li>
          </ul>

          <p className="mt-2">
            Send the details via email or contact us directly.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            4. Replacement or Refund Option
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>We may offer a replacement for eligible items.</li>
            <li>Or issue a full/partial refund depending on the issue.</li>
            <li>Approved refunds are processed within 7 business days.</li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            5. Payment Mode for Refunds
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Online payments will be refunded to the original payment method.
            </li>
            <li>
              For other payment methods, bank details may be requested for
              secure processing.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section className="bg-gradient-to-r from-[#81190B] to-[#A41C0F] text-white p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-amber-300" />
              <span>+91 9910100120</span>
            </div>

            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-amber-300" />
              <span>creativencolourful7777@gmail.com</span>
            </div>

            {/* <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3 text-amber-300" />
              <span>B-14 Amar Colony, Lajpat Nagar IV, New Delhi</span>
            </div> */}
          </div>

          <p className="mt-5 text-sm opacity-75">
            Business Hours: Monday to Saturday, 10:00 AM – 6:00 PM
          </p>
        </section>
      </div>
    </div>
  );
};

export default Return;
