const slugify = require("slugify");

const { generateUniqueSlug } = require("../../config/slugGenerater");

const productModel = require("../../models/product");
const categoryModel = require("../../models/Category");
const subCategoryModel = require("../../models/SubCategory");
const subSubCategoryModel = require("../../models/SubSubCategory");
const colorModel = require("../../models/color");
const materialModel = require("../../models/Material");


// =====================================================
// PARENT CATEGORIES
// =====================================================

const viewParentCategories = async (request, response) => {
  try {
    const filter = {
      deleted_at: null,
      status: true,
    };

    if (request.body.id) {
      filter._id = request.body.id;
    }

    const result = await categoryModel
      .find(filter)
      .select("_id name");

    response.send({
      _status: true,
      _message: "Parent Categories Fetched !",
      _error: "",
      _data: result,
    });

  } catch (error) {
    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _data: [],
    });
  }
};


// =====================================================
// SUB CATEGORIES
// =====================================================

const viewSubCategories = async (request, response) => {
  try {
    const filter = {
      deleted_at: null,
      status: true,
    };

    if (request.body.parent_category_id) {
      filter.parent_category_id = request.body.parent_category_id;
    }

    const result = await subCategoryModel
      .find(filter)
      .select("_id name parent_category_id");

    response.send({
      _status: true,
      _message: "Sub Categories Fetched !",
      _error: "",
      _data: result,
    });

  } catch (error) {
    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _data: [],
    });
  }
};


// =====================================================
// SUB SUB CATEGORIES
// =====================================================

const viewSubSubCategories = async (request, response) => {
  try {
    const filter = {
      deleted_at: null,
      status: true,
    };

    if (request.body.sub_category_id) {
      filter.sub_category_id = request.body.sub_category_id;
    }

    if (request.body.parent_category_id) {
      filter.parent_category_id = request.body.parent_category_id;
    }

    const result = await subSubCategoryModel
      .find(filter)
      .select("_id name parent_category_id sub_category_id");

    response.send({
      _status: true,
      _message: "Sub Sub Categories Fetched !",
      _error: "",
      _data: result,
    });

  } catch (error) {
    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _data: [],
    });
  }
};


// =====================================================
// COLORS
// =====================================================

const viewColors = async (request, response) => {
  try {
    const result = await colorModel
      .find({
        deleted_at: null,
        status: true,
      })
      .select("_id name code");

    response.send({
      _status: true,
      _message: "Colors Fetched !",
      _error: "",
      _data: result,
    });

  } catch (error) {
    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _data: [],
    });
  }
};


// =====================================================
// MATERIALS
// =====================================================

const viewMaterials = async (request, response) => {
  try {
    const result = await materialModel
      .find({
        deleted_at: null,
        status: true,
      })
      .select("_id name");

    response.send({
      _status: true,
      _message: "Materials Fetched !",
      _error: "",
      _data: result,
    });

  } catch (error) {
    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _data: [],
    });
  }
};


// =====================================================
// CREATE PRODUCT
// =====================================================

const create = async (request, response) => {
  try {

    const dataSave = request.body;

    // Image
    if (request.file) {
      dataSave.image = request.file.filename;
    }

    // Slug
    if (dataSave.name) {
      const slug = slugify(dataSave.name, {
        lower: true,
        strict: true,
      });

      dataSave.slug = await generateUniqueSlug(
        productModel,
        slug
      );
    }

    // Convert boolean values
    if (dataSave.status !== undefined) {
      dataSave.status =
        dataSave.status === true ||
        dataSave.status === "true" ||
        dataSave.status === "1";
    }

    if (dataSave.is_featured !== undefined) {
      dataSave.is_featured =
        dataSave.is_featured === true ||
        dataSave.is_featured === "true" ||
        dataSave.is_featured === "1";
    }

    // Convert prices and stock
    if (dataSave.actual_price !== undefined) {
      dataSave.actual_price = Number(dataSave.actual_price);
    }

    if (dataSave.sale_price !== undefined) {
      dataSave.sale_price = Number(dataSave.sale_price);
    }

    if (dataSave.stock !== undefined) {
      dataSave.stock = Number(dataSave.stock);
    }

    // Convert color_ids
    if (typeof dataSave.color_ids === "string") {
      try {
        dataSave.color_ids = JSON.parse(dataSave.color_ids);
      } catch {
        dataSave.color_ids = dataSave.color_ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }
    }

    // Convert material_ids
    if (typeof dataSave.material_ids === "string") {
      try {
        dataSave.material_ids = JSON.parse(dataSave.material_ids);
      } catch {
        dataSave.material_ids = dataSave.material_ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }
    }

    const result = await productModel.create(dataSave);

    response.send({
      _status: true,
      _message: "Record Created !",
      _error: "",
      _image_path: process.env.product_image_path || "uploads/products/",
      _data: result,
    });

  } catch (error) {

    const errorMessages = {};

    if (error.errors) {
      Object.keys(error.errors).forEach((field) => {
        errorMessages[field] = error.errors[field].message;
      });
    }

    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: errorMessages,
      _data: [],
    });
  }
};


// =====================================================
// VIEW PRODUCTS
// =====================================================

const view = async (request, response) => {
  try {

    const limit = Number(request.body.limit) || 15;
    const page = Number(request.body.page) || 1;

    const skip = (page - 1) * limit;

    const filter = {
      deleted_at: null,
    };

    // Search
    if (request.body.name) {
      filter.name = {
        $regex: request.body.name,
        $options: "i",
      };
    }

    // Category filter
    if (request.body.parent_category_id) {
      filter.parent_category_id =
        request.body.parent_category_id;
    }

    // Sub Category filter
    if (request.body.sub_category_id) {
      filter.sub_category_id =
        request.body.sub_category_id;
    }

    // Sub Sub Category filter
    if (request.body.sub_sub_category_id) {
      filter.sub_sub_category_id =
        request.body.sub_sub_category_id;
    }

    const totalRecords = await productModel.countDocuments(filter);

    const result = await productModel
      .find(filter)
      .select(
        "name slug image parent_category_id sub_category_id sub_sub_category_id color_ids material_ids actual_price sale_price stock description is_featured status order"
      )
      .populate("parent_category_id", "name")
      .populate("sub_category_id", "name")
      .populate("sub_sub_category_id", "name")
      .populate("color_ids", "name code")
      .populate("material_ids", "name")
      .sort({ order: 1, _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalRecords / limit);

    response.send({
      _status: true,
      _message: "Record Fetched !",
      _error: "",
      _paginate: {
        current_page: page,
        total_pages: totalPages,
        total_records: totalRecords,
      },
      _image_path:
        process.env.product_image_path ||
        "uploads/products/",
      _data: result,
    });

  } catch (error) {

    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _paginate: {
        current_page: 1,
        total_pages: 0,
        total_records: 0,
      },
      _data: [],
    });
  }
};


// =====================================================
// DETAILS
// =====================================================

const details = async (request, response) => {
  try {

    const result = await productModel
      .findOne({
        _id: request.params.id,
        deleted_at: null,
      })
      .populate("parent_category_id", "name")
      .populate("sub_category_id", "name")
      .populate("sub_sub_category_id", "name")
      .populate("color_ids", "name code")
      .populate("material_ids", "name");

    if (!result) {
      return response.send({
        _status: false,
        _message: "Record not found !",
        _error: "",
        _data: [],
      });
    }

    response.send({
      _status: true,
      _message: "Record Fetched !",
      _error: "",
      _image_path:
        process.env.product_image_path ||
        "uploads/products/",
      _data: result,
    });

  } catch (error) {

    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _data: [],
    });
  }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

const update = async (request, response) => {
  try {

    const id = request.params.id;
    const dataSave = request.body;

    dataSave.updated_at = Date.now();

    // Image
    if (request.file) {
      dataSave.image = request.file.filename;
    }

    // Find existing product
    const existingProduct = await productModel.findOne({
      _id: id,
      deleted_at: null,
    });

    if (!existingProduct) {
      return response.send({
        _status: false,
        _message: "Record not found !",
        _error: "",
        _data: [],
      });
    }

    // Generate slug if name changed
    if (
      dataSave.name &&
      dataSave.name !== existingProduct.name
    ) {
      const slug = slugify(dataSave.name, {
        lower: true,
        strict: true,
      });

      dataSave.slug = await generateUniqueSlug(
        productModel,
        slug,
        id
      );
    }

    // Boolean
    if (dataSave.status !== undefined) {
      dataSave.status =
        dataSave.status === true ||
        dataSave.status === "true" ||
        dataSave.status === "1";
    }

    if (dataSave.is_featured !== undefined) {
      dataSave.is_featured =
        dataSave.is_featured === true ||
        dataSave.is_featured === "true" ||
        dataSave.is_featured === "1";
    }

    // Numbers
    if (dataSave.actual_price !== undefined) {
      dataSave.actual_price = Number(dataSave.actual_price);
    }

    if (dataSave.sale_price !== undefined) {
      dataSave.sale_price = Number(dataSave.sale_price);
    }

    if (dataSave.stock !== undefined) {
      dataSave.stock = Number(dataSave.stock);
    }

    // Arrays
    if (typeof dataSave.color_ids === "string") {
      try {
        dataSave.color_ids = JSON.parse(dataSave.color_ids);
      } catch {
        dataSave.color_ids = dataSave.color_ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }
    }

    if (typeof dataSave.material_ids === "string") {
      try {
        dataSave.material_ids = JSON.parse(dataSave.material_ids);
      } catch {
        dataSave.material_ids = dataSave.material_ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }
    }

    const result = await productModel.findByIdAndUpdate(
      id,
      dataSave,
      {
        new: true,
        runValidators: true,
      }
    );

    response.send({
      _status: true,
      _message: "Record Updated !",
      _error: "",
      _image_path:
        process.env.product_image_path ||
        "uploads/products/",
      _data: result,
    });

  } catch (error) {

    const errorMessages = {};

    if (error.errors) {
      Object.keys(error.errors).forEach((field) => {
        errorMessages[field] = error.errors[field].message;
      });
    }

    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: errorMessages,
      _data: [],
    });
  }
};


// =====================================================
// CHANGE STATUS
// =====================================================

const changeStatus = async (request, response) => {
  try {

    const ids = request.body.ids;

    const result = await productModel.updateMany(
      {
        _id: request.body.ids,
      },
      [
        {
          $set: {
            status: {
              $not: ["$status"],
            },
            updated_at: Date.now(),
          },
        },
      ],
      {
        updatePipeline: true,
      }
    );

    response.send({
      _status: true,
      _message: "Status Changed !",
      _error: "",
      _data: result,
    });

  } catch (error) {

    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _data: [],
    });
  }
};


// =====================================================
// DELETE PRODUCT - SOFT DELETE
// =====================================================

const destroy = async (request, response) => {
  try {

    const ids = request.body.ids;

    const result = await productModel.updateMany(
      {
        _id: ids,
        deleted_at: null,
      },
      {
        $set: {
          deleted_at: Date.now(),
        },
      }
    );

    response.send({
      _status: true,
      _message: "Record Deleted !",
      _error: "",
      _data: result,
    });

  } catch (error) {

    response.send({
      _status: false,
      _message: "Something went wrong !",
      _error: error.message,
      _data: [],
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
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
};