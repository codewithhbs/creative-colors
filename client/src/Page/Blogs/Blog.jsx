import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Leaf, ArrowRight, Clock, User } from 'lucide-react';

const API_URL = 'https://www.api.creativencolourful.com/api/v1/blog';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

/* ── Skeleton ── */
const SkeletonCard = () => (
  <div
    className="rounded-xl overflow-hidden animate-pulse bg-white/60"
    style={{ border: '1px solid rgba(200,151,58,0.08)', backdropFilter: 'blur(4px)' }}
  >
    <div className="h-52 bg-amber-50/70" />
    <div className="p-5 space-y-3">
      <div className="h-2.5 w-20 rounded bg-amber-100/70" />
      <div className="h-5 w-5/6 rounded bg-amber-100/60" />
      <div className="h-3.5 w-full rounded bg-amber-50/80" />
      <div className="h-3.5 w-4/5 rounded bg-amber-50/80" />
      <div className="h-2.5 w-28 rounded bg-amber-100/50 mt-4" />
    </div>
  </div>
);

/* ── Date formatter ── */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/* ── Unified Blog Card ── */
const BlogCard = ({ blog, index }) => {
  const [hovered, setHovered] = useState(false);

  const excerpt = (blog.metaDescription || '').slice(0, 140) + (blog.metaDescription?.length > 140 ? '...' : '');
  const category = blog.metaKeyWord?.[0] || 'Spices & Tea';

  return (
    <Link
      to={`/blogs-details/${blog.slug}`}
      className="group block rounded-xl overflow-hidden bg-white/70 transition-all duration-400"
      style={{
        border: `1px solid ${hovered ? 'rgba(200,151,58,0.35)' : 'rgba(200,151,58,0.12)'}`,
        boxShadow: hovered
          ? '0 16px 48px -8px rgba(42,31,20,0.14), 0 8px 24px -4px rgba(42,31,20,0.08)'
          : '0 6px 20px -4px rgba(42,31,20,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        backdropFilter: 'blur(6px)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[5/3]">
        <img
          src={blog.imageUrl}
          alt={blog.meta_title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1.02)' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop';
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to top, rgba(42,31,20,0.42) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col gap-3">
        {/* Category */}
        <span
          className="uppercase tracking-wider text-xs font-medium"
          style={{ color: '#B08968', letterSpacing: '0.12em' }}
        >
          {category}
        </span>

        {/* Title */}
        <h3
          className="font-serif font-semibold leading-tight line-clamp-2"
          style={{
            fontFamily: "'poppins', serif",
            fontSize: 'clamp(1.1rem, 2.1vw, 1.28rem)',
            color: '#2A1F14',
            letterSpacing: '-0.015em',
          }}
        >
          {blog.meta_title}
        </h3>

        {/* Excerpt */}
        <p
          className="text-sm line-clamp-2 leading-relaxed"
          style={{
            color: 'rgba(42,31,20,0.58)',
            fontWeight: 300,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs pt-2 mt-1 border-t border-amber-100/40">
          <div className="flex items-center gap-4 text-amber-800/60">
            <span className="flex items-center gap-1.5">
              <User size={13} /> {blog.author || 'Team'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {formatDate(blog.createdAt)}
            </span>
          </div>

          <span
            className="flex items-center gap-1.5 font-medium transition-colors"
            style={{
              color: hovered ? '#A67828' : '#B08968',
              letterSpacing: '0.04em',
            }}
          >
            Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};


const BlogSection = () => {
   const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(API_URL);
        if (data.success) {
          setBlogs(data.blogs || []);
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);


  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .blog-fade-up {
          animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <section
        className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #FDFAF3 0%, #F8F1E3 100%)',
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: '220px', opacity: 0.7 }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 blog-fade-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
              <span
                className="flex items-center gap-2 uppercase text-xs tracking-widest font-medium"
                style={{ color: '#A67828' }}
              >
                <Leaf size={14} /> Journal
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-amber-700/40 to-transparent" />
            </div>

            <h2
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              style={{
                color: '#2A1F14',
                letterSpacing: '-0.025em',
                background: 'linear-gradient(90deg, #2A1F14, #4A3828)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              News
            </h2>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : blogs.length === 0 ? (
            <div
              className="text-center py-16"
              style={{ color: 'rgba(42,31,20,0.45)', fontSize: '1.1rem' }}
            >
              No blog posts available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
              {blogs.map((blog, index) => (
                <div
                  key={blog._id}
                  className="blog-fade-up"
                >
                  <BlogCard blog={blog} index={index} />
                </div>
              ))}
            </div>
          )}

   
        </div>
      </section>
    </>
  );
};

export default BlogSection;
