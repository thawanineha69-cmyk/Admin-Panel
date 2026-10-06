import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL = "http://localhost:8000/api/admin/products";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const fileRef = useRef(null);

  const isEdit = Boolean(id);

  // =====================================================
  // FORM STATES
  // =====================================================

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");

  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");

  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("1");

  // =====================================================
  // DROPDOWN STATES
  // =====================================================

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);

  // =====================================================
  // IMAGE
  // =====================================================

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/parent-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      console.log(
        "Parent Categories Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        setCategories(data._data || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Category Error:", error);

      iziToast.error({
        title: "Error",
        message: "Failed to load categories",
        position: "topRight",
      });
    }
  };

  // =====================================================
  // FETCH SUB CATEGORIES
  // =====================================================

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/sub-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parent_category_id: categoryId,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Sub Categories Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        setSubCategories(data._data || []);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Sub Category Error:", error);

      iziToast.error({
        title: "Error",
        message: "Failed to load sub categories",
        position: "topRight",
      });
    }
  };

  // =====================================================
  // FETCH SUB-SUB CATEGORIES
  // =====================================================

  const fetchSubSubCategories = async (subCategoryId) => {
    if (!subCategoryId) {
      setSubSubCategories([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/sub-sub-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sub_category_id: subCategoryId,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Sub Sub Categories Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        setSubSubCategories(data._data || []);
      } else {
        setSubSubCategories([]);
      }
    } catch (error) {
      console.error("Sub Sub Category Error:", error);

      iziToast.error({
        title: "Error",
        message: "Failed to load sub-sub categories",
        position: "topRight",
      });
    }
  };

  // =====================================================
  // FETCH MATERIALS
  // =====================================================

  const fetchMaterials = async () => {
    try {
      const response = await fetch(
        `${API_URL}/materials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      console.log(
        "Materials Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        setMaterials(data._data || []);
      } else {
        setMaterials([]);
      }
    } catch (error) {
      console.error("Material Error:", error);

      iziToast.error({
        title: "Error",
        message: "Failed to load materials",
        position: "topRight",
      });
    }
  };

  // =====================================================
  // FETCH COLORS
  // =====================================================

  const fetchColors = async () => {
    try {
      const response = await fetch(
        `${API_URL}/colors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      console.log(
        "Colors Response:",
        JSON.stringify(data, null, 2)
      );

      if (data._status) {
        setColors(data._data || []);
      } else {
        setColors([]);
      }
    } catch (error) {
      console.error("Color Error:", error);

      iziToast.error({
        title: "Error",
        message: "Failed to load colors",
        position: "topRight",
      });
    }
  };

  // =====================================================
  // INITIAL DATA
  // =====================================================

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
    fetchColors();
  }, []);

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;

    setCategory(categoryId);

    // Reset dependent fields
    setSubCategory("");
    setSubSubCategory("");

    setSubCategories([]);
    setSubSubCategories([]);

    if (categoryId) {
      await fetchSubCategories(categoryId);
    }
  };

  // =====================================================
  // SUB CATEGORY CHANGE
  // =====================================================

  const handleSubCategoryChange = async (e) => {
    const subCategoryId = e.target.value;

    setSubCategory(subCategoryId);

    // Reset sub-sub category
    setSubSubCategory("");
    setSubSubCategories([]);

    if (subCategoryId) {
      await fetchSubSubCategories(subCategoryId);
    }
  };

  // =====================================================
  // EDIT DETAILS
  // =====================================================

  const fetchDetails = async () => {
    if (!id) return;

    setFetching(true);

    try {
      const response = await fetch(
        `${API_URL}/details/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      console.log(
        "Product Details Response:",
        JSON.stringify(data, null, 2)
      );

      if (!data._status || !data._data) {
        iziToast.error({
          title: "Error",
          message: data._message || "Product details not found",
          position: "topRight",
        });

        return;
      }

      const product = data._data;

      // ---------------------------------------------
      // BASIC DATA
      // ---------------------------------------------

      setProductName(product.name || "");

      // ---------------------------------------------
      // CATEGORY
      // ---------------------------------------------

      const categoryId =
        product.parent_category_id?._id ||
        product.parent_category_id ||
        "";

      setCategory(String(categoryId));

      // Load sub categories
      if (categoryId) {
        await fetchSubCategories(categoryId);
      }

      // ---------------------------------------------
      // SUB CATEGORY
      // ---------------------------------------------

      const subCategoryId =
        product.sub_category_id?._id ||
        product.sub_category_id ||
        "";

      setSubCategory(String(subCategoryId));

      // Load sub-sub categories
      if (subCategoryId) {
        await fetchSubSubCategories(subCategoryId);
      }

      // ---------------------------------------------
      // SUB SUB CATEGORY
      // ---------------------------------------------

      const subSubCategoryId =
        product.sub_sub_category_id?._id ||
        product.sub_sub_category_id ||
        "";

      setSubSubCategory(String(subSubCategoryId));

      // ---------------------------------------------
      // MATERIAL
      // ---------------------------------------------

      if (Array.isArray(product.material_ids)) {
        setMaterial(
          product.material_ids[0]?._id ||
            product.material_ids[0] ||
            ""
        );
      } else {
        setMaterial(product.material_ids || "");
      }

      // ---------------------------------------------
      // COLOR
      // ---------------------------------------------

      if (Array.isArray(product.color_ids)) {
        setColor(
          product.color_ids[0]?._id ||
            product.color_ids[0] ||
            ""
        );
      } else {
        setColor(product.color_ids || "");
      }

      // ---------------------------------------------
      // PRICE
      // ---------------------------------------------

      setPrice(
        product.actual_price !== undefined
          ? String(product.actual_price)
          : ""
      );

      setSalePrice(
        product.sale_price !== undefined
          ? String(product.sale_price)
          : ""
      );

      // ---------------------------------------------
      // STOCK
      // ---------------------------------------------

      setStock(
        product.stock !== undefined
          ? String(product.stock)
          : ""
      );

      // ---------------------------------------------
      // DESCRIPTION
      // ---------------------------------------------

      setDescription(
        product.short_description ||
          product.long_description ||
          ""
      );

      // ---------------------------------------------
      // STATUS
      // ---------------------------------------------

      setStatus(product.status ? "1" : "0");

      // ---------------------------------------------
      // IMAGE
      // ---------------------------------------------

      if (product.image) {
        const imagePath =
          data._image_path ||
          "uploads/products/";

        const cleanPath = imagePath
          .replace(/^\/+|\/+$/g, "");

        setPreview(
          `http://localhost:8000/${cleanPath}/${product.image}`
        );
      }
    } catch (error) {
      console.error("Details Error:", error);

      iziToast.error({
        title: "Error",
        message: "Failed to load product details",
        position: "topRight",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      iziToast.error({
        title: "Error",
        message: "Please select a valid image",
        position: "topRight",
      });

      return;
    }

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = () => {
    setImage(null);
    setPreview("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!productName.trim()) {
      iziToast.error({
        title: "Error",
        message: "Product name is required",
        position: "topRight",
      });

      return;
    }

    if (!category) {
      iziToast.error({
        title: "Error",
        message: "Please select category",
        position: "topRight",
      });

      return;
    }

    if (!subCategory) {
      iziToast.error({
        title: "Error",
        message: "Please select sub category",
        position: "topRight",
      });

      return;
    }

    if (!subSubCategory) {
      iziToast.error({
        title: "Error",
        message: "Please select sub-sub category",
        position: "topRight",
      });

      return;
    }

    if (!material) {
      iziToast.error({
        title: "Error",
        message: "Please select material",
        position: "topRight",
      });

      return;
    }

    if (!color) {
      iziToast.error({
        title: "Error",
        message: "Please select color",
        position: "topRight",
      });

      return;
    }

    if (!price) {
      iziToast.error({
        title: "Error",
        message: "Price is required",
        position: "topRight",
      });

      return;
    }

    if (!salePrice) {
      iziToast.error({
        title: "Error",
        message: "Sale price is required",
        position: "topRight",
      });

      return;
    }

    if (!stock) {
      iziToast.error({
        title: "Error",
        message: "Stock is required",
        position: "topRight",
      });

      return;
    }

    if (!description.trim()) {
      iziToast.error({
        title: "Error",
        message: "Description is required",
        position: "topRight",
      });

      return;
    }

    setLoading(true);

    try {
      // ---------------------------------------------
      // FORM DATA
      // ---------------------------------------------

      const formData = new FormData();

      formData.append("name", productName);

      formData.append(
        "parent_category_id",
        category
      );

      formData.append(
        "sub_category_id",
        subCategory
      );

      formData.append(
        "sub_sub_category_id",
        subSubCategory
      );

      // Array fields
      formData.append(
        "material_ids",
        JSON.stringify([material])
      );

      formData.append(
        "color_ids",
        JSON.stringify([color])
      );

      formData.append(
        "actual_price",
        price
      );

      formData.append(
        "sale_price",
        salePrice
      );

      // Stock
      formData.append(
        "stock",
        stock
      );

      // Product schema has both fields
     formData.append("description", description);

      formData.append(
        "status",
        status === "1" ? "true" : "false"
      );

      // Image
      if (image) {
        formData.append("image", image);
      }

      // ---------------------------------------------
      // DEBUG
      // ---------------------------------------------

      console.log("Product Form Data:");

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // ---------------------------------------------
      // API
      // ---------------------------------------------

      let response;

      if (isEdit) {
        response = await fetch(
          `${API_URL}/update/${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );
      } else {
        response = await fetch(
          `${API_URL}/create`,
          {
            method: "POST",
            body: formData,
          }
        );
      }

      const data = await response.json();

      console.log(
        "Product Save Response:",
        JSON.stringify(data, null, 2)
      );

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      if (data._status) {
        iziToast.success({
          title: "Success",
          message:
            data._message ||
            (isEdit
              ? "Product updated successfully"
              : "Product added successfully"),
          position: "topRight",
        });

        navigate("/product/view");
      } else {
        // -------------------------------------------
        // BACKEND VALIDATION ERROR
        // -------------------------------------------

        let errorMessage =
          data._message || "Something went wrong";

        if (
          data._error &&
          typeof data._error === "object"
        ) {
          errorMessage = Object.values(data._error)
            .map((item) =>
              item?.message
                ? item.message
                : String(item)
            )
            .join(", ");
        }

        iziToast.error({
          title: "Error",
          message: errorMessage,
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Product Submit Error:", error);

      iziToast.error({
        title: "Error",
        message: "Server error. Please try again.",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING EDIT
  // =====================================================

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-lg font-semibold text-slate-700">
          Loading product...
        </div>
      </div>
    );
  }

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? "Update product details"
              : "Create a new product"}
          </p>
        </div>

        <Link
          to="/product/view"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back
        </Link>

      </div>

      {/* FORM */}

      <div className="rounded-2xl bg-white p-5 shadow-sm md:p-8">

        <form onSubmit={handleSubmit}>

          <div className="grid gap-8 lg:grid-cols-2">

            {/* =====================================================
                LEFT
            ===================================================== */}

            <div className="space-y-5">

              {/* PRODUCT NAME */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Product Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={productName}
                  onChange={(e) =>
                    setProductName(e.target.value)
                  }
                  placeholder="Enter product name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Category
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Sub Category
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={subCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!category}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500"
                >
                  <option value="">
                    Select Sub Category
                  </option>

                  {subCategories.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB SUB CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Sub Sub Category
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={subSubCategory}
                  onChange={(e) =>
                    setSubSubCategory(e.target.value)
                  }
                  disabled={!subCategory}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500"
                >
                  <option value="">
                    Select Sub Sub Category
                  </option>

                  {subSubCategories.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* MATERIAL */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Material
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={material}
                  onChange={(e) =>
                    setMaterial(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select Material
                  </option>

                  {materials.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* COLOR */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Color
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={color}
                  onChange={(e) =>
                    setColor(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select Color
                  </option>

                  {colors.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Price
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    placeholder="₹ 0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Sale Price
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) =>
                      setSalePrice(e.target.value)
                    }
                    placeholder="₹ 0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              {/* STOCK */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Stock
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  placeholder="Enter stock quantity"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="1">
                    Active
                  </option>

                  <option value="0">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

            {/* =====================================================
                RIGHT
            ===================================================== */}

            <div className="space-y-5">

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Product Image
                </label>

                <div
                  onClick={() =>
                    fileRef.current?.click()
                  }
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-4 hover:border-blue-400"
                >

                  {preview ? (

                    <div className="relative">

                      <img
                        src={preview}
                        alt="Product Preview"
                        className="h-80 w-full rounded-xl object-contain"
                      />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>

                    </div>

                  ) : (

                    <div className="flex h-80 flex-col items-center justify-center text-center">

                      <FaCloudUploadAlt className="mb-4 text-6xl text-blue-500" />

                      <p className="font-bold text-slate-700">
                        Click to upload image
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        PNG, JPG or JPEG
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Recommended: 800 × 800 px
                      </p>

                    </div>

                  )}

                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {image && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected: {image.name}
                  </p>
                )}

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  rows="9"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Enter product description..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">

            <Link
              to="/product/view"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <FaSave />

              {loading
                ? "Saving..."
                : isEdit
                ? "Update Product"
                : "Save Product"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddProduct;