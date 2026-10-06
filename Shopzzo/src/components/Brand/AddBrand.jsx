import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:8000/api/admin/brands";

const AddBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // ============================
  // GET BRAND DETAILS FOR EDIT
  // Backend: POST /details/:id
  // ============================
  useEffect(() => {
    if (isEdit) {
      fetch(`${API_URL}/details/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("DETAIL RESPONSE:", data);

          if (data._status === true) {
            setFormData({
              name: data._data.name || "",
              description: data._data.description || "",
            });
          }
        })
        .catch((error) => {
          console.error("DETAIL ERROR:", error);
        });
    }
  }, [id, isEdit]);

  // ============================
  // HANDLE INPUT CHANGE
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // ADD / UPDATE BRAND
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log("FORM DATA BEFORE SUBMIT:", formData);
    // // Validation
    // if (!formData.name.trim()) {
    //   alert("Brand name is required");
    //   return;
    // }

    try {
      // setLoading(true);

      // Add = POST /create
      // Edit = PUT /update/:id
      const url = isEdit
        ? `${API_URL}/update/${id}`
        : `${API_URL}/create`;

      const method = isEdit ? "PUT" : "POST";

      console.log("REQUEST BODY:", {
      name: formData.name,
      description: formData.description,
    });


      // console.log("Request URL:", url);
      // console.log("Request Method:", method);
      // console.log("Request Data:", formData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });

      const data = await response.json();

      console.log("UPDATE/CREATE RESPONSE:", data);

      if (response.ok && data._status === true) {
        alert(data._message);
        navigate("/brand/view");
      } else {
        console.error("API ERROR:", data._error);
        alert(data._message || "Something went wrong");
      }
    } catch (error) {
      console.error("FETCH ERROR:", error);
      alert("Server error");
    }
  };

  // ============================
  // LOADING EDIT DATA
  // ============================
  if (fetching) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">
            Loading brand...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ============================
          PAGE HEADER
      ============================ */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Update Brand" : "Add Brand"}
        </h1>

        <p className="text-gray-500 mt-1">
          {isEdit
            ? "Update the brand details"
            : "Add a new product brand"}
        </p>
      </div>

      {/* ============================
          FORM CARD
      ============================ */}
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* ============================
              BRAND NAME
          ============================ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter brand name"
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* ============================
              DESCRIPTION
          ============================ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter brand description"
              rows={5}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* ============================
              BUTTONS
          ============================ */}
          <div className="flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                  ? "Update Brand"
                  : "Add Brand"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/brand/view")}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBrand;