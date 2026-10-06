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

const API_URL =
  "http://localhost:8000/api/admin/sub-sub-categories";

const ViewSubSubCategory = () => {
  // =========================
  // STATES
  // =========================

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalRecords, setTotalRecords] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const itemsPerPage = 15;

  // =========================
  // FETCH DATA
  // =========================

  const fetchSubSubCategories = async () => {
    try {
      setLoading(true);

      const body = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Search
      if (search.trim()) {
        body.name = search.trim();
      }

      const response = await fetch(
        `${API_URL}/view`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      console.log(
        "View Sub-Sub Category Response:",
        JSON.stringify(result, null, 2)
      );

      if (result._status === true) {
        const records = result._data || [];

        const mappedData = records.map(
          (item) => ({
            id: item._id,

            category:
              item.parent_category_id?.name ||
              "N/A",

            categoryId:
              item.parent_category_id?._id ||
              item.parent_category_id ||
              "",

            subCategory:
              item.sub_category_id?.name ||
              "N/A",

            subCategoryId:
              item.sub_category_id?._id ||
              item.sub_category_id ||
              "",

            name: item.name || "",

            status:
              item.status === true,

            image:
              item.image || "",

            imagePath:
              result._image_path ||
              "uploads/categories/",
          })
        );

        setData(mappedData);

        // Pagination
        setTotalPages(
          result._paginate?.total_pages || 1
        );

        setTotalRecords(
          result._paginate?.total_records || 0
        );
      } else {
        setData([]);

        setTotalPages(1);
        setTotalRecords(0);

        iziToast.error({
          title: "Error",
          message:
            result._message ||
            "Unable to fetch sub-sub categories",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error(
        "View API Error:",
        error
      );

      setData([]);
      setTotalPages(1);
      setTotalRecords(0);

      iziToast.error({
        title: "Error",
        message:
          "Unable to connect with server",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchSubSubCategories();
  }, [currentPage, search]);

  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = (item) => {
    if (!item.image) {
      return "";
    }

    const path = (
      item.imagePath ||
      "uploads/categories/"
    ).replace(
      /^\/+|\/+$/g,
      ""
    );

    return `http://localhost:8000/${path}/${item.image}`;
  };

  // =========================
  // STATUS
  // =========================

  const handleStatus = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/change-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            ids: id,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "Change Status Response:",
        JSON.stringify(result, null, 2)
      );

      if (result._status === true) {
        iziToast.success({
          title: "Success",
          message:
            result._message ||
            "Status updated successfully",
          position: "topRight",
        });

        fetchSubSubCategories();
      } else {
        iziToast.error({
          title: "Error",
          message:
            result._message ||
            "Status update failed",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error(
        "Change Status Error:",
        error
      );

      iziToast.error({
        title: "Error",
        message:
          "Unable to update status",
        position: "topRight",
      });
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {
    iziToast.question({
      title: "Delete Sub-Sub Category",

      message:
        "Are you sure you want to delete this sub-sub category?",

      position: "center",

      timeout: false,

      overlay: true,

      buttons: [
        [
          "<button><b>Yes, Delete</b></button>",

          async function (instance, toast) {
            try {
              const response =
                await fetch(
                  `${API_URL}/delete`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type":
                        "application/x-www-form-urlencoded",
                    },
                    body:
                      new URLSearchParams({
                        ids: id,
                      }),
                  }
                );

              const result =
                await response.json();

              console.log(
                "Delete Response:",
                JSON.stringify(
                  result,
                  null,
                  2
                )
              );

              instance.hide(
                {
                  transitionOut:
                    "fadeOut",
                },
                toast,
                "button"
              );

              if (
                result._status === true
              ) {
                iziToast.success({
                  title: "Deleted",
                  message:
                    result._message ||
                    "Sub-sub category deleted successfully",
                  position:
                    "topRight",
                });

                // Current page empty ho jaye
                // to previous page par chale jao
                if (
                  data.length === 1 &&
                  currentPage > 1
                ) {
                  setCurrentPage(
                    (page) => page - 1
                  );
                } else {
                  fetchSubSubCategories();
                }
              } else {
                iziToast.error({
                  title: "Error",
                  message:
                    result._message ||
                    "Delete failed",
                  position:
                    "topRight",
                });
              }
            } catch (error) {
              console.error(
                "Delete Error:",
                error
              );

              instance.hide(
                {
                  transitionOut:
                    "fadeOut",
                },
                toast,
                "button"
              );

              iziToast.error({
                title: "Error",
                message:
                  "Unable to delete record",
                position:
                  "topRight",
              });
            }
          },

          true,
        ],

        [
          "<button>Cancel</button>",

          function (instance, toast) {
            instance.hide(
              {
                transitionOut:
                  "fadeOut",
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
  // VIEW DETAILS
  // =========================

  const handleView = (item) => {
    iziToast.info({
      title: item.name,

      message:
        `${item.category} → ${item.subCategory}`,

      position: "topRight",
    });
  };

  // =========================
  // STATUS FILTER
  // =========================
  //
  // Backend view API doesn't have
  // status filter, so current page
  // records are filtered here.
  // =========================

  const filteredData = data.filter(
    (item) => {
      if (
        statusFilter === "active"
      ) {
        return item.status === true;
      }

      if (
        statusFilter === "inactive"
      ) {
        return item.status === false;
      }

      return true;
    }
  );

  // =========================
  // DISPLAY COUNT
  // =========================

  const startRecord =
    totalRecords === 0
      ? 0
      : (currentPage - 1) *
          itemsPerPage +
        1;

  const endRecord =
    Math.min(
      currentPage *
        itemsPerPage,
      totalRecords
    );

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-2xl font-extrabold text-slate-800">
            Sub-Sub Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all sub-sub categories
          </p>

        </div>

        <Link
          to="/sub-sub-category/add"
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          <FaPlus />
          Add Sub-Sub Category
        </Link>

      </div>

      {/* ================= CARD ================= */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        {/* ================= SEARCH FILTER ================= */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">

          {/* Search */}

          <div className="relative w-full md:w-96">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              placeholder="Search sub-sub category..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>

          {/* Status */}

          <div className="flex items-center gap-2">

            <FaFilter className="text-slate-400" />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
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

        {/* ================= TABLE ================= */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Image
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Sub Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Sub-Sub Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-bold uppercase text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Loading sub-sub categories...
                  </td>

                </tr>

              ) : filteredData.length >
                0 ? (

                filteredData.map(
                  (item, index) => (

                    <tr
                      key={item.id}
                      className="hover:bg-slate-50"
                    >

                      {/* Number */}

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {startRecord +
                          index}
                      </td>

                      {/* Image */}

                      <td className="px-5 py-4">

                        {item.image ? (

                          <img
                            src={getImageUrl(
                              item
                            )}
                            alt={item.name}
                            className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                            onError={(e) => {
                              console.log(
                                "Image Load Error:",
                                getImageUrl(
                                  item
                                )
                              );

                              e.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

                            <FaImage />

                          </div>

                        )}

                      </td>

                      {/* Category */}

                      <td className="px-5 py-4">

                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                          {item.category}
                        </span>

                      </td>

                      {/* Sub Category */}

                      <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                        {item.subCategory}
                      </td>

                      {/* Name */}

                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        {item.name}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <div className="flex items-center">

                          <button
                            onClick={() =>
                              handleStatus(
                                item.id
                              )
                            }
                            className={`relative h-6 w-11 rounded-full ${
                              item.status
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                            }`}
                          >

                            <span
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                                item.status
                                  ? "left-6"
                                  : "left-1"
                              }`}
                            />

                          </button>

                          <span
                            className={`ml-2 text-xs font-bold ${
                              item.status
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            {item.status
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </div>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-center gap-2">

                          {/* View */}

                          <button
                            onClick={() =>
                              handleView(
                                item
                              )
                            }
                            className="rounded-lg bg-blue-50 p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white"
                          >
                            <FaEye />
                          </button>

                          {/* Edit */}

                          <Link
                            to={`/subsubcategory/update/${item.id}`}
                            className="rounded-lg bg-amber-50 p-2.5 text-amber-600 hover:bg-amber-500 hover:text-white"
                          >
                            <FaEdit />
                          </Link>

                          {/* Delete */}

                          <button
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    No sub-sub category found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">

            Showing{" "}

            <b>
              {startRecord}
              {totalRecords > 0 &&
                ` - ${endRecord}`}
            </b>{" "}

            of{" "}

            <b>
              {totalRecords}
            </b>{" "}

            records

          </p>

          <div className="flex gap-2">

            {/* Previous */}

            <button
              disabled={
                currentPage === 1 ||
                loading
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page - 1
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            {/* Pages */}

            {Array.from(
              {
                length:
                  totalPages || 1,
              },
              (_, i) => i + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() =>
                  setCurrentPage(
                    page
                  )
                }
                disabled={loading}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300"
                }`}
              >
                {page}
              </button>

            ))}

            {/* Next */}

            <button
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0 ||
                loading
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page + 1
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewSubSubCategory;