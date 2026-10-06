import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from "axios";

const API_URL = "http://localhost:8000/api/admin/materials";

const UpdateMaterial = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [materialName, setMaterialName] = useState("");
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        const data = response.data?._data || response.data?.data;

        if (!data) {
          throw new Error("Material not found");
        }

        setMaterialName(data.name || "");
        const isActive =
          data.status === true ||
          data.status === 1 ||
          data.status === "1";
        setStatus(isActive ? "1" : "0");
      } catch (error) {
        iziToast.error({
          title: "Error",
          message:
            error.response?.data?._message ||
            error.response?.data?.message ||
            error.message ||
            "Unable to load material",
          position: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = materialName.trim();

    if (!name) {
      iziToast.error({
        title: "Error",
        message: "Material name is required",
        position: "topRight",
      });
      return;
    }

    try {
      setSaving(true);
      const response = await axios.put(`${API_URL}/update/${id}`, {
        name,
        status: status === "1",
      });

      if (response.data?._status === false) {
        throw new Error(response.data?._message || "Unable to update material");
      }

      iziToast.success({
        title: "Success",
        message: response.data?._message || "Material updated successfully",
        position: "topRight",
      });
      navigate("/material/view");
    } catch (error) {
      iziToast.error({
        title: "Error",
        message:
          error.response?.data?._message ||
          error.response?.data?.message ||
          error.message ||
          "Unable to update material",
        position: "topRight",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Update Material</h1>
          <p className="mt-1 text-sm text-slate-500">Update material information</p>
        </div>
        <Link
          to="/material/view"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back
        </Link>
      </div>

      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading material...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="material-name">
                Material Name <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                id="material-name"
                type="text"
                value={materialName}
                onChange={(event) => setMaterialName(event.target.value)}
                placeholder="Enter material name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                disabled={saving}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="material-status">
                Status
              </label>
              <select
                id="material-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                disabled={saving}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
              <Link
                to="/material/view"
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSave />
                {saving ? "Updating..." : "Update Material"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateMaterial;
