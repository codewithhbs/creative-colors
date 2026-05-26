import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Leaf, ArrowRight, Clock, User } from "lucide-react";
import "./BlogSection.css";

const API_URL = "https://www.api.creativencolourful.com/api/v1/blog";

/* ── Date formatter ── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div className="bs-skeleton">
    <div className="bs-skeleton-img" />
    <div className="bs-skeleton-body">
      <div className="bs-skeleton-line bs-skeleton-sm" />
      <div className="bs-skeleton-line bs-skeleton-md" />
      <div className="bs-skeleton-line bs-skeleton-full" />
      <div className="bs-skeleton-line bs-skeleton-w4" />
      <div className="bs-skeleton-line bs-skeleton-xs" />
    </div>
  </div>
);

/* ── Blog Card ── */
const BlogCard = ({ blog }) => {
  const excerpt =
    (blog.metaDescription || "").slice(0, 140) +
    (blog.metaDescription?.length > 140 ? "..." : "");
  const category = blog.metaKeyWord?.[0] || "Spices & Tea";

  return (
    <Link to={`/blogs/${blog.slug}`} className="bs-card">
      {/* Image */}
      <div className="bs-card-img-wrap">
        <img
          src={blog.imageUrl}
          alt={blog.meta_title}
          className="bs-card-img"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop";
          }}
        />
        <div className="bs-card-img-overlay" />
      </div>

      {/* Body */}
      <div className="bs-card-body">
        <span className="bs-card-cat">{category}</span>

        <h3 className="bs-card-title">{blog.meta_title}</h3>

        <p className="bs-card-excerpt">{excerpt}</p>

        {/* Footer */}
        <div className="bs-card-footer">
          <div className="bs-card-meta">
            <span className="bs-card-meta-item">
              <User size={13} />
              {blog.author || "Team"}
            </span>
            <span className="bs-card-meta-item">
              <Clock size={13} />
              {formatDate(blog.createdAt)}
            </span>
          </div>

          <span className="bs-card-read">
            Read
            <ArrowRight size={14} className="bs-card-arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ── Main Blog Section ── */
const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(API_URL);
        if (data.success) setBlogs(data.blogs.slice(0, 3) || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="bs-section">
      {/* Grain texture */}
      <div className="bs-grain" />

      <div className="bs-container">
        {/* ── Header ── */}
        <div className="bs-header">
          <div className="bs-eyebrow">
            <div className="bs-eyebrow-line" />
            <span className="bs-eyebrow-text">
              <Leaf size={13} /> Journal
            </span>
            <div
              className="bs-eyebrow-line"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(166,120,40,0.4), transparent)",
              }}
            />
          </div>

          <h2 className="bs-title">Handcrafted Stories</h2>

          <p className="bs-subtitle">
            Explore artisan journeys, handmade creations, cultural heritage, and
            the story behind every unique piece.
          </p>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="bs-grid-skeleton">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bs-empty">No blog posts available at the moment.</div>
        ) : (
          <div className="bs-grid">
            {blogs.map((blog) => (
              <div key={blog._id} className="bs-card-wrap">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}

        {/* ── View All ── */}
        {!loading && blogs.length > 0 && (
          <div className="bs-cta-wrap">
            <Link to="/blogs" className="bs-cta-btn">
              Explore All Posts
              <ArrowRight size={16} className="bs-cta-arrow" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
