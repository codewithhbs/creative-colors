import React from "react";
import { Link } from "react-router-dom";
import bannerImg from "./bg-about.jpg";

const BlogDetail = () => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Banner */}
      <div
        className="relative  text-white py-24"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-[#FFB229] to-[#FF9F00] bg-clip-text text-transparent">
              Blogs
            </span>
          </h1>
          {/* <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            We're here to help you explore our 100% natural spices. Have a
            question about an order or our products? Our team is ready to
            assist you.
          </p> */}
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
        <span className="text-sm uppercase text-[#81190B] font-semibold">
          Spices & Wellness
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-6">
          100% Natural Masalas – Haldi, Dhania, Garam Masala & Lal Mirch
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          At{" "}
          <span className="font-semibold text-[#81190B]">
            Creative N Colourful
          </span>
          , we believe spices are more than just ingredients – they are the soul
          of every Indian kitchen. That’s why our{" "}
          <strong>Haldi, Dhania, Garam Masala, and Lal Mirch</strong> are
          crafted with love, care, and a promise of <em>100% natural purity</em>
          .
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Unlike mass-produced powders, our masalas are stone-ground to preserve
          their natural oils and aroma. No added colors, no artificial flavors –
          only the rich, authentic taste that reminds you of your grandmother’s
          recipes.
        </p>

        <h3 className="text-2xl font-bold text-[#81190B] mt-8 mb-4">
          Why Choose Creative N Colourful
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>100% Natural & Chemical-Free</li>
          <li>Sourced Directly from Farmers</li>
          <li>Ground to Perfection using Traditional Stone Mills</li>
          <li>Rich Aroma & Long Shelf Life</li>
        </ul>

        <p className="text-lg text-gray-700 leading-relaxed mt-6">
          Whether it’s the golden glow of <strong>Haldi</strong>, the earthy
          notes of <strong>Dhania</strong>, the fiery punch of{" "}
          <strong>Lal Mirch</strong>, or the balanced warmth of{" "}
          <strong>Garam Masala</strong> – every pinch brings you closer to the
          roots of India’s spice heritage.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#81190B] text-white rounded-lg shadow-md hover:bg-[#5a1208] transition"
          >
            Shop Masalas Now
          </Link>
          <Link
            to="/blogs"
            className="px-6 py-3 border border-[#81190B] text-[#81190B] rounded-lg hover:bg-[#81190B] hover:text-white transition"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
