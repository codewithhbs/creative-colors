import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Img from "./bg-about.jpg";

const Refund = () => {
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
              {" "}Policy
            </span>
          </h1>

          <p className="text-xl opacity-90">
            Creative N Colourful – Refund & Return Policy
          </p>

          <p className="text-sm opacity-75 mt-2">
            Effective Date: 2 February 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8 text-gray-700">

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#81190B]">
              1. Refund Eligibility
            </h2>

            <p>
              At Creative N Colourful, we take pride in offering handmade and
              customized products crafted with care. Refunds may be considered
              only under the following conditions:
            </p>

            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Damaged or defective product received.</li>
              <li>Wrong item delivered.</li>
              <li>Product significantly different from the confirmed order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#81190B]">
              2. Non-Refundable Items
            </h2>

            <p>The following items are not eligible for refund:</p>

            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Customized or personalized handmade orders.</li>
              <li>Products damaged due to misuse after delivery.</li>
              <li>Items returned without valid reason.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#81190B]">
              3. Refund Request Process
            </h2>

            <p>
              To request a refund, please contact us within 48 hours of receiving
              your order with:
            </p>

            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Order number</li>
              <li>Photos of damaged/incorrect product</li>
              <li>Brief issue description</li>
            </ul>

            <p className="mt-4 text-green-800 font-medium">
              Approved refunds will be processed within 7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#81190B]">
              4. Exchange Policy
            </h2>

            <p>
              In some cases, we may offer a replacement or exchange instead of a
              refund depending on the issue reported.
            </p>
          </section>

          {/* Contact Box */}
          <section className="bg-gradient-to-r from-[#81190B] to-[#A41C0F] text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">
              5. Contact Information
            </h2>

            <p>
              For refund or return related concerns, contact us:
            </p>

            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-amber-300" />
                <span>creativencolourful7777@gmail.com</span>
              </div>

              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-amber-300" />
                <span>+91 9910100120</span>
              </div>

              {/* <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-amber-300" />
                <span>
                  B-14 Amar Colony, Lajpat Nagar IV, New Delhi
                </span>
              </div> */}
            </div>

            <p className="mt-5 text-sm opacity-75">
              Last Updated: 2 February 2026
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Refund;