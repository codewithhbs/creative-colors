import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Img from "./bg-about.jpg";

const Term = () => {
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
            Terms
            <span className="bg-gradient-to-r from-[#FFB229] to-[#FFD966] bg-clip-text text-transparent">
              {" "}
              & Conditions
            </span>
          </h1>

          <p className="text-xl opacity-90">
            Agreement for using Creative N Colourful services
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
            Welcome to Creative N Colourful. By accessing our website, placing
            an order, or purchasing our handcrafted products, you agree to
            comply with these Terms & Conditions.
          </p>
        </section>

        {/* 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. General</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Creative N Colourful offers handcrafted and customized products.
            </li>
            <li>
              You confirm you are legally eligible to place orders with us.
            </li>
            <li>These terms apply to all visitors, customers, and users.</li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            2. Product Information
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              We make every effort to keep product descriptions and pricing
              accurate.
            </li>
            <li>
              Due to handmade craftsmanship, slight variations in color, texture
              or finish may occur.
            </li>
            <li>Product images are for representation purposes only.</li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Orders & Payments</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>All orders are subject to availability and acceptance.</li>
            <li>Prices are displayed in INR unless otherwise stated.</li>
            <li>Payments are processed through secure payment gateways.</li>
            <li>
              We reserve the right to cancel orders due to pricing errors, stock
              limitations, or suspected misuse.
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Custom Orders</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Customized or made-to-order products may require additional
              production time.
            </li>
            <li>
              Once confirmed, custom orders may not be cancelled or modified.
            </li>
            <li>
              Customized products are generally non-refundable unless damaged or
              incorrect.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            5. Shipping & Delivery
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Delivery timelines are estimates and may vary.</li>
            <li>Customers must provide accurate shipping information.</li>
            <li>
              We are not responsible for delays caused by incorrect address,
              courier disruptions, or external events.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Returns & Refunds</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Returns and refunds are governed by our Refund Policy.</li>
            <li>
              Handmade and personalized products may not be eligible for return.
            </li>
            <li>
              Eligible refunds or replacements apply only in approved cases.
            </li>
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            7. Intellectual Property
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              All designs, artwork, images, text, branding and product concepts
              belong to Creative N Colourful.
            </li>
            <li>Unauthorized reproduction or commercial use is prohibited.</li>
          </ul>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            8. Limitation of Liability
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              We are not liable for indirect or consequential damages arising
              from use of our website or products.
            </li>
            <li>
              Our liability shall not exceed the amount paid for the purchased
              product.
            </li>
          </ul>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            9. Modification of Terms
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>We may update these Terms & Conditions at any time.</li>
            <li>Changes become effective once posted on this website.</li>
          </ul>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            10. Governing Law & Jurisdiction
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>These Terms are governed by the laws of India.</li>
            <li>All disputes shall be subject to Delhi jurisdiction only.</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#81190B] to-[#A41C0F] text-white p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>

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
        </section>
      </div>
    </div>
  );
};

export default Term;
