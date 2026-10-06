import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

import {
  FaPlus,
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

/* =====================================================
   PROTECTED ROUTE
===================================================== */

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


/* =====================================================
   ADMIN LAYOUT
===================================================== */

export const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};


/* =====================================================
   PAGE HEADER
===================================================== */

export const PageHeader = ({
  title,
  description,
  buttonText,
  buttonLink,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {title}
        </h1>

        {description && (
          <p className="text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      {buttonText && buttonLink && (
        <button
          onClick={() => navigate(buttonLink)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
        >
          <FaPlus />
          {buttonText}
        </button>
      )}

    </div>
  );
};


/* =====================================================
   LOADING
===================================================== */

export const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <FaSpinner className="text-blue-600 text-3xl animate-spin" />

      <p className="text-gray-500 mt-3">
        {text}
      </p>

    </div>
  );
};


/* =====================================================
   EMPTY STATE
===================================================== */

export const EmptyState = ({
  title = "No Data Found",
  message = "There is no data available.",
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-10 text-center">

      <div className="text-gray-300 text-5xl mb-4">
        📂
      </div>

      <h3 className="text-lg font-semibold text-gray-700">
        {title}
      </h3>

      <p className="text-gray-500 mt-2">
        {message}
      </p>

    </div>
  );
};


/* =====================================================
   DELETE MODAL
===================================================== */

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">

          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}
        <div className="p-6 text-center">

          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>

          <p className="text-gray-600 mt-5">
            {message}
          </p>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash />
                Delete
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};


/* =====================================================
   STATUS BADGE
===================================================== */

export const StatusBadge = ({ status }) => {
  const isActive =
    status === true ||
    status === "true" ||
    status === "Active" ||
    status === 1;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};


/* =====================================================
   TABLE ACTION BUTTONS
===================================================== */

export const ActionButton = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${className}`}
    >
      {children}
    </button>
  );
};