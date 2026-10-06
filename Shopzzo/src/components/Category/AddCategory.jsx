import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL = "http://localhost:8000/api/admin/categories";
const IMAGE_PATH = "http://localhost:8000/uploads/categories/";

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const fileRef = useRef(null);

  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const isEdit = Boolean(id);

  // =========================
  // Generate slug
  // =========================
  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // =========================
  // Name Change
  // =========================
  const handleNameChange = (e) => {
    const value = e.target.value;

    setCategoryName(value);

    if (!isEdit) {
      setSlug(generateSlug(value));
    }
  };

  // =========================
  // Get Category Details
  // POST /details/:id
  // =========================
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!id) return;

      try {
        setFetching(true);

        const response = await fetch(`${API_URL}/details/${id}`, {
          method: "POST",
        });

        const data = await response.json();

        console.log(
          "Category Details Response:",
          JSON.stringify(data, null, 2)
        );

        if (data._status) {
          const category = data._data;

          setCategoryName(category.name || "");
          setSlug(category.slug || "");
          setStatus(category.status ? "1" : "0");

          if (category.image) {
            setPreview(
              `${data._image_path || IMAGE_PATH}${category.image}`
            );
          }
        } else {
          iziToast.error({
            title: "Error",
            message: data._message || "Category not found",
            position: "topRight",
          });

          navigate("/category");
        }
      } catch (error) {
        console.error("Category Details Error:", error);

        iziToast.error({
          title: "Error",
          message: "Failed to load category details",
          position: "topRight",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchCategoryDetails();
  }, [id, navigate]);

  // =========================
  // Image Upload
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      iziToast.error({
        title: "Error",
        message: "Please select a valid image",
        position: "topRight",
      });

      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // Remove Image
  // =========================
  const removeImage = () => {
    setImage(null);
    setPreview("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      iziToast.error({
        title: "Error",
        message: "Category name is required",
        position: "topRight",
      });

      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Backend expects name
      formData.append("name", categoryName);

      // Slug backend automatically generates karta hai
      // formData.append("slug", slug);

      // Status
      formData.append("status", status === "1" ? "true" : "false");

      // Image
      if (image) {
        formData.append("image", image);
      }

      let response;

      if (isEdit) {
        // =========================
        // UPDATE
        // PUT /update/:id
        // =========================
        response = await fetch(`${API_URL}/update/${id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // =========================
        // CREATE
        // POST /create
        // =========================
        response = await fetch(`${API_URL}/create`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      console.log(
        "Category Submit Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        iziToast.success({
          title: "Success",
          message:
            data._message ||
            (isEdit
              ? "Category updated successfully"
              : "Category added successfully"),
          position: "topRight",
        });

        navigate("/category");
      } else {
        iziToast.error({
          title: "Error",
          message: data._message || "Something went wrong",
          position: "topRight",
        });

        console.error("Backend Error:", data._error);
      }
    } catch (error) {
      console.error("Category Submit Error:", error);

      iziToast.error({
        title: "Error",
        message: "Server error. Please try again.",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Loading Edit Data
  // =========================
  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-semibold text-slate-600">
          Loading category...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {isEdit ? "Edit Category" : "Add Category"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? "Update category details"
              : "Create a new product category"}
          </p>
        </div>

        <Link
          to="/category"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back
        </Link>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm md:p-7">

        <form onSubmit={handleSubmit}>

          <div className="grid gap-8 lg:grid-cols-2">

            {/* LEFT SIDE */}
            <div className="space-y-5">

              {/* Category Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Category Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={handleNameChange}
                  placeholder="Enter category name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Slug
                </label>

                <input
                  type="text"
                  value={slug}
                  readOnly
                  placeholder="category-slug"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Slug automatically generated from category name
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category Image
              </label>

              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-4 transition hover:border-blue-400 hover:bg-blue-50/30"
              >
                {preview ? (
                  <div className="relative">

                    <img
                      src={preview}
                      alt="Category Preview"
                      className="h-72 w-full rounded-xl bg-slate-50 object-contain"
                      onError={(e) => {
                        console.error("Image failed:", preview);
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>

                  </div>
                ) : (
                  <div className="flex h-72 flex-col items-center justify-center text-center">

                    <FaCloudUploadAlt className="mb-4 text-5xl text-blue-500" />

                    <p className="font-bold text-slate-700">
                      Click to upload image
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      PNG, JPG or JPEG
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Recommended size: 500 × 500 px
                    </p>

                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
                className="hidden"
              />

              {image && (
                <p className="mt-2 text-xs text-slate-500">
                  Selected: {image.name}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">

            <Link
              to="/category"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSave />

              {loading
                ? "Saving..."
                : isEdit
                ? "Update Category"
                : "Save Category"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCategory;