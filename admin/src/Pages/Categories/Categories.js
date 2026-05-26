import { PackageX, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import SubCategory from "./SubCategory";

const API = "https://www.api.creativencolourful.com/api/v1"
const IMAGEAPI = "https://www.api.creativencolourful.com";
;

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // edit id
  const [ViewselectedCategory, setViewSelectedCategory] = useState(null);

  const [add_sub_model, setAdd_sub_model] = useState(false);
  const [add_cat_model, setAdd_cat_model] = useState(false);
  const [view_sub_model, setView_sub_model] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [position, setPosition] = useState(0);
  const [imageFile, setImageFile] = useState(null);

  const resetForm = () => {
    setName("");
    setPosition(0);
    setImageFile(null);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/category`);
      setData(response.data.categories || []);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      toast("Category deletion cancelled", {
        icon: "🚫",
        style: { border: "1px solid #f44336", padding: "16px", color: "#f44336" },
      });
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API}/admin/category-del/${id}`);
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Error in Category Deleting");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD CATEGORY (multipart/form-data)
  const AddCategory = async () => {
    if (!name.trim()) return toast.error("Name is required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("position", String(position ?? 0));
      if (imageFile) formData.append("image", imageFile);

      await axios.post(`${API}/admin/create/category`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category Added successfully");
      fetchCategories();
      setAdd_cat_model(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error In Added Category !!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE CATEGORY (multipart/form-data) + optional image
  const updateCategory = async () => {
    if (!selectedCategory) return;
    if (!name.trim()) return toast.error("Name is required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("position", String(position ?? 0));
      if (imageFile) formData.append("image", imageFile); // optional

      await axios.put(`${API}/admin/category/edit/${selectedCategory}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category Updated successfully");
      fetchCategories();
      setSelectedCategory(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error In Updating Category !!");
    } finally {
      setLoading(false);
    }
  };

  const AddSubCategory = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/admin/create/sub-category/${selectedCategory}`, { name });
      toast.success("Sub Category Added successfully");
      setAdd_sub_model(false);
      fetchCategories();
      setSelectedCategory(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Error In Adding Sub Category !!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="py-10">
      <div className="bg-gray-200 py-3 px-4 rounded flex items-center justify-between">
        <h2 className="text-xl font-bold flex gap-3 text-pretty">
          <PackageX />
          Categories
        </h2>

        <Link
          onClick={() => {
            setAdd_cat_model(true);
            resetForm();
          }}
          className="text-sm transition-colors ease-linear rounded-full text-gray-800 hover:bg-green-600 hover:text-white font-medium flex gap-3 bg-green-500 py-2 px-3"
        >
          <Plus />
          Add Category
        </Link>
      </div>

      {loading ? (
        <p className="text-center my-4">Loading...</p>
      ) : (
        <div className="mt-5 dark:bg-white">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Image</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Position</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((category, index) => (
                <tr key={category._id}>
                  <td className="border border-gray-300 text-black px-4 py-2 text-center">
                    {index + 1}
                  </td>

                  <td className="border border-gray-300 text-black px-4 py-2 text-center">
                    {category.image ? (
                      <img
                        src={`https://www.api.creativencolourful.com${category.image}`}
                        alt={category.name}
                        className="h-12 w-12 object-cover rounded mx-auto"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>

                  <td className="border border-gray-300 text-black px-4 py-2">
                    {category.name}
                  </td>

                  <td className="border border-gray-300 text-black px-4 py-2 text-center">
                    {category.position ?? 0}
                  </td>

                  <td className="border border-gray-300 text-black px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setSelectedCategory(category._id);
                        setName(category.name || "");
                        setPosition(category.position ?? 0);
                        setImageFile(null); // keep null unless user selects new file
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ EDIT MODAL */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => {
                setSelectedCategory(null);
                resetForm();
              }}
            >
              <X />
            </button>

            <h3 className="text-lg font-bold mb-4">Edit Category</h3>

            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
              placeholder="Enter category name"
            />

            <label className="text-sm font-medium">Position</label>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
              placeholder="0"
            />

            <label className="text-sm font-medium">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={updateCategory}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ADD CATEGORY MODAL */}
      {add_cat_model && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => {
                setAdd_cat_model(false);
                resetForm();
              }}
            >
              <X />
            </button>

            <h3 className="text-lg font-bold mb-4">Add Category</h3>

            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
              placeholder="Enter category name"
            />

            <label className="text-sm font-medium">Position</label>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
              placeholder="0"
            />

            <label className="text-sm font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setAdd_cat_model(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={AddCategory}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* (your existing SubCategory stuff stays same) */}
      {ViewselectedCategory && (
        <SubCategory
          onClose={() => setView_sub_model(false)}
          isOpen={view_sub_model}
          selectedCategory={ViewselectedCategory}
        />
      )}
    </div>
  );
};

export default Categories;