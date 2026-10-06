import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaPalette,
} from "react-icons/fa";

const API_URL = "http://localhost:8000/api/admin/colors";

const ViewColor = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH COLORS
  // =========================
  const fetchColors = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      console.log("COLOR API RESPONSE:", data);

      if (response.ok && data._status) {
        setColors(Array.isArray(data._data) ? data._data : []);
      } else {
        setColors([]);
        console.error(
          data._message || "Failed to fetch colors"
        );
      }
    } catch (error) {
      console.error("Fetch Colors Error:", error);
      setColors([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchColors();
  }, []);

  // =========================
  // DELETE COLOR
  // =========================
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: [id],
        }),
      });

      const data = await response.json();

      console.log("DELETE RESPONSE:", data);

      if (response.ok && data._status) {
        alert("Color deleted successfully");
        fetchColors();
      } else {
        alert(
          data._message || "Delete failed"
        );
      }
    } catch (error) {
      console.error("Delete Color Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            <FaPalette />
            Catalog palette
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Colors
          </h1>

          <p className="mt-2 text-slate-500">
            Manage the shades available across your product catalog.
          </p>

        </div>

        <Link
          to="/color/add"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <FaPlus />
          Add Color
        </Link>

      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* LOADING */}
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading colors...
          </div>
        ) : colors.length === 0 ? (

          /* EMPTY */
          <div className="p-12 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FaPalette size={22} />
            </div>

            <p className="font-medium text-slate-600">
              No colors found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Add your first color to get started.
            </p>

            <Link
              to="/color/add"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <FaPlus />
              Add Color
            </Link>

          </div>

        ) : (

          /* TABLE */
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    #
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Color
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Code
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {colors.map((color, index) => {

                  const colorId = color._id || color.id;

                  return (
                    <tr
                      key={colorId}
                      className="border-b border-slate-100 transition hover:bg-blue-50/30"
                    >

                      {/* NUMBER */}
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {index + 1}
                      </td>

                      {/* SWATCH */}
                      <td className="px-6 py-4">

                        <div
                          className="h-10 w-10 rounded-xl border border-slate-200 shadow-sm"
                          style={{
                            backgroundColor:
                              color.code || "#000000",
                          }}
                          title={color.code}
                        />

                      </td>

                      {/* NAME */}
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {color.name || "-"}
                      </td>

                      {/* CODE */}
                      <td className="px-6 py-4 font-mono text-sm uppercase text-slate-500">
                        {color.code || "-"}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">

                        <div className="flex justify-center gap-3">

                          {/* EDIT */}
                          <Link
                            to={`/color/update/${colorId}`}
                            aria-label={`Edit ${color.name}`}
                            className="rounded-lg bg-emerald-50 p-3 text-emerald-600 transition hover:bg-emerald-100"
                          >
                            <FaEdit />
                          </Link>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                colorId,
                                color.name
                              )
                            }
                            aria-label={`Delete ${color.name}`}
                            className="rounded-lg bg-rose-50 p-3 text-rose-600 transition hover:bg-rose-100"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </div>
  );
};

export default ViewColor;