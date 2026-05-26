import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Img from "./bg-about.jpg";

const Shipping = () => {
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
            Shipping
            <span className="bg-gradient-to-r from-[#FFB229] to-[#FFD966] bg-clip-text text-transparent">
              {" "}
              Policy
            </span>
          </h1>

          <p className="text-xl opacity-90">
            Creative N Colourful – Shipping Policy
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
            At Creative N Colourful, we ensure your handcrafted products are
            packed carefully and delivered safely. Please review our shipping
            policy below.
          </p>
        </section>

        {/* 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            1. Order Processing Time
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Ready products are processed within 1–3 working days.</li>
            <li>
              Customized or made-to-order products may take 5–10 working days.
            </li>
            <li>
              Orders placed on weekends or holidays are processed on the next
              working day.
            </li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Delivery Time</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Standard delivery usually takes 3–7 working days across India.
            </li>
            <li>Remote locations may require additional delivery time.</li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Shipping Partners</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Orders are shipped through trusted courier partners.</li>
            <li>
              Tracking details may be shared by email or message once shipped.
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Shipping Charges</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Shipping charges may vary based on order size and delivery
              location.
            </li>
            <li>
              Free shipping offers, if applicable, will be mentioned during
              checkout.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            5. Delays or Non-Delivery
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Delays may occur due to weather, holidays, or courier disruptions.
            </li>
            <li>
              We are not responsible for delays caused by incorrect shipping
              address or contact details provided by the customer.
            </li>
            <li>
              If an order is returned due to failed delivery attempts,
              re-shipping charges may apply.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            6. Delivery Confirmation
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Please ensure someone is available to receive the package.</li>
            <li>
              Inspect the package at delivery and report visible damage
              immediately.
            </li>
          </ul>
        </section>

        {/* 7 */}
        <section className="bg-gradient-to-r from-[#81190B] to-[#A41C0F] text-white p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">
            7. Contact for Shipping Support
          </h2>

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

export default Shipping;
