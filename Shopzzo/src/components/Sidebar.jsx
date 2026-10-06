import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaLayerGroup,
  FaPalette,
  FaTrademark,
  FaUsers,
  FaStar,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaEye,
} from "react-icons/fa";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    category: true,
    material: false,
    product: false,
    color: false,
    brand: false,
    testimonial: false,
    accordion: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const mainLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  const subLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 ml-6 text-sm rounded-lg transition ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  // Heading for Category / Sub Category / Sub Sub Category
  const headingClass =
    "px-4 ml-6 mt-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide";

  return (
    <aside className="w-64 bg-white border-r min-h-screen fixed left-0 top-0 z-40">

      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          Admin Panel
        </h1>
      </div>

      {/* Menu */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">

        {/* ================= DASHBOARD ================= */}
        <NavLink to="/dashboard" className={mainLinkClass}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        {/* ================= CATEGORY ================= */}
        <div className="mt-2">

          <button
            onClick={() => toggleMenu("category")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaLayerGroup />
              <span>Category</span>
            </div>

            {openMenus.category ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>

          {openMenus.category && (
            <div className="mt-1 space-y-1">

              {/* ---------- CATEGORY ---------- */}
              <div className={headingClass}>
                Category
              </div>

              <NavLink
                to="/category/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Category
              </NavLink>

              <NavLink
                to="/category/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Category
              </NavLink>


              {/* ---------- SUB CATEGORY ---------- */}
              <div className={headingClass}>
                Sub Category
              </div>

              <NavLink
                to="/subcategory/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Sub Category
              </NavLink>

              <NavLink
                to="/subcategory/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Sub Category
              </NavLink>


              {/* ---------- SUB SUB CATEGORY ---------- */}
              <div className={headingClass}>
                Sub Sub Category
              </div>

              <NavLink
                to="/subsubcategory/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Sub Sub Category
              </NavLink>

              <NavLink
                to="/subsubcategory/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Sub Sub Category
              </NavLink>

            </div>
          )}
        </div>


        {/* ================= MATERIAL ================= */}
        <div className="mt-2">

          <button
            onClick={() => toggleMenu("material")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaBox />
              <span>Material</span>
            </div>

            {openMenus.material ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>

          {openMenus.material && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/material/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Material
              </NavLink>

              <NavLink
                to="/material/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Material
              </NavLink>

            </div>
          )}
        </div>


        {/* ================= PRODUCT ================= */}
        <div className="mt-2">

          <button
            onClick={() => toggleMenu("product")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaBox />
              <span>Product</span>
            </div>

            {openMenus.product ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>

          {openMenus.product && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/product/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Product
              </NavLink>

              <NavLink
                to="/product/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Product
              </NavLink>

            </div>
          )}
        </div>


        {/* ================= COLORS ================= */}
        <div className="mt-2">

          <button
            onClick={() => toggleMenu("color")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaPalette />
              <span>Colors</span>
            </div>

            {openMenus.color ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>

          {openMenus.color && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/color/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Color
              </NavLink>

              <NavLink
                to="/color/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Color
              </NavLink>

            </div>
          )}
        </div>


        {/* ================= BRAND ================= */}
        <div className="mt-2">

          <button
            onClick={() => toggleMenu("brand")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaTrademark />
              <span>Brand</span>
            </div>

            {openMenus.brand ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>

          {openMenus.brand && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/brand/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Brand
              </NavLink>

              <NavLink
                to="/brand/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Brand
              </NavLink>

            </div>
          )}
        </div>


        {/* ================= TESTIMONIAL ================= */}
        <div className="mt-2">

          <button
            onClick={() => toggleMenu("testimonial")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaUsers />
              <span>Testimonials</span>
            </div>

            {openMenus.testimonial ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>

          {openMenus.testimonial && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/testimonial/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Testimonial
              </NavLink>

              <NavLink
                to="/testimonial/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Testimonial
              </NavLink>

            </div>
          )}
        </div>


        {/* ================= ACCORDION ================= */}
        <div className="mt-2">

          <button
            onClick={() => toggleMenu("accordion")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaStar />
              <span>Accordion</span>
            </div>

            {openMenus.accordion ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>

          {openMenus.accordion && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/accordion/add"
                className={subLinkClass}
              >
                <FaPlus size={12} />
                Add Accordion
              </NavLink>

              <NavLink
                to="/accordion/view"
                className={subLinkClass}
              >
                <FaEye size={12} />
                View Accordion
              </NavLink>

            </div>
          )}
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;