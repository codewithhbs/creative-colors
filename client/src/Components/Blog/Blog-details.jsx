import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import bannerImg from "/src/Page/About/bg-about.jpg";
import axios from "axios";

const API_URL = "https://www.api.creativencolourful.com/api/v1/blog";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${API_URL}/${slug}`);
      if (data.success) {
        setBlog(data.blog);
      } else {
        setError("Blog not found.");
      }
    } catch (err) {
      console.error("Failed to fetch blog:", err);
      setError("Failed to load blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const { data } = await axios.get(API_URL);
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchBlog();
  }, [slug]);

  // Latest 5 blogs, excluding current
  const latestBlogs = blogs
    .filter((b) => b.slug !== slug)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Banner */}
      <div
        className="relative text-white py-24"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-black/90"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-[#FFB229] to-[#FF9F00] bg-clip-text text-transparent">
              Blogs
            </span>
          </h1>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ─── LEFT: Blog Detail (70%) ─── */}
          <div className="flex-1 min-w-0">

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#81190B] border-t-transparent"></div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="text-center py-20">
                <p className="text-lg text-red-600 mb-6">{error}</p>
                <Link
                  to="/blogs"
                  className="px-6 py-3 border border-[#81190B] text-[#81190B] rounded-lg hover:bg-[#81190B] hover:text-white transition"
                >
                  Back to Blogs
                </Link>
              </div>
            )}

            {/* Blog Content */}
            {!loading && !error && blog && (
              <>
                {blog.metaKeyWord?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.metaKeyWord.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs uppercase tracking-widest text-white bg-[#81190B] px-3 py-1 rounded-full font-semibold"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-4 leading-snug">
                  {blog.meta_title}
                </h2>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-200 pb-4">
                  {blog.author && (
                    <span className="capitalize flex items-center gap-1">
                      <span className="text-[#81190B]">✍</span>
                      <strong>{blog.author}</strong>
                    </span>
                  )}
                  {blog.createdAt && (
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                {blog.imageUrl && (
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={blog.imageUrl}
                      alt={blog.meta_title}
                      className="w-full object-cover max-h-[440px]"
                    />
                  </div>
                )}

                {blog.metaDescription && (
                  <p className="text-lg text-gray-600 italic border-l-4 border-[#FFB229] pl-5 mb-8 bg-amber-50 py-3 pr-4 rounded-r-lg">
                    {blog.metaDescription}
                  </p>
                )}

                {blog.html_content && (
                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                      prose-headings:text-[#81190B] prose-a:text-[#81190B]
                      prose-strong:text-gray-900 prose-li:marker:text-[#81190B]"
                    dangerouslySetInnerHTML={{ __html: blog.html_content }}
                  />
                )}

                <div className="mt-10">
                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[#81190B] text-[#81190B] rounded-lg hover:bg-[#81190B] hover:text-white transition font-medium"
                  >
                    ← Back to Blogs
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* ─── RIGHT: Sidebar (30%) ─── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-6 space-y-6">

              {/* Latest Blogs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#81190B] px-5 py-4">
                  <h3 className="text-white font-bold text-lg tracking-wide">
                    🔥 Latest Blogs
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {blogsLoading && (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-[#81190B] border-t-transparent"></div>
                    </div>
                  )}

                  {!blogsLoading && latestBlogs.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6 px-4">
                      No other blogs yet.
                    </p>
                  )}

                  {!blogsLoading &&
                    latestBlogs.map((b) => (
                      <Link
                        key={b._id}
                        to={`/blog/${b.slug}`}
                        className="flex gap-3 p-4 hover:bg-amber-50 transition group"
                      >
                        {/* Thumbnail */}
                        <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                          {b.imageUrl ? (
                            <img
                              src={b.imageUrl}
                              alt={b.meta_title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#FFB229] to-[#81190B]" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#81190B] transition">
                            {b.meta_title}
                          </p>
                          {b.createdAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(b.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>

                {/* View All */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <Link
                    to="/blogs"
                    className="block text-center text-sm font-semibold text-[#81190B] hover:underline"
                  >
                    View All Blogs →
                  </Link>
                </div>
              </div>

              {/* Popular Tags from all blogs */}
              {blogs.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-3 text-base">
                    🏷 Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...new Set(blogs.flatMap((b) => b.metaKeyWord || [])),
                    ].slice(0, 12).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full border border-[#81190B]/30 text-[#81190B] bg-red-50 font-medium capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;