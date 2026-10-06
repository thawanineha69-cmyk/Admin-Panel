import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaEye,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTrash,
  FaImage,
} from "react-icons/fa";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL = "http://localhost:8000/api/admin/categories";
const DEFAULT_IMAGE_PATH = "http://localhost:8000/uploads/categories/";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);

  // Backend default 15 records deta hai
  const itemsPerPage = 15;

  // =========================
  // Fetch Categories
  // POST /view
  // =========================
  const fetchCategories = async () => {
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
        "View Category Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        const imagePath = data._image_path || DEFAULT_IMAGE_PATH;

        const records = (data._data || []).map((category) => ({
          ...category,

          // Backend _id ko frontend id ke naam se use karenge
          id: category._id,

          // Image filename ko complete URL mein convert
          image: category.image
            ? `${imagePath}${category.image}`
            : "",
        }));

        setCategories(records);
      } else {
        setCategories([]);

        if (data._message !== "No Record Found !") {
          iziToast.error({
            title: "Error",
            message: data._message || "Failed to fetch categories",
            position: "topRight",
          });
        }
      }
    } catch (error) {
      console.error("View Category Error:", error);

      iziToast.error({
        title: "Error",
        message: "Server error. Please try again.",
        position: "topRight",
      });

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch on page/search change
  // =========================
  useEffect(() => {
    fetchCategories();
  }, [currentPage, search]);

  // =========================
  // Status Filter
  // =========================
  const filteredCategories = categories.filter((category) => {
    if (statusFilter === "active") {
      return category.status === true;
    }

    if (statusFilter === "inactive") {
      return category.status === false;
    }

    return true;
  });

  // =========================
  // Status Change
  // PUT /change-status
  // =========================
  const handleStatusChange = async (id) => {
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

      if (data._status) {
        iziToast.success({
          title: "Success",
          message: data._message || "Category status updated successfully",
          position: "topRight",
        });

        // API se latest data reload
        fetchCategories();
      } else {
        iziToast.error({
          title: "Error",
          message: data._message || "Status update failed",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Change Status Error:", error);

      iziToast.error({
        title: "Error",
        message: "Server error. Please try again.",
        position: "topRight",
      });
    }
  };

  // =========================
  // Delete
  // PUT /delete
  // =========================
  const handleDelete = (id) => {
    iziToast.question({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",

      position: "center",
      timeout: false,
      overlay: true,

      buttons: [
        [
          "<button><b>Yes, Delete</b></button>",
          async function (instance, toast) {
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
                "Delete Category Response:",
                JSON.stringify(data, null, 2)
              );

              instance.hide(
                {
                  transitionOut: "fadeOut",
                },
                toast,
                "button"
              );

              if (data._status) {
                iziToast.success({
                  title: "Deleted",
                  message:
                    data._message || "Category deleted successfully",
                  position: "topRight",
                });

                // Latest records reload
                fetchCategories();
              } else {
                iziToast.error({
                  title: "Error",
                  message: data._message || "Delete failed",
                  position: "topRight",
                });
              }
            } catch (error) {
              console.error("Delete Category Error:", error);

              instance.hide(
                {
                  transitionOut: "fadeOut",
                },
                toast,
                "button"
              );

              iziToast.error({
                title: "Error",
                message: "Server error. Please try again.",
                position: "topRight",
              });
            }
          },
          true,
        ],

        [
          "<button>No</button>",
          function (instance, toast) {
            instance.hide(
              {
                transitionOut: "fadeOut",
              },
              toast,
              "button"
            );
          },
        ],
      ],
    });
  };

  // =========================
  // Search
  // =========================
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // =========================
  // Filter
  // =========================
  const handleFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all product categories
          </p>
        </div>

        <Link
          to="/category/add"
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <FaPlus />
          Add Category
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        {/* SEARCH + FILTER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:w-96">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search category..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">

            <FaFilter className="text-slate-400" />

            <select
              value={statusFilter}
              onChange={handleFilter}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            {/* THEAD */}
            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Image
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Category Name
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Slug
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            {/* TBODY */}
            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>
                  <td
                    colSpan="6"
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Loading categories...
                  </td>
                </tr>

              ) : filteredCategories.length > 0 ? (

                filteredCategories.map((category, index) => (

                  <tr
                    key={category.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Number */}
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    {/* Image */}
                    <td className="px-5 py-4">

                      {category.image ? (

                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />

                      ) : (

                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <FaImage />
                        </div>

                      )}

                    </td>

                    {/* Name */}
                    <td className="px-5 py-4">

                      <p className="font-semibold text-slate-700">
                        {category.name}
                      </p>

                    </td>

                    {/* Slug */}
                    <td className="px-5 py-4">

                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                        {category.slug}
                      </span>

                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">

                      <div className="flex items-center">

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(category.id)
                          }
                          className={`relative h-6 w-11 rounded-full transition ${
                            category.status
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                        >

                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                              category.status
                                ? "left-6"
                                : "left-1"
                            }`}
                          />

                        </button>

                        <span
                          className={`ml-2 text-xs font-bold ${
                            category.status
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        >
                          {category.status
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">

                      <div className="flex justify-center gap-2">

                        {/* View */}
                        <button
                          type="button"
                          className="rounded-lg bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          title="View"
                          onClick={() => {
                            iziToast.info({
                              title: "Category",
                              message: `Viewing ${category.name}`,
                              position: "topRight",
                            });
                          }}
                        >
                          <FaEye />
                        </button>

                        {/* Edit */}
                        <Link
                          to={`/category/update/${category.id}`}
                          className="rounded-lg bg-amber-50 p-2.5 text-amber-600 transition hover:bg-amber-500 hover:text-white"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category.id)
                          }
                          className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-600 hover:text-white"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    No category found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <b>{filteredCategories.length}</b>{" "}
            records
          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
              {currentPage}
            </span>

            <button
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              disabled={categories.length < itemsPerPage}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewCategory;

