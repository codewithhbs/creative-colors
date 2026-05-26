import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, IMAGEAPI } from "../../constant/api";
import { ArrowRight } from "lucide-react";
import "./Category.css";

const CategoryCard = ({ category }) => {
  const imageUrl = category.image
    ? `${IMAGEAPI}${category.image}`
    : "/img/no-image.jpg";

  return (
    <Link to={`/shop?category=${category.name}`} className="category-card">
      <div className="category-img">
        <img src={imageUrl} alt={category.name} />
        <div className="overlay" />
      </div>

      <div className="category-content">
        <h3>{category.name}</h3>
        <span>
          Explore <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/admin/category`);
        if (res.data.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="category-section">
      <div className="container">
        {/* Heading */}
        <div className="heading">
          <p>Explore Collection</p>
          <h2>
            Shop By <span>Category</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="category-grid">
          {loading
            ? [1, 2, 3, 4].map((i) => <div className="skeleton" key={i}></div>)
            : categories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
        </div>

        {/* Button */}
        {!loading && (
          <div className="view-all">
            <Link to="/shop">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;
