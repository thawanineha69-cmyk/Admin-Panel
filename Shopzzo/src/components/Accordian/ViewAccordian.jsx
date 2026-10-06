import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronDown,
  FaEdit,
  FaEye,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL = "http://localhost:8000/api/admin/accordions";

const ViewAccordion = () => {

  const [accordions, setAccordions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [openId, setOpenId] = useState(null);

  const itemsPerPage = 5;

  const fetchAccordions = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok || data._status !== true) {
        throw new Error(data._message || "Unable to fetch accordions");
      }

      setAccordions((data._data || []).map((item) => ({
        ...item,
        id: item.id || item._id,
        question: item.question || "",
        answer: item.answer || item.description || "",
        status: Boolean(item.status),
      })));
    } catch (error) {
      console.error("FETCH ACCORDIONS ERROR:", error);
      setAccordions([]);
      iziToast.error({
        title: "Error",
        message: error.message || "Unable to fetch accordions",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccordions();
  }, []);

  // SEARCH + FILTER

  const filteredAccordions = useMemo(() => {

    return accordions.filter((item) => {

      const searchValue =
        search.toLowerCase();

      const searchMatch =
        (item.question || "")
          .toLowerCase()
          .includes(searchValue) ||
        (item.answer || "")
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

  }, [accordions, search, statusFilter]);

  // PAGINATION

  const totalPages = Math.ceil(
    filteredAccordions.length /
    itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentAccordions =
    filteredAccordions.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // STATUS

  const handleStatusChange = async (item) => {
    try {
      const newStatus = !item.status;

      const response = await fetch(`${API_URL}/change-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      console.log("STATUS RESPONSE:", data);

      if (!response.ok || data._status !== true) {
        throw new Error(
          data._message || "Status update failed"
        );
      }

      setAccordions((previous) =>
        previous.map((accordion) =>
          accordion.id === item.id
            ? {
              ...accordion,
              status: newStatus,
            }
            : accordion
        )
      );

      iziToast.success({
        title: "Success",
        message: data._message || "Status updated successfully",
        position: "topRight",
      });

    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);

      iziToast.error({
        title: "Error",
        message: error.message || "Unable to update status",
        position: "topRight",
      });
    }
  };

  // DELETE

  const handleDelete = (id) => {

    iziToast.question({

      title: "Delete Accordion",

      message:
        "Are you sure you want to delete this accordion?",

      position: "center",

      timeout: false,

      overlay: true,

      buttons: [

        [
          "<button><b>Yes, Delete</b></button>",

          function (instance, toast) {

            fetch(`${API_URL}/delete`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: id }),
            })
              .then(async (response) => {
                const data = await response.json();

                if (!response.ok || data._status !== true) {
                  throw new Error(data._message || "Delete failed");
                }

                setAccordions((previous) =>
                  previous.filter((item) => item.id !== id)
                );

                iziToast.success({
                  title: "Deleted",
                  message: data._message || "Accordion deleted successfully",
                  position: "topRight",
                });
              })
              .catch((error) => {
                console.error("DELETE ACCORDION ERROR:", error);
                iziToast.error({
                  title: "Error",
                  message: error.message || "Unable to delete accordion",
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
            Accordion
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage FAQ questions and answers
          </p>

        </div>

        <Link
          to="/accordion/add"
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          <FaPlus />
          Add Accordion
        </Link>

      </div>

      {/* CARD */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        {loading && (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading accordions...
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
              placeholder="Search question..."
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

          <table className="w-full min-w-250">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Question
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Answer
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

              {currentAccordions.length > 0 ? (

                currentAccordions.map(
                  (item, index) => (

                    <React.Fragment key={item.id}>

                      <tr className="hover:bg-slate-50">

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {startIndex + index + 1}
                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                setOpenId(
                                  openId === item.id
                                    ? null
                                    : item.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                            >

                              <FaChevronDown
                                className={`transition ${openId === item.id
                                    ? "rotate-180"
                                    : ""
                                  }`}
                              />

                            </button>

                            <span className="font-semibold text-slate-700">
                              {item.question}
                            </span>

                          </div>

                        </td>

                        <td className="max-w-md px-5 py-4">

                          <p className="line-clamp-2 text-sm text-slate-500">
                            {item.answer}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center">

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(item)
                              }
                              className={`relative h-6 w-11 rounded-full ${item.status
                                  ? "bg-emerald-500"
                                  : "bg-slate-300"
                                }`}
                            >

                              <span
                                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${item.status
                                    ? "left-6"
                                    : "left-1"
                                  }`}
                              />

                            </button>

                            <span
                              className={`ml-2 text-xs font-bold ${item.status
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
                                setOpenId(
                                  openId === item.id
                                    ? null
                                    : item.id
                                )
                              }
                              className="rounded-lg bg-blue-50 p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                              <FaEye />
                            </button>

                            <Link
                              to={`/accordion/update/${item.id}`}
                              className="rounded-lg bg-amber-50 p-2.5 text-amber-600 hover:bg-amber-500 hover:text-white"
                            >
                              <FaEdit />
                            </Link>

                            <button
                              type="button"
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

                      {/* ACCORDION OPEN */}

                      {openId === item.id && (

                        <tr>

                          <td
                            colSpan="5"
                            className="bg-slate-50 px-5 py-5"
                          >

                            <div className="rounded-xl border border-slate-200 bg-white p-5">

                              <p className="mb-2 text-sm font-bold text-slate-700">
                                Answer
                              </p>

                              <p className="text-sm leading-6 text-slate-600">
                                {item.answer}
                              </p>

                            </div>

                          </td>

                        </tr>

                      )}

                    </React.Fragment>

                  )

                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    No accordion found
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
            <b>{currentAccordions.length}</b>{" "}
            of{" "}
            <b>{filteredAccordions.length}</b>{" "}
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
                className={`rounded-lg px-4 py-2 text-sm font-bold ${currentPage === page
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

export default ViewAccordion;