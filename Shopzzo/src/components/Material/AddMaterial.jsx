import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from "axios";

// Use an env var so this works in dev, staging, and production.
// Vite: import.meta.env.VITE_API_URL
// CRA:  process.env.REACT_APP_API_URL
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/materials`;

const AddMaterial = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id) && id !== "undefined" && id !== "null";

  const [materialName, setMaterialName] = useState("");
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  // --------------------------------
  // GET DETAILS FOR EDIT
  // --------------------------------
  useEffect(() => {
    if (!isEdit) return;

    const controller = new AbortController();

    const getMaterialDetails = async () => {
      try {
        setInitialLoading(true);

        const response = await axios.get(`${API_URL}/${id}`, {
          signal: controller.signal,
        });

        const data = response.data?._data;

        if (data) {
          setMaterialName(data.name || "");
          setStatus(String(data.status ?? 1));
        } else {
          iziToast.error({
            title: "Error",
            message: "Material not found",
            position: "topRight",
          });
        }
      } catch (error) {
        if (axios.isCancel(error)) return;

        console.error("Details Error:", error);

        iziToast.error({
          title: "Error",
          message:
            error.response?.data?.message ||
            "Unable to load material details",
          position: "topRight",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    getMaterialDetails();

    return () => controller.abort();
  }, [id, isEdit]);

  // --------------------------------
  // CREATE / UPDATE
  // --------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = materialName.trim();

    if (!trimmedName) {
      iziToast.error({
        title: "Error",
        message: "Material name is required",
        position: "topRight",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: trimmedName,
        status: status === "1",
      };

      const response = isEdit
        ? await axios.put(`${API_URL}/update/${id}`, payload)
        : await axios.post(`${API_URL}/create`, payload);

      console.log("Save Response:", response.data);

      iziToast.success({
        title: "Success",
        message: isEdit
          ? "Material updated successfully"
          : "Material added successfully",
        position: "topRight",
      });

      navigate("/material/view");
    } catch (error) {
      console.error("Save Error:", error);

      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Something went wrong",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {isEdit ? "Edit Material" : "Add Material"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit ? "Update material information" : "Create a new material"}
          </p>
        </div>

        <Link
          to="/material/view"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back
        </Link>
      </div>

      {/* FORM */}
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">
        {initialLoading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading material details...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* MATERIAL NAME */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Material Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder="Enter material name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* STATUS */}
            <div className="mb-6">
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

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
              <Link
                to="/material/view"
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
                {loading ? "Saving..." : isEdit ? "Update Material" : "Save Material"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMaterial;