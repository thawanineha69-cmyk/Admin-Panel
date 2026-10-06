const express = require("express");
const multer = require("multer");

const {
  viewParentCategories,
  viewSubCategories,
  viewSubSubCategories,
  viewColors,
  viewMaterials,
  create,
  view,
  details,
  update,
  changeStatus,
  destroy,
} = require("../../controllers/admin/product.controller");

const route = express.Router();


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "uploads/products");
  },

  filename: function (request, file, cb) {
    cb(
      null,
      "product-" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({
  storage: storage,
});


// =====================================================
// DROPDOWN APIs
// =====================================================

// Parent Categories
route.post(
  "/parent-categories",
  upload.none(),
  viewParentCategories
);


// Sub Categories
route.post(
  "/sub-categories",
  upload.none(),
  viewSubCategories
);


// Sub Sub Categories
route.post(
  "/sub-sub-categories",
  upload.none(),
  viewSubSubCategories
);


// Colors
route.post(
  "/colors",
  upload.none(),
  viewColors
);


// Materials
route.post(
  "/materials",
  upload.none(),
  viewMaterials
);


// =====================================================
// PRODUCT CRUD
// =====================================================

// Create Product
route.post(
  "/create",
  upload.single("image"),
  create
);


// View Products
route.post(
  "/view",
  upload.none(),
  view
);


// Product Details
route.post(
  "/details/:id",
  upload.none(),
  details
);


// Update Product
route.put(
  "/update/:id",
  upload.single("image"),
  update
);


// Change Status
route.put(
  "/change-status",
  upload.none(),
  changeStatus
);


// Delete Product
route.put(
  "/delete",
  upload.none(),
  destroy
);


module.exports = (server) => {
  server.use("/api/admin/products", route);
};