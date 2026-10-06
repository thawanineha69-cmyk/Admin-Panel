import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaToggleOn,
    FaToggleOff,
} from "react-icons/fa";

const API_URL = "http://localhost:8000/api/admin/materials";

const ViewMaterial = () => {
    const [materials, setMaterials] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 5;

    const filteredMaterials = useMemo(() => {
        return materials.filter((material) => {
            const name = (material.name || "").toLowerCase();
            const query = search.toLowerCase();

            const searchMatch = !query || name.includes(query);

            let statusMatch = true;

            if (statusFilter === "active") {
                statusMatch = Boolean(material.status) === true;
            }

            if (statusFilter === "inactive") {
                statusMatch = Boolean(material.status) === false;
            }

            return searchMatch && statusMatch;
        });
    }, [materials, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredMaterials.length / itemsPerPage));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMaterials = filteredMaterials.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    // =========================
    // VIEW MATERIAL API
    // =========================
    const fetchMaterials = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/view`,
                {
                    page: 1,
                    limit: 15,
                }
            );

            console.log("VIEW MATERIAL:", response.data);

            if (response.data._status === true) {
                const data = response.data._data;
                setMaterials(Array.isArray(data) ? data : data?.rows || data?.docs || []);
            } else {
                setMaterials([]);

                iziToast.info({
                    title: "Info",
                    message: response.data._message,
                    position: "topRight",
                });
            }

        } catch (error) {
            console.error("VIEW ERROR:", error);

            iziToast.error({
                title: "Error",
                message:
                    error.response?.data?._message ||
                    error.message ||
                    "Something went wrong",
                position: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    // API page load par call hogi
    useEffect(() => {
        fetchMaterials();
    }, []);

    // =========================
    // CHANGE STATUS
    // =========================
    const handleStatusChange = async (id, currentStatus) => {
        try {
            const response = await axios.put(
                `${API_URL}/change-status`,
                {
                    ids: [id]
                    
                }
            );

            console.log("STATUS RESPONSE:", response.data);

            if (response.data._status === true) {
                iziToast.success({
                    title: "Success",
                    message: response.data._message || "Status updated successfully",
                    position: "topRight",
                });

                // List refresh
                fetchMaterials();
            } else {
                iziToast.error({
                    title: "Error",
                    message: response.data._message || "Unable to update status",
                    position: "topRight",
                });
            }
        } catch (error) {
            console.error("STATUS ERROR:", error);

            iziToast.error({
                title: "Error",
                message:
                    error.response?.data?._message ||
                    "Unable to change status",
                position: "topRight",
            });
        }
    };

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this material?")) {
            return;
        }

        try {
            const response = await axios.put(
                `${API_URL}/delete`,
                {
                    ids: [id],
                }
            );

            if (response.data._status === true) {
                iziToast.success({
                    title: "Success",
                    message: response.data._message,
                    position: "topRight",
                });

                fetchMaterials();
            } else {
                iziToast.error({
                    title: "Error",
                    message: response.data._message,
                    position: "topRight",
                });
            }

        } catch (error) {
            console.error(error);

            iziToast.error({
                title: "Error",
                message: "Unable to delete material",
                position: "topRight",
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">
                        Materials
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your materials
                    </p>
                </div>

                <Link
                    to="/material/add"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                >
                    <FaPlus />
                    Add Material
                </Link>

            </div>

            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search material name"
                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        />
                    </div>

                    <div className="relative w-full md:max-w-xs">
                        <FaFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading...
                    </div>
                ) : currentMaterials.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        No materials found
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        #
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Material Name
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Order
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {currentMaterials.map((material, index) => (
                                    <tr
                                        key={material._id}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">
                                            {startIndex + index + 1}
                                        </td>

                                        <td className="px-6 py-4 font-semibold">
                                            {material.name}
                                        </td>

                                        <td className="px-6 py-4">
                                            {material.order}
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(material._id, material.status)}
                                                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                                                    material.status
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                            >
                                                {material.status ? <FaToggleOn /> : <FaToggleOff />}
                                                {material.status ? "Active" : "Inactive"}
                                            </button>
                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="flex justify-center gap-3">

                                                <Link
                                                    to={`/material/update/${material._id}`}
                                                    className="rounded-lg bg-blue-100 p-3 text-blue-600"
                                                >
                                                    <FaEdit />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(material._id)}
                                                    className="rounded-lg bg-red-100 p-3 text-red-600"
                                                >
                                                    <FaTrash />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {!loading && filteredMaterials.length > itemsPerPage && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span className="text-sm font-medium text-slate-600">
                        Page {currentPage} / {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    );
};

export default ViewMaterial;