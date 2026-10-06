import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const API_URL = "http://localhost:8000/api/admin/brands";

const ViewBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // VIEW BRANDS
  // POST /brands/view
  // =========================
  const fetchBrands = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log(
        "View Brand Response:",
        JSON.stringify(data, null, 2)
      );

      if (response.ok && data._status === true) {
        setBrands(data._data || []);
      } else {
        setBrands([]);
        console.error("View error:", data._error);
      }
    } catch (error) {
      console.error("Fetch brands error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // =========================
  // DELETE BRAND
  // DELETE /brands/delete
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) {
      return;
    }

    try {
      
      const response = await fetch(`${API_URL}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: id,
        }),
      });

      const data = await response.json();

      console.log("DELETE RESPONSE:", data);

     if (response.ok && data._status === true) {
      alert(data._message);
      fetchBrands();
    } else {
      alert(data._message || "Delete failed");
    }
  } catch (error) {
    console.error("DELETE ERROR:", error);
    alert("Server error");
  }
};

  return (
    <div className="p-6">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Brands
          </h1>

          <p className="text-gray-500">
            Manage all brands
          </p>
        </div>

        <Link
          to="/brand/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          <FaPlus />
          Add Brand
        </Link>

      </div>

      {/* =========================
          TABLE
      ========================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-8 text-center">
            Loading brands...
          </div>
        ) : brands.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No brands found
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>
                  <th className="px-6 py-4 text-left">
                    #
                  </th>

                  <th className="px-6 py-4 text-left">
                    Brand Name
                  </th>

                  <th className="px-6 py-4 text-left">
                    Description
                  </th>

                  <th className="px-6 py-4 text-center">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {brands.map((brand, index) => (

                  <tr
                    key={brand._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {brand.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {brand.description || "-"}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center gap-3">

                        {/* UPDATE */}
                        <Link
                          to={`/brand/update/${brand._id}`}
                          className="bg-green-100 text-green-600 p-3 rounded-lg hover:bg-green-200"
                        >
                          <FaEdit />
                        </Link>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(brand._id)
                          }
                          className="bg-red-100 text-red-600 p-3 rounded-lg hover:bg-red-200"
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
    </div>
  );
};

export default ViewBrand;