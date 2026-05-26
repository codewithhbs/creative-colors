import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AllSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("https://www.api.creativencolourful.com/api/v1/HeroSlider");
      setSliders(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch sliders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;

    try {
      await axios.delete(`https://www.api.creativencolourful.com/api/v1/HeroSlider/${id}`);
      alert("Slider deleted successfully");
      fetchSliders(); // Refresh list
    } catch (err) {
      alert("Failed to delete slider");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading sliders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hero Sliders</h1>
        <Link
          to="/admin/hero-slider/new"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          + Create New Slider
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sliders.map((slider) => (
              <tr key={slider._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {slider.imageUrl && (
                    <img
                      src={`https://www.api.creativencolourful.com${slider.imageUrl}`}
                      alt={slider.imageAlt || "slider"}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{slider.tag}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{slider.title}</div>
                  {slider.titleItalic && (
                    <div className="text-sm text-gray-500 italic">{slider.titleItalic}</div>
                  )}
                </td>
                <td className="px-6 py-4">{slider.order}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      slider.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {slider.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/admin/hero-slider/edit/${slider._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(slider._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {sliders.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No sliders found. Create your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSliders;