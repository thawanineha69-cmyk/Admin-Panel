import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL =
  "http://localhost:8000/api/admin/sub-sub-categories";

const AddSubSubCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  // =========================
  // STATES
  // =========================

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/parent-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      console.log(
        "Parent Categories Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status === true) {
        setCategories(data._data || []);
      } else {
        setCategories([]);

        iziToast.error({
          title: "Error",
          message:
            data._message ||
            "Unable to fetch categories",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error(
        "Parent Categories Error:",
        error
      );

      iziToast.error({
        title: "Error",
        message: "Unable to connect with server",
        position: "topRight",
      });
    }
  };

  // =========================
  // FETCH SUB CATEGORIES
  // =========================

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/sub-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parent_category_id: categoryId,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Sub Categories Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status === true) {
        setSubCategories(data._data || []);
      } else {
        setSubCategories([]);

        iziToast.error({
          title: "Error",
          message:
            data._message ||
            "Unable to fetch sub categories",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error(
        "Sub Categories Error:",
        error
      );

      setSubCategories([]);

      iziToast.error({
        title: "Error",
        message: "Unable to fetch sub categories",
        position: "topRight",
      });
    }
  };

  // =========================
  // FETCH DETAILS
  // EDIT MODE
  // =========================

  const fetchDetails = async () => {
    if (!id) return;

    try {
      setFetching(true);

      const response = await fetch(
        `${API_URL}/details/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      console.log(
        "Sub-Sub Category Details:",
        JSON.stringify(data, null, 2)
      );

      if (data._status === true && data._data) {
        const record = data._data;

        // =========================
        // CATEGORY ID
        // =========================

        const categoryId =
          typeof record.parent_category_id ===
          "object"
            ? record.parent_category_id?._id
            : record.parent_category_id;

        // =========================
        // SUB CATEGORY ID
        // =========================

        const subCategoryId =
          typeof record.sub_category_id ===
          "object"
            ? record.sub_category_id?._id
            : record.sub_category_id;

        // =========================
        // SET FORM DATA
        // =========================

        setCategory(categoryId || "");

        setSubCategory(
          subCategoryId || ""
        );

        setName(record.name || "");

        setStatus(
          record.status ? "1" : "0"
        );

        // =========================
        // FETCH SUB CATEGORIES
        // =========================

        if (categoryId) {
          await fetchSubCategories(categoryId);
        }

        // =========================
        // EXISTING IMAGE
        // =========================

        if (record.image) {
          const imagePath =
            data._image_path ||
            "uploads/categories/";

          const cleanPath =
            imagePath.replace(
              /^\/+|\/+$/g,
              ""
            );

          const imageUrl =
            `http://localhost:8000/${cleanPath}/${record.image}`;

          console.log(
            "Existing Image URL:",
            imageUrl
          );

          setPreview(imageUrl);
        }
      } else {
        iziToast.error({
          title: "Error",
          message:
            data._message ||
            "Record not found",
          position: "topRight",
        });

        navigate("/sub-sub-category");
      }
    } catch (error) {
      console.error(
        "Details API Error:",
        error
      );

      iziToast.error({
        title: "Error",
        message:
          "Unable to fetch details",
        position: "topRight",
      });
    } finally {
      setFetching(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;

    setCategory(categoryId);

    // Category change par sub-category reset
    setSubCategory("");

    // Old sub categories remove
    setSubCategories([]);

    if (categoryId) {
      await fetchSubCategories(
        categoryId
      );
    }
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Image type check
    if (!file.type.startsWith("image/")) {
      iziToast.error({
        title: "Error",
        message:
          "Please select a valid image",
        position: "topRight",
      });

      e.target.value = "";
      return;
    }

    setImage(file);

    // Preview
    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");

    const input =
      document.getElementById(
        "subSubCategoryImage"
      );

    if (input) {
      input.value = "";
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATION
    // =========================

    if (!category) {
      iziToast.error({
        title: "Error",
        message:
          "Please select category",
        position: "topRight",
      });

      return;
    }

    if (!subCategory) {
      iziToast.error({
        title: "Error",
        message:
          "Please select sub category",
        position: "topRight",
      });

      return;
    }

    if (!name.trim()) {
      iziToast.error({
        title: "Error",
        message:
          "Sub-sub category name is required",
        position: "topRight",
      });

      return;
    }

    try {
      setLoading(true);

      // =========================
      // FORM DATA
      // =========================

      const formData = new FormData();

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "parent_category_id",
        category
      );

      formData.append(
        "sub_category_id",
        subCategory
      );

      formData.append(
        "status",
        status === "1"
          ? "true"
          : "false"
      );

      // Image
      if (image) {
        formData.append(
          "image",
          image
        );
      }

      // =========================
      // DEBUG FORM DATA
      // =========================

      console.log(
        "Form Data:"
      );

      for (const pair of formData.entries()) {
        console.log(
          pair[0],
          pair[1]
        );
      }

      // =========================
      // CREATE
      // =========================

      if (!isEdit) {
        const response =
          await fetch(
            `${API_URL}/create`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        console.log(
          "Create Response:",
          JSON.stringify(
            data,
            null,
            2
          )
        );

        if (
          data._status === true
        ) {
          iziToast.success({
            title: "Success",
            message:
              data._message ||
              "Sub-sub category added successfully",
            position: "topRight",
          });

          navigate(
            "/sub-sub-category"
          );
        } else {
          iziToast.error({
            title: "Error",
            message:
              data._message ||
              "Sub-sub category creation failed",
            position: "topRight",
          });
        }
      }

      // =========================
      // UPDATE
      // =========================

      else {
        const response =
          await fetch(
            `${API_URL}/update/${id}`,
            {
              method: "PUT",
              body: formData,
            }
          );

        const data =
          await response.json();

        console.log(
          "Update Response:",
          JSON.stringify(
            data,
            null,
            2
          )
        );

        if (
          data._status === true
        ) {
          iziToast.success({
            title: "Success",
            message:
              data._message ||
              "Sub-sub category updated successfully",
            position: "topRight",
          });

          navigate(
            "/sub-sub-category"
          );
        } else {
          iziToast.error({
            title: "Error",
            message:
              data._message ||
              "Sub-sub category update failed",
            position: "topRight",
          });
        }
      }
    } catch (error) {
      console.error(
        "Submit Error:",
        error
      );

      iziToast.error({
        title: "Error",
        message:
          "Something went wrong",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {isEdit
              ? "Edit Sub-Sub Category"
              : "Add Sub-Sub Category"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your sub-sub categories
          </p>
        </div>

        <Link
          to="/sub-sub-category"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back
        </Link>

      </div>

      {/* ================= FORM CARD ================= */}

      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">

        {fetching ? (
          <div className="py-20 text-center text-slate-500">
            Loading details...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
          >

            {/* ================= CATEGORY ================= */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">

                Category

                <span className="ml-1 text-red-500">
                  *
                </span>

              </label>

              <select
                value={category}
                onChange={
                  handleCategoryChange
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* ================= SUB CATEGORY ================= */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">

                Sub Category

                <span className="ml-1 text-red-500">
                  *
                </span>

              </label>

              <select
                value={subCategory}
                onChange={(e) =>
                  setSubCategory(
                    e.target.value
                  )
                }
                disabled={!category}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >

                <option value="">
                  {category
                    ? "Select Sub Category"
                    : "First Select Category"}
                </option>

                {subCategories.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* ================= NAME ================= */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">

                Sub-Sub Category Name

                <span className="ml-1 text-red-500">
                  *
                </span>

              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter sub-sub category name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* ================= IMAGE ================= */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">

                Image

              </label>

              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">

                {/* File Input */}

                <input
                  id="subSubCategoryImage"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600"
                />

                {/* Image Preview */}

                {preview ? (
                  <div className="relative mt-5 w-fit">

                    <img
                      src={preview}
                      alt="Sub-sub category preview"
                      className="h-36 w-36 rounded-xl border border-slate-200 object-cover shadow-sm"
                      onError={(e) => {
                        console.log(
                          "Image Load Error:",
                          preview
                        );

                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <button
                      type="button"
                      onClick={
                        handleRemoveImage
                      }
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>

                  </div>
                ) : (
                  <div className="mt-5 flex h-36 w-36 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-300">

                    <FaImage size={40} />

                  </div>
                )}

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Select an image for this
                sub-sub category.
              </p>

            </div>

            {/* ================= STATUS ================= */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >

                <option value="1">
                  Active
                </option>

                <option value="0">
                  Inactive
                </option>

              </select>

            </div>

            {/* ================= BUTTONS ================= */}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

              <Link
                to="/sub-sub-category"
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <FaSave />

                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Sub-Sub Category"
                  : "Save Sub-Sub Category"}

              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export default AddSubSubCategory;