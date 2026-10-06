import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL = "http://localhost:8000/api/admin/sub-categories";

const AddSubCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // ==============================
  // FETCH PARENT CATEGORIES
  // ==============================
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/parent-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      console.log(
        "Parent Categories Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        setCategories(data._data || []);
      } else {
        setCategories([]);

        iziToast.error({
          title: "Error",
          message: data._message || "Categories not found",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Parent Categories Error:", error);

      iziToast.error({
        title: "Error",
        message: "Unable to fetch categories",
        position: "topRight",
      });
    }
  };

  // ==============================
  // FETCH DETAILS FOR EDIT
  // ==============================
  const fetchDetails = async () => {
    if (!id) return;

    setFetching(true);

    try {
      const response = await fetch(`${API_URL}/details/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      console.log(
        "Sub Category Details Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status && data._data) {
        const item = data._data;

        setName(item.name || "");

        // Parent category populated object ho sakta hai
        if (item.parent_category_id) {
          if (typeof item.parent_category_id === "object") {
            setCategory(item.parent_category_id._id || "");
          } else {
            setCategory(item.parent_category_id);
          }
        }

        setStatus(item.status ? "1" : "0");

        if (item.image) {
          const imagePath =
            data._image_path ||
            "http://localhost:8000/uploads/categories/";

          setPreview(`${imagePath}${item.image}`);
        }
      } else {
        iziToast.error({
          title: "Error",
          message: data._message || "Sub category not found",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Details Error:", error);

      iziToast.error({
        title: "Error",
        message: "Unable to fetch sub category details",
        position: "topRight",
      });
    } finally {
      setFetching(false);
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  // ==============================
  // IMAGE CHANGE
  // ==============================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      iziToast.error({
        title: "Error",
        message: "Please select category",
        position: "topRight",
      });
      return;
    }

    if (!name.trim()) {
      iziToast.error({
        title: "Error",
        message: "Sub category name is required",
        position: "topRight",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("parent_category_id", category);
      formData.append("status", status === "1" ? "true" : "false");

      // Image optional hai
      if (image) {
        formData.append("image", image);
      }

      let url = `${API_URL}/create`;
      let method = "POST";

      // Edit mode
      if (isEdit) {
        url = `${API_URL}/update/${id}`;
        method = "PUT";
      }

      console.log("API URL:", url);
      console.log("Method:", method);

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      console.log(
        "Sub Category Save Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        iziToast.success({
          title: "Success",
          message:
            data._message ||
            (isEdit
              ? "Sub category updated successfully"
              : "Sub category added successfully"),
          position: "topRight",
        });

        navigate("/subcategory");
      } else {
        // Backend validation errors
        let errorMessage = data._message || "Something went wrong";

        if (data._error && typeof data._error === "object") {
          const errors = Object.values(data._error);

          if (errors.length > 0) {
            errorMessage = errors.join(", ");
          }
        }

        iziToast.error({
          title: "Error",
          message: errorMessage,
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Save Sub Category Error:", error);

      iziToast.error({
        title: "Error",
        message: "Something went wrong",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {isEdit ? "Edit Sub Category" : "Add Sub Category"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your sub categories
          </p>
        </div>

        <Link
          to="/subcategory"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back
        </Link>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">

        {fetching ? (
          <div className="py-10 text-center text-sm font-semibold text-slate-500">
            Loading...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* Category */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>

            {/* Name */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Sub Category Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter sub category name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* Status */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

            </div>

            {/* Image */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
              />

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-28 w-28 rounded-xl border border-slate-200 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

              <Link
                to="/subcategory"
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <FaSave />

                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Sub Category"
                  : "Save Sub Category"}
              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default AddSubCategory;