import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaPalette } from "react-icons/fa";

const API_URL = "http://localhost:8000/api/admin/colors";

const AddColor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    code: "#000000",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // =========================
  // GET COLOR DETAILS
  // =========================
  useEffect(() => {
    if (!id) return;

    const fetchColorDetails = async () => {
      try {
        setFetching(true);

        const response = await fetch(`${API_URL}/details/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();

        console.log("COLOR DETAILS RESPONSE:", data);

        if (response.ok && data._status) {
          const color = data._data || {};

          setFormData({
            name: color.name || "",
            code: color.code || "#000000",
          });
        } else {
          alert(data._message || "Color not found");
          navigate("/color/view");
        }
      } catch (error) {
        console.error("Color Details Error:", error);
        alert("Server error while fetching color");
      } finally {
        setFetching(false);
      }
    };

    fetchColorDetails();
  }, [id, navigate]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const code = formData.code.trim();

    if (!name) {
      alert("Please enter color name");
      return;
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(code)) {
      alert("Please enter a valid color code like #FF0000");
      return;
    }

    try {
      setLoading(true);

      const url = isEdit
        ? `${API_URL}/update/${id}`
        : `${API_URL}/create`;

      const method = isEdit ? "PUT" : "POST";

      console.log("UPDATE URL:", url);
      console.log("METHOD:", method);
      console.log("BODY:", { name, code });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          code,
        }),
      });

      console.log("HTTP STATUS:", response.status);

     const text = await response.text();

console.log("RAW BACKEND RESPONSE:", text);

let data = {};

try {
  data = JSON.parse(text);
} catch (e) {
  console.error("JSON PARSE ERROR:", e);
}

console.log("BACKEND DATA:", data);


      if (response.ok && data._status) {
        alert(
          isEdit
            ? "Color updated successfully!"
            : "Color added successfully!"
        );

        setFormData({
          name: "",
          code: "#000000",
        });

        navigate("/color/view");
      } else {
        console.error("API ERROR:", data);

        alert(
          data._message ||
          "Something went wrong while saving color"
        );
      }
    } catch (error) {
      console.error("COLOR SAVE ERROR:", error);
      alert("Server error. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING EDIT DATA
  // =========================
  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-500">
            Loading color...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/color/view")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <FaArrowLeft size={12} />
          Back to colors
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            <FaPalette />
            Color library
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isEdit ? "Update color" : "Create a color"}
          </h1>

          <p className="mt-2 max-w-xl text-slate-500">
            Define a reusable color swatch for your product catalog.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
          >

            <div className="mb-8 border-b border-slate-100 pb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Color details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Give this swatch a name and a precise color value.
              </p>
            </div>

            {/* COLOR NAME */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Color Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter color name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* COLOR CODE */}
            <div className="mt-6 space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Color Code
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* COLOR PICKER */}
                <input
                  type="color"
                  value={
                    /^#[0-9A-Fa-f]{6}$/.test(formData.code)
                      ? formData.code
                      : "#000000"
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  aria-label="Choose a color"
                  className="h-14 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 sm:w-20"
                />

                {/* HEX INPUT */}
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="#000000"
                  maxLength={7}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-mono text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              <p className="text-xs text-slate-400">
                Use a six-digit hexadecimal value, for example #FF0000.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/color/view")}
                className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaCheck size={13} />

                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update color"
                    : "Save color"}
              </button>

            </div>
          </form>

          {/* LIVE PREVIEW */}
          <aside className="h-fit overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">

            <div className="p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Live preview
              </p>

              <div
                className="mt-5 aspect-square rounded-2xl border border-white/15 shadow-inner transition-colors"
                style={{
                  backgroundColor:
                    formData.code || "#000000",
                }}
              />

              <div className="mt-6 flex items-end justify-between gap-4">

                <div>
                  <p className="text-xl font-semibold">
                    {formData.name || "Untitled color"}
                  </p>

                  <p className="mt-1 font-mono text-sm uppercase text-slate-400">
                    {formData.code || "#000000"}
                  </p>
                </div>

                <span
                  className="h-3 w-3 rounded-full border border-white/50"
                  style={{
                    backgroundColor:
                      formData.code || "#000000",
                  }}
                />

              </div>

            </div>

            <div className="border-t border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-400">
              This is how the swatch will appear in your catalog.
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default AddColor;