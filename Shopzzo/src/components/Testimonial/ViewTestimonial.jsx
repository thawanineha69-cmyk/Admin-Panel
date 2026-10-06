import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaEye,
  FaFilter,
  FaImage,
  FaPlus,
  FaSearch,
  FaStar,
  FaTrash,
} from "react-icons/fa";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL = "http://localhost:8000/api/admin/testimonials";
const SERVER_URL = "http://localhost:8000";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${SERVER_URL}${image}`;
  }

  return `${SERVER_URL}/uploads/testimonials/${image}`;
};

const ViewTestimonial = () => {

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data._status === true) {
        setTestimonials(
          (data._data || []).map((item) => ({
            ...item,
            id: item.id || item._id,
            image: item.image || item.image_url || "",
            message: item.description || item.message || "",
            status: Boolean(item.status),
          }))
        );
      } else {
        setTestimonials([]);
        iziToast.error({
          title: "Error",
          message: data._message || "Unable to fetch testimonials",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("FETCH TESTIMONIALS ERROR:", error);
      iziToast.error({
        title: "Error",
        message: "Server error while fetching testimonials",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // SEARCH + FILTER

  const filteredTestimonials = useMemo(() => {

    return testimonials.filter((item) => {

      const searchValue =
        search.toLowerCase();

      const searchMatch =
        (item.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        (item.designation || "")
          .toLowerCase()
          .includes(searchValue) ||
        (item.message || "")
          .toLowerCase()
          .includes(searchValue);

      let statusMatch = true;

      if (statusFilter === "active") {
        statusMatch = item.status === true;
      }

      if (statusFilter === "inactive") {
        statusMatch = item.status === false;
      }

      return searchMatch && statusMatch;
    });

  }, [testimonials, search, statusFilter]);

  // PAGINATION

  const totalPages = Math.ceil(
    filteredTestimonials.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentTestimonials =
    filteredTestimonials.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // STATUS

  const handleStatusChange = async (item) => {
    const formData = new FormData();
    formData.append("status", item.status ? "0" : "1");

    try {
      const response = await fetch(`${API_URL}/update/${item.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data._status !== true) {
        throw new Error(data._message || "Status update failed");
      }

      setTestimonials((previous) =>
        previous.map((testimonial) =>
          testimonial.id === item.id
            ? { ...testimonial, status: !testimonial.status }
            : testimonial
        )
      );

      iziToast.success({
        title: "Success",
        message: data._message || "Testimonial status updated successfully",
        position: "topRight",
      });
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
      iziToast.error({
        title: "Error",
        message: error.message || "Unable to update testimonial status",
        position: "topRight",
      });
    }
  };

  // DELETE

  const handleDelete = (id) => {

    iziToast.question({
      title: "Delete Testimonial",
      message:
        "Are you sure you want to delete this testimonial?",
      position: "center",
      timeout: false,
      overlay: true,

      buttons: [
        [
          "<button><b>Yes, Delete</b></button>",

          function (instance, toast) {

            fetch(`${API_URL}/delete`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ids: id }),
            })
              .then(async (response) => {
                const data = await response.json();

                if (!response.ok || data._status !== true) {
                  throw new Error(data._message || "Delete failed");
                }

                setTestimonials((previous) =>
                  previous.filter((item) => item.id !== id)
                );

                iziToast.success({
                  title: "Deleted",
                  message: data._message || "Testimonial deleted successfully",
                  position: "topRight",
                });
              })
              .catch((error) => {
                console.error("DELETE TESTIMONIAL ERROR:", error);
                iziToast.error({
                  title: "Error",
                  message: error.message || "Unable to delete testimonial",
                  position: "topRight",
                });
              })
              .finally(() => {
                instance.hide(
                  { transitionOut: "fadeOut" },
                  toast,
                  "button"
                );
              });
          },

          true,
        ],

        [
          "<button>Cancel</button>",

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

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Testimonials
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer testimonials
          </p>
        </div>

        <Link
          to="/testimonial/add"
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          <FaPlus />
          Add Testimonial
        </Link>

      </div>

      {/* TABLE CARD */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        {loading && (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading testimonials...
          </div>
        )}

        {/* SEARCH FILTER */}

        {!loading && <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:w-96">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search testimonial..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>

          <div className="flex items-center gap-2">

            <FaFilter className="text-slate-400" />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
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

        </div>}

        {/* TABLE */}

        {!loading && <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Image
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Testimonial
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Rating
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

              {currentTestimonials.length > 0 ? (

                currentTestimonials.map(
                  (item, index) => (

                    <tr
                      key={item.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {startIndex + index + 1}
                      </td>

                      <td className="px-5 py-4">

                        <p className="font-bold text-slate-700">
                          {item.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.designation}
                        </p>

                      </td>

                      <td className="px-5 py-4">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name || "Customer"}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <FaImage />
                          </div>
                        )}
                      </td>

                      <td className="max-w-md px-5 py-4">

                        <p className="line-clamp-2 text-sm text-slate-600">
                          {item.message}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (

                              <FaStar
                                key={star}
                                className={
                                  star <= item.rating
                                    ? "text-yellow-400"
                                    : "text-slate-200"
                                }
                              />

                            )
                          )}

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center">

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(item)
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

                      <td className="px-5 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              iziToast.info({
                                title: item.name,
                                message:
                                  item.message,
                                position:
                                  "topRight",
                              })
                            }
                            className="rounded-lg bg-blue-50 p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white"
                          >
                            <FaEye />
                          </button>

                          <Link
                            to={`/testimonial/update/${item.id}`}
                            className="rounded-lg bg-amber-50 p-2.5 text-amber-600 hover:bg-amber-500 hover:text-white"
                          >
                            <FaEdit />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item.id)
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
                    No testimonial found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>}

        {/* PAGINATION */}

        {!loading && <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <b>{currentTestimonials.length}</b>{" "}
            of{" "}
            <b>{filteredTestimonials.length}</b>{" "}
            records
          </p>

          <div className="flex gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (page) => page - 1
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              {
                length: totalPages || 1,
              },
              (_, i) => i + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`rounded-lg px-4 py-2 text-sm font-bold ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300"
                }`}
              >
                {page}
              </button>

            ))}

            <button
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page + 1
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>}

      </div>
    </div>
  );
};

export default ViewTestimonial;