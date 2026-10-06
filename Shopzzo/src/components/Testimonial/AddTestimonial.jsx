import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
} from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL = "http://localhost:8000/api/admin/testimonials";

const AddTestimonial = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("5");
  const [status, setStatus] = useState("1");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // =====================================
  // GET DETAILS FOR EDIT
  // Backend: POST /details/:id
  // =====================================
  useEffect(() => {
    if (!isEdit) return;

    const fetchDetails = async () => {
      try {
        setFetching(true);

        const response = await fetch(
          `${API_URL}/details/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("DETAIL RESPONSE:", data);

        if (data._status === true) {
          const testimonial = data._data;

          setName(testimonial.name || "");
          setDesignation(testimonial.designation || "");
          setMessage(testimonial.description || "");
          setRating(String(testimonial.rating || "5"));
          setStatus(testimonial.status ? "1" : "0");

          // Existing image filename
          setOldImage(testimonial.image || "");
        } else {
          iziToast.error({
            title: "Error",
            message: data._message || "Testimonial not found",
            position: "topRight",
          });
        }
      } catch (error) {
        console.error("DETAIL ERROR:", error);

        iziToast.error({
          title: "Error",
          message: "Unable to fetch testimonial",
          position: "topRight",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchDetails();
  }, [id, isEdit]);

  // =====================================
  // SUBMIT CREATE / UPDATE
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      iziToast.error({
        title: "Error",
        message: "Name is required",
        position: "topRight",
      });
      return;
    }

    if (!message.trim()) {
      iziToast.error({
        title: "Error",
        message: "Testimonial message is required",
        position: "topRight",
      });
      return;
    }

    try {
      setLoading(true);

      // =================================
      // FormData for Multer
      // =================================
      const formData = new FormData();

      formData.append("name", name);
      formData.append("designation", designation);
      formData.append("description", message);
      formData.append("rating", rating);
      formData.append("status", status);

      // New image only
      if (image) {
        formData.append("image", image);
      }

      const url = isEdit
        ? `${API_URL}/update/${id}`
        : `${API_URL}/create`;

      const method = isEdit ? "PUT" : "POST";

      console.log("REQUEST URL:", url);
      console.log("REQUEST METHOD:", method);

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const data = await response.json();

      console.log("TESTIMONIAL RESPONSE:", data);

      if (response.ok && data._status === true) {
        iziToast.success({
          title: "Success",
          message: data._message,
          position: "topRight",
        });

        navigate("/testimonial/view");
      } else {
        console.error("API ERROR:", data._error);

        iziToast.error({
          title: "Error",
          message: data._message || "Something went wrong",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("FETCH ERROR:", error);

      iziToast.error({
        title: "Error",
        message: "Server error",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================
  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            Loading testimonial...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {isEdit
              ? "Edit Testimonial"
              : "Add Testimonial"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? "Update testimonial details"
              : "Add a new customer testimonial"}
          </p>
        </div>

        <Link
          to="/testimonial/view"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back
        </Link>

      </div>

      {/* FORM */}

      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm md:p-8">

        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 md:grid-cols-2">

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Customer Name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter customer name"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* DESIGNATION */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Designation
              </label>

              <input
                type="text"
                value={designation}
                onChange={(e) =>
                  setDesignation(e.target.value)
                }
                placeholder="e.g. Customer, Manager"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* IMAGE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Customer Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files[0])
                }
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              {/* Existing image name */}
              {isEdit && oldImage && !image && (
                <p className="mt-2 text-xs text-slate-500">
                  Current image: {oldImage}
                </p>
              )}

              {/* New image name */}
              {image && (
                <p className="mt-2 text-xs text-green-600">
                  Selected: {image.name}
                </p>
              )}
            </div>

            {/* RATING */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(e.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* STATUS */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

          </div>

          {/* MESSAGE */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-bold text-slate-700">
              Testimonial
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <textarea
              rows="7"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write customer testimonial..."
              disabled={loading}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">

            <Link
              to="/testimonial/view"
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
                ? "Update Testimonial"
                : "Save Testimonial"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddTestimonial;