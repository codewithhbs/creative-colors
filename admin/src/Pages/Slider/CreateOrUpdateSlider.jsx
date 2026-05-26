import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const accentColorSuggestions = [
  "#C8973A", "#D4AF37", "#B8860B", "#8B5A2B",
  "#4E6845", "#6D8F63", "#2A1F14", "#E6C882"
];

const bgSuggestions = [
  "from-[#1C1208] via-[#2A1C0A] to-[#1A1508]",
  "from-[#0F0A05] via-[#1C1208] to-[#2A1F14]",
  "from-[#2A1F14] via-[#3D2B18] to-[#1C1208]",
  "from-[#4E6845] via-[#3A4F34] to-[#2A1F14]",
];

const particleOptions = ["✦", "✧", "⊹", "❀", "🌿", "★", "✿", "⚡"];

const CreateOrUpdateSlider = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    tag: "",
    eyebrow: "",
    title: "",
    titleItalic: "",
    description: "",
    cta: "",
    ctaLink: "",
    secondaryCta: "",
    secondaryLink: "",
    accent: "#C8973A",
    bg: "from-[#1C1208] via-[#2A1C0A] to-[#1A1508]",
    imageAlt: "",
    badge: "",
    floatColor: "rgba(200,151,58,0.06)",
    order: 0,
    isActive: true,
    stat1: { value: "", label: "" },
    stat2: { value: "", label: "" },
    particles: ["✦", "⊹", "✧"],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch slider data for editing
  useEffect(() => {
    if (isEdit) {
      const fetchSlider = async () => {
        try {
          const res = await axios.get(`https://www.api.creativencolourful.com/api/v1/HeroSlider/${id}`);
          const slider = res.data.data;

          setFormData({
            tag: slider.tag || "",
            eyebrow: slider.eyebrow || "",
            title: slider.title || "",
            titleItalic: slider.titleItalic || "",
            description: slider.description || "",
            cta: slider.cta || "",
            ctaLink: slider.ctaLink || "",
            secondaryCta: slider.secondaryCta || "",
            secondaryLink: slider.secondaryLink || "",
            accent: slider.accent || "#C8973A",
            bg: slider.bg || "from-[#1C1208] via-[#2A1C0A] to-[#1A1508]",
            imageAlt: slider.imageAlt || "",
            badge: slider.badge || "",
            floatColor: slider.floatColor || "rgba(200,151,58,0.06)",
            order: slider.order || 0,
            isActive: slider.isActive ?? true,
            stat1: slider.stat1 || { value: "", label: "" },
            stat2: slider.stat2 || { value: "", label: "" },
            particles: slider.particles || ["✦", "⊹", "✧"],
          });

          if (slider.imageUrl) setImagePreview(slider.imageUrl);
        } catch (err) {
          setError("Failed to load slider data");
        }
      };
      fetchSlider();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStatChange = (statKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [statKey]: { ...prev[statKey], [field]: value },
    }));
  };

  const handleParticleToggle = (particle) => {
    setFormData((prev) => {
      const hasParticle = prev.particles.includes(particle);
      return {
        ...prev,
        particles: hasParticle
          ? prev.particles.filter((p) => p !== particle)
          : [...prev.particles, particle],
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const data = new FormData();

  // ✅ Append simple fields (clean values only)
  Object.entries(formData).forEach(([key, value]) => {
    if (["stat1", "stat2", "particles"].includes(key)) return;

    if (value !== undefined && value !== null) {
      data.append(key, String(value)); // ensure string
    }
  });

  // ✅ Append structured fields (ONLY once stringify)
  data.append(
    "stat1",
    JSON.stringify({
      value: formData.stat1?.value || "",
      label: formData.stat1?.label || "",
    })
  );

  data.append(
    "stat2",
    JSON.stringify({
      value: formData.stat2?.value || "",
      label: formData.stat2?.label || "",
    })
  );

  data.append(
    "particles",
    JSON.stringify(
      Array.isArray(formData.particles)
        ? formData.particles
        : ["✦", "⊹", "✧"]
    )
  );

  // ✅ Image
  if (imageFile) {
    data.append("image", imageFile);
  }

  try {
    const url = isEdit
      ? `https://www.api.creativencolourful.com/api/v1/HeroSlider/${id}`
      : "https://www.api.creativencolourful.com/api/v1/HeroSlider";

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (isEdit) {
      await axios.put(url, data, config);
      alert("Slider updated successfully!");
    } else {
      await axios.post(url, data, config);
      alert("Slider created successfully!");
    }

    navigate("/admin/hero-slider");
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {isEdit ? "Edit Hero Slider" : "Create New Hero Slider"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-10">
        
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Tag <span className="text-red-500">*</span></label>
              <input type="text" name="tag" value={formData.tag} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Eyebrow</label>
              <input type="text" name="eyebrow" value={formData.eyebrow} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title Italic</label>
              <input type="text" name="titleItalic" value={formData.titleItalic} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            </div>
          </div>
        </div>

        {/* Description & Badge */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-3" />

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Badge</label>
            <input type="text" name="badge" value={formData.badge} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Stat 1 - Value</label>
              <input type="text" value={formData.stat1.value} onChange={(e) => handleStatChange("stat1", "value", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="e.g. 2000m" />
              <input type="text" value={formData.stat1.label} onChange={(e) => handleStatChange("stat1", "label", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2" placeholder="e.g. Altitude Grown" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stat 2 - Value</label>
              <input type="text" value={formData.stat2.value} onChange={(e) => handleStatChange("stat2", "value", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="e.g. 100%" />
              <input type="text" value={formData.stat2.label} onChange={(e) => handleStatChange("stat2", "label", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2" placeholder="e.g. Pure & Natural" />
            </div>
          </div>
        </div>

        {/* Design & Colors */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Design & Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Accent Color</label>
              <div className="flex gap-2 flex-wrap">
                {accentColorSuggestions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, accent: color }))}
                    className={`w-10 h-10 rounded-full border-2 ${formData.accent === color ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input type="text" name="accent" value={formData.accent} onChange={handleChange} className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Background Gradient</label>
              <select name="bg" value={formData.bg} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3">
                {bgSuggestions.map((bg, i) => (
                  <option key={i} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Float Color</label>
              <input type="text" name="floatColor" value={formData.floatColor} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            </div>
          </div>
        </div>

        {/* Particles */}
        <div>
          <label className="block text-sm font-medium mb-2">Particles (Click to toggle)</label>
          <div className="flex flex-wrap gap-3">
            {particleOptions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleParticleToggle(p)}
                className={`px-5 py-2 rounded-full border text-lg transition-all ${formData.particles.includes(p) ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Slider Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700" />
          {imagePreview && (
            <div className="mt-4">
              <img src={`https://www.api.creativencolourful.com${imagePreview}`} alt="Preview" className="w-64 h-40 object-cover rounded-xl border shadow" />
            </div>
          )}
        </div>

        {/* Call to Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Primary CTA Text</label>
            <input type="text" name="cta" value={formData.cta} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            <input type="text" name="ctaLink" value={formData.ctaLink} onChange={handleChange} placeholder="CTA Link" className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Secondary CTA Text</label>
            <input type="text" name="secondaryCta" value={formData.secondaryCta} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            <input type="text" name="secondaryLink" value={formData.secondaryLink} onChange={handleChange} placeholder="Secondary Link" className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-3" />
          </div>
        </div>

        {/* Order & Status */}
        <div className="flex items-center gap-8">
          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <input type="number" name="order" value={formData.order} onChange={handleChange} min="0" className="w-32 border border-gray-300 rounded-lg px-4 py-3" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5" />
            <label className="font-medium text-lg">Active on Website</label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-10 py-3.5 rounded-xl font-semibold text-lg transition"
          >
            {loading ? "Saving..." : isEdit ? "Update Slider" : "Create Slider"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/hero-slider")}
            className="border border-gray-300 hover:bg-gray-50 px-10 py-3.5 rounded-xl font-medium text-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrUpdateSlider;