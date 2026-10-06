import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaEye,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import iziToast from "izitoast";

const API_URL = "http://localhost:8000/api/admin/sub-categories";

const ViewSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(false);

  const itemsPerPage = 15;

  // =========================
  // FETCH SUB CATEGORIES
  // =========================
  const fetchSubCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: currentPage,
          limit: itemsPerPage,
          ...(search.trim() && {
            name: search.trim(),
          }),
        }),
      });

      const data = await response.json();

      console.log(
        "Sub Category View Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status === true) {
        const imagePath = data._image_path || "";

        const formattedData = (data._data || []).map((item) => ({
          id: item._id,
          name: item.name,
          status: item.status,
          image: item.image,
          imagePath: imagePath,
          category: item.parent_category_id?.name || "N/A",
        }));

        setSubCategories(formattedData);

        setTotalRecords(data._paginate?.total_records || 0);
        setTotalPages(data._paginate?.total_pages || 1);
      } else {
        setSubCategories([]);
        setTotalRecords(0);
        setTotalPages(1);

        iziToast.error({
          title: "Error",
          message: data._message || "Failed to fetch sub categories",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Fetch Sub Category Error:", error);

      iziToast.error({
        title: "Error",
        message: "Server error while fetching sub categories",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // USE EFFECT
  // =========================
  useEffect(() => {
    fetchSubCategories();
  }, [currentPage, search]);

  // =========================
  // STATUS CHANGE
  // =========================
  const handleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/change-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          ids: id,
        }),
      });

      const data = await response.json();

      console.log(
        "Change Status Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status === true) {
        iziToast.success({
          title: "Success",
          message: data._message || "Status changed successfully",
          position: "topRight",
        });

        fetchSubCategories();
      } else {
        iziToast.error({
          title: "Error",
          message: data._message || "Status change failed",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Status Error:", error);

      iziToast.error({
        title: "Error",
        message: "Server error",
        position: "topRight",
      });
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sub category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/delete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          ids: id,
        }),
      });

      const data = await response.json();

      console.log(
        "Delete Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status === true) {
        iziToast.success({
          title: "Success",
          message: data._message || "Sub category deleted successfully",
          position: "topRight",
        });

        // Agar current page par sirf last record tha
        if (subCategories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchSubCategories();
        }
      } else {
        iziToast.error({
          title: "Error",
          message: data._message || "Delete failed",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Delete Error:", error);

      iziToast.error({
        title: "Error",
        message: "Server error while deleting",
        position: "topRight",
      });
    }
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // =========================
  // STATUS FILTER
  // =========================
  const filteredSubCategories = subCategories.filter((item) => {
    if (statusFilter === "all") {
      return true;
    }

    if (statusFilter === "active") {
      return item.status === true;
    }

    if (statusFilter === "inactive") {
      return item.status === false;
    }

    return true;
  });

  // =========================
  // IMAGE URL
  // =========================
 const getImageUrl = (item) => {
  if (!item.image) {
    return null;
  }

  return `http://localhost:8000/uploads/categories/${item.image}`;
};

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Sub Categories
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage all sub categories
          </p>
        </div>

        <Link
          to="/subcategory/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm"
        >
          <FaPlus />
          Add Sub Category
        </Link>
      </div>

      {/* ================= CARD ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* ================= FILTER BAR ================= */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search sub category..."
              className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                  CATEGORY
                </th>

                {/* IMAGE COLUMN */}
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                  IMAGE
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                  SUB CATEGORY
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                  STATUS
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold text-slate-500">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-slate-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredSubCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-slate-500"
                  >
                    No sub categories found
                  </td>
                </tr>
              ) : (
                filteredSubCategories.map((item, index) => {
                  const imageUrl = getImageUrl(item);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      {/* NUMBER */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      {/* CATEGORY */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">
                          {item.category}
                        </span>
                      </td>

                      {/* ================= IMAGE ================= */}
                      <td className="px-5 py-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                            onError={(e) => {
                              console.log(
                                "Image Load Error:",
                                imageUrl
                              );

                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                            <span className="text-[10px] text-slate-400 text-center">
                              No Image
                            </span>
                          </div>
                        )}
                      </td>

                      {/* SUB CATEGORY */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-700">
                          {item.name}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleStatus(item.id)}
                          className="flex items-center gap-2"
                        >
                          <span
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                              item.status
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                                item.status
                                  ? "translate-x-5"
                                  : "translate-x-1"
                              }`}
                            />
                          </span>

                          <span
                            className={`text-xs font-semibold ${
                              item.status
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            {item.status ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* VIEW */}
                          <button
                            type="button"
                            onClick={() =>
                              iziToast.info({
                                title: "View",
                                message: `Sub Category: ${item.name}`,
                                position: "topRight",
                              })
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <FaEye size={14} />
                          </button>

                          {/* EDIT */}
                          <Link
                            to={`/subcategory/update/${item.id}`}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                          >
                            <FaEdit size={14} />
                          </Link>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredSubCategories.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalRecords}
            </span>{" "}
            records
          </div>

          {/* PAGINATION */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                currentPage === 1
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <FaChevronLeft size={12} />
            </button>

            <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-semibold">
              {currentPage}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                currentPage === totalPages
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubCategory;