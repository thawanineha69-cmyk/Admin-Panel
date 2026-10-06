import React from "react";
import {
  FaBox,
  FaLayerGroup,
  FaPalette,
  FaStar,
  FaShoppingCart,
  FaUsers,
  FaPlus,
  FaEye,
} from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "120",
      icon: <FaBox />,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Categories",
      value: "18",
      icon: <FaLayerGroup />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "Materials",
      value: "25",
      icon: <FaPalette />,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "Testimonials",
      value: "32",
      icon: <FaStar />,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
  ];

  const recentProducts = [
    {
      id: 1,
      name: "Modern Sofa",
      category: "Sofa",
      price: "₹25,000",
      status: "Active",
    },
    {
      id: 2,
      name: "Wooden Chair",
      category: "Chair",
      price: "₹8,500",
      status: "Active",
    },
    {
      id: 3,
      name: "Dining Table",
      category: "Table",
      price: "₹32,000",
      status: "Active",
    },
    {
      id: 4,
      name: "Office Chair",
      category: "Chair",
      price: "₹12,000",
      status: "Inactive",
    },
    {
      id: 5,
      name: "King Size Bed",
      category: "Bed",
      price: "₹45,000",
      status: "Active",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition">
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              
              <div>
                <p className="text-gray-500 text-sm">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-full ${item.bg} ${item.text} flex items-center justify-center text-xl`}
              >
                {item.icon}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Orders
            </h2>

            <FaShoppingCart className="text-blue-600 text-xl" />
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-gray-800">
              86
            </span>

            <span className="text-green-600 text-sm mb-2">
              +12% this month
            </span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-5">
            <div className="bg-blue-600 h-2 rounded-full w-[70%]"></div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Customers
            </h2>

            <FaUsers className="text-green-600 text-xl" />
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-gray-800">
              245
            </span>

            <span className="text-green-600 text-sm mb-2">
              +8% this month
            </span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-5">
            <div className="bg-green-500 h-2 rounded-full w-[80%]"></div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Average Rating
            </h2>

            <FaStar className="text-yellow-500 text-xl" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-gray-800">
              4.8
            </span>

            <div className="text-yellow-500">
              ★★★★★
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-4">
            Based on 32 testimonials
          </p>
        </div>

      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm">

        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Products
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Recently added products
            </p>
          </div>

          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <FaEye />
            View All
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Product
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Category
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Price
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {recentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">
                      {product.name}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {product.category}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {product.price}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;