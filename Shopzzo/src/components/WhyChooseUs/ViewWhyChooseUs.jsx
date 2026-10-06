import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/why-choose-us";

const ViewWhyChooseUs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        setItems(data.data || data.items || data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this item?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Deleted successfully");
        fetchItems();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Why Choose Us
          </h1>

          <p className="text-gray-500">
            Manage your Why Choose Us section
          </p>
        </div>

        <Link
          to="/why-choose-us/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          <FaPlus />
          Add Why Choose Us
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-8 text-center">
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No records found
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Icon</th>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {items.map((item, index) => (

                  <tr
                    key={item._id || item.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        {item.icon || "★"}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {item.title}
                    </td>

                    <td className="px-6 py-4 text-gray-600 max-w-md">
                      {item.description}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/why-choose-us/update/${
                            item._id || item.id
                          }`}
                          className="bg-green-100 text-green-600 p-3 rounded-lg"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              item._id || item.id
                            )
                          }
                          className="bg-red-100 text-red-600 p-3 rounded-lg"
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

export default ViewWhyChooseUs;