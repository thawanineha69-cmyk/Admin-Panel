import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/why-choose-us";

const AddWhyChooseUs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const item = data.data || data.item || data;
        setFormData({
          title: item.title || "",
          description: item.description || "",
          icon: item.icon || "",
        });
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(isEdit ? `${API_URL}/${id}` : API_URL, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(isEdit ? "Why Choose Us updated successfully" : "Why Choose Us added successfully");

        setFormData({
          title: "",
          description: "",
          icon: "",
        });

        navigate("/why-choose-us/view");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Update Why Choose Us" : "Add Why Choose Us"}
        </h1>

        <p className="text-gray-500 mt-1">
          Add a reason why customers should choose your business
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Premium Quality"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>

            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Example: FaAward"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              {loading ? "Saving..." : isEdit ? "Update Why Choose Us" : "Add Why Choose Us"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/why-choose-us/view")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddWhyChooseUs;