import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Img from "./bg-about.jpg";

const Privacy = () => {
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
            Privacy{" "}
            <span className="bg-gradient-to-r from-[#FFB229] to-[#FFD966] bg-clip-text text-transparent">
              Policy
            </span>
          </h1>

          <p className="text-xl opacity-90">
            Creative N Colourful – Privacy Policy
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        {/* Effective Date */}
        <section className="text-gray-700">
          <p>
            <strong>Effective Date:</strong> 2 February 2026
          </p>

          <p>
            <strong>Last Updated:</strong> 2 February 2026
          </p>
        </section>

        {/* Intro */}
        <section>
          <p className="text-gray-700 leading-relaxed">
            At Creative N Colourful, we value your trust and are committed to
            protecting your privacy. This Privacy Policy explains how we
            collect, use, and safeguard your personal information when you
            browse our website, purchase handcrafted products, place custom
            orders, or interact with us through our services.
          </p>
        </section>

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-[#81190B] mb-4">
            1. Information We Collect
          </h2>

          <p className="text-gray-700 mb-3">
            We may collect the following information:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone
              number, billing and shipping details.
            </li>

            <li>
              <strong>Order Information:</strong> Product selections,
              customization requests, and purchase history.
            </li>

            <li>
              <strong>Payment Information:</strong> Payments are securely
              processed through trusted gateways. We do not store card details.
            </li>

            <li>
              <strong>Usage Data:</strong> Browser information, cookies, device
              details, and website interaction data.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-[#81190B] mb-4">
            2. How We Use Your Information
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Process orders and deliver handcrafted products.</li>

            <li>
              Respond to inquiries and manage personalized or custom orders.
            </li>

            <li>
              Send order confirmations, shipping updates, and support responses.
            </li>

            <li>
              Improve our website, products, and customer service experience.
            </li>

            <li>
              Share promotional offers or updates only if you choose to receive
              them.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-[#81190B] mb-4">
            3. Sharing of Information
          </h2>

          <p className="text-gray-700 mb-3">
            We do not sell or rent your personal information. We may share data
            only with:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Shipping Partners:</strong> For order delivery and
              fulfillment.
            </li>

            <li>
              <strong>Payment Providers:</strong> For secure transaction
              processing.
            </li>

            <li>
              <strong>Service Providers:</strong> For analytics, technical
              support, or email communications.
            </li>

            <li>
              <strong>Legal Compliance:</strong> If required by law.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold text-[#81190B] mb-4">
            4. Data Security
          </h2>

          <p className="text-gray-700">
            We implement appropriate security measures including encryption,
            secure servers, and restricted access to protect your information.
            However, no online system is completely secure.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold text-[#81190B] mb-4">
            5. Use of Cookies
          </h2>

          <p className="text-gray-700 mb-3">Our website may use cookies to:</p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Save preferences and shopping cart details.</li>
            <li>Analyze website traffic and improve performance.</li>
            <li>Support personalized shopping experiences.</li>
          </ul>

          <p className="text-gray-700 mt-3">
            You may disable cookies through your browser settings, though some
            features may not function properly.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-bold text-[#81190B] mb-4">
            6. Your Rights
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Request access to your personal data.</li>
            <li>Ask us to correct or delete your information.</li>
            <li>Opt out of marketing communication at any time.</li>
          </ul>

          <p className="text-gray-700 mt-3">
            To exercise these rights, contact us at
            creativencolourful7777@gmail.com
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-bold text-[#81190B] mb-4">
            7. Third-Party Links
          </h2>

          <p className="text-gray-700">
            Our website may include links to third-party websites or social
            platforms. We are not responsible for the privacy practices of those
            external websites.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-bold text-[#81190B] mb-4">
            8. Updates to This Policy
          </h2>

          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date. Continued
            use of our website means acceptance of those changes.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-[#81190B] to-[#A41C0F] rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3 text-amber-300" />
              <span>
                Creative N Colourful
                <br />
                {/* B-14 Amar Colony, Lajpat Nagar IV, New Delhi */}
              </span>
            </div>

            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-amber-300" />
              <span>creativencolourful7777@gmail.com</span>
            </div>

            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-amber-300" />
              <span>+91 9910100120</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
