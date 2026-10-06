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

const API_URL = "http://localhost:8000/api/admin/products";

const ViewProduct = () => {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(false);

  const itemsPerPage = 15;

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (product) => {
    if (!product.image) {
      return "";
    }

    const imagePath = (
      product.imagePath || "uploads/products/"
    )
      .replace(/^\/+|\/+$/g, "");

    return `http://localhost:8000/${imagePath}/${product.image}`;
  };

  // ==========================================
  // VIEW PRODUCTS API
  // ==========================================

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const body = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Search
      if (search.trim()) {
        body.name = search.trim();
      }

      const response = await fetch(`${API_URL}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      console.log("Product View Response:", result);

      if (result._status) {
        const records = result._data || [];

        const imagePath =
          result._image_path || "uploads/products/";

        const formattedProducts = records.map((item) => ({
          id: item._id,

          name: item.name || "",

          category:
            item.category_id?.name ||
            item.category?.name ||
            "N/A",

          categoryId:
            item.category_id?._id ||
            item.category_id ||
            "",

          subCategory:
            item.sub_category_id?.name ||
            item.sub_category?.name ||
            "N/A",

          subCategoryId:
            item.sub_category_id?._id ||
            item.sub_category_id ||
            "",

          subSubCategory:
            item.sub_sub_category_id?.name ||
            item.sub_sub_category?.name ||
            "N/A",

          material:
            Array.isArray(item.material_ids)
              ? item.material_ids
                  .map((material) =>
                    typeof material === "object"
                      ? material.name
                      : material
                  )
                  .join(", ")
              : item.material_ids?.name || "N/A",

          color:
            Array.isArray(item.color_ids)
              ? item.color_ids
                  .map((color) =>
                    typeof color === "object"
                      ? color.name
                      : color
                  )
                  .join(", ")
              : item.color_ids?.name || "N/A",

          price: Number(item.actual_price || 0),

          salePrice: Number(item.sale_price || 0),

          stock: Number(item.stock || 0),

          description:
            item.short_description ||
            item.long_description ||
            "",

          status:
            item.status === true ||
            item.status === 1 ||
            item.status === "1",

          image: item.image || "",

          imagePath: imagePath,
        }));

        setProducts(formattedProducts);

        setTotalRecords(
          result._paginate?.total_records ||
            formattedProducts.length
        );

        setTotalPages(
          result._paginate?.total_pages || 1
        );
      } else {
        setProducts([]);
        setTotalRecords(0);
        setTotalPages(1);

        if (result._message) {
          iziToast.error({
            title: "Error",
            message: result._message,
            position: "topRight",
          });
        }
      }
    } catch (error) {
      console.error("Product View Error:", error);

      iziToast.error({
        title: "Error",
        message: "Unable to load products",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // API CALL ON PAGE / SEARCH
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  // ==========================================
  // STATUS CHANGE
  // ==========================================

  const handleStatusChange = async (id) => {
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

      console.log("Status Response:", result);

      if (result._status) {
        iziToast.success({
          title: "Success",
          message:
            result._message ||
            "Product status updated successfully",
          position: "topRight",
        });

        fetchProducts();
      } else {
        iziToast.error({
          title: "Error",
          message:
            result._message ||
            "Unable to update status",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      iziToast.error({
        title: "Error",
        message: "Something went wrong",
        position: "topRight",
      });
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = (id) => {
    iziToast.question({
      title: "Delete Product",
      message:
        "Are you sure you want to delete this product?",

      position: "center",

      timeout: false,

      overlay: true,

      buttons: [
        [
          "<button><b>Yes, Delete</b></button>",

          async function (instance, toast) {
            try {
              const response = await fetch(
                `${API_URL}/delete`,
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

              const result =
                await response.json();

              console.log(
                "Delete Response:",
                result
              );

              if (result._status) {
                instance.hide(
                  {
                    transitionOut:
                      "fadeOut",
                  },
                  toast,
                  "button"
                );

                iziToast.success({
                  title: "Deleted",
                  message:
                    result._message ||
                    "Product deleted successfully",
                  position: "topRight",
                });

                // Agar current page ka last record delete ho
                if (
                  products.length === 1 &&
                  currentPage > 1
                ) {
                  setCurrentPage(
                    (page) => page - 1
                  );
                } else {
                  fetchProducts();
                }
              } else {
                iziToast.error({
                  title: "Error",
                  message:
                    result._message ||
                    "Unable to delete product",
                  position: "topRight",
                });
              }
            } catch (error) {
              console.error(
                "Delete Error:",
                error
              );

              iziToast.error({
                title: "Error",
                message:
                  "Something went wrong",
                position: "topRight",
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

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ==========================================
  // FILTER
  // ==========================================

  const handleFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // ==========================================
  // FRONTEND STATUS FILTER
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      if (statusFilter === "active") {
        return product.status === true;
      }

      if (statusFilter === "inactive") {
        return product.status === false;
      }

      return true;
    }
  );

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all products
          </p>
        </div>

        <Link
          to="/product/add"
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          <FaPlus />
          Add Product
        </Link>
      </div>

      {/* CARD */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        {/* SEARCH + FILTER */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">

          {/* SEARCH */}

          <div className="relative w-full lg:w-96">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search product..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>

          {/* FILTER */}

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

          <table className="w-full min-w-[1200px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Material
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Stock
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
                    colSpan="8"
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Loading products...
                  </td>
                </tr>

              ) : filteredProducts.length > 0 ? (

                filteredProducts.map(
                  (product, index) => (

                    <tr
                      key={product.id}
                      className="hover:bg-slate-50"
                    >

                      {/* NUMBER */}

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {(currentPage - 1) *
                          itemsPerPage +
                          index +
                          1}
                      </td>

                      {/* PRODUCT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          {product.image ? (

                            <img
                              src={getImageUrl(product)}
                              alt={product.name}
                              className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                              <FaImage />
                            </div>

                          )}

                          <div>

                            <p className="font-bold text-slate-700">
                              {product.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID: #{product.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td className="px-5 py-4">

                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                          {product.category}
                        </span>

                      </td>

                      {/* MATERIAL */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {product.material}
                      </td>

                      {/* PRICE */}

                      <td className="px-5 py-4">

                        <p className="font-bold text-slate-700">
                          ₹
                          {product.salePrice.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        {product.price !==
                          product.salePrice && (
                          <p className="text-xs text-slate-400 line-through">
                            ₹
                            {product.price.toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        )}

                      </td>

                      {/* STOCK */}

                      <td className="px-5 py-4">

                        <span
                          className={`text-sm font-bold ${
                            product.stock <= 5
                              ? "text-red-500"
                              : "text-slate-600"
                          }`}
                        >
                          {product.stock}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <div className="flex items-center">

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                product.id
                              )
                            }
                            className={`relative h-6 w-11 rounded-full ${
                              product.status
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                            }`}
                          >

                            <span
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                                product.status
                                  ? "left-6"
                                  : "left-1"
                              }`}
                            />

                          </button>

                          <span
                            className={`ml-2 text-xs font-bold ${
                              product.status
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            {product.status
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </div>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex justify-center gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              iziToast.info({
                                title:
                                  "Product Details",
                                message:
                                  product.name,
                                position:
                                  "topRight",
                              })
                            }
                            className="rounded-lg bg-blue-50 p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white"
                          >
                            <FaEye />
                          </button>

                          {/* EDIT */}

                          <Link
                            to={`/product/update/${product.id}`}
                            className="rounded-lg bg-amber-50 p-2.5 text-amber-600 hover:bg-amber-500 hover:text-white"
                          >
                            <FaEdit />
                          </Link>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product.id
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
                    colSpan="8"
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    No product found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <b>
              {filteredProducts.length}
            </b>{" "}
            of{" "}
            <b>{totalRecords}</b>{" "}
            products
          </p>

          <div className="flex items-center gap-2">

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
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`rounded-lg px-4 py-2 text-sm font-bold ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 text-slate-600"
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

        </div>

      </div>
    </div>
  );
};

export default ViewProduct;