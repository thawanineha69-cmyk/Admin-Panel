const { generateUniqueSlug } = require("../../config/slugGenerater");
const accordionModel = require("../../models/accordian");
var slugify = require('slugify')

const create = async (request, response) => {
  try {
    const { question, answer, order } = request.body;

    const accordion = new accordionModel({
      question: question,
      answer: answer,
      image: request.file ? request.file.path : "",
      status: true,
      order: order || 0,
    });

    const result = await accordion.save();

    if (result) {
      return response.send({
        _status: true,
        _message: "Record Created !",
        _data: result,
        _error: "",
      });
    }

    return response.send({
      _status: false,
      _message: "Something went wrong !",
      _data: "",
      _error: "",
    });
  } catch (error) {
    return response.send({
      _status: false,
      _message: "Something went wrong !",
      _data: "",
      _error: error.message,
    });
  }
};


// ================= VIEW =================
const view = async (request, response) => {
  try {
    const data = await accordionModel.find({
      deleted_at: null,
    }).sort({ order: 1 });

    return response.send({
      _status: true,
      _message: "Record Fetched !",
      _data: data,
      _paginate: {
        current_page: 1,
        total_pages: 1,
        total_records: data.length,
      },
      _error: "",
    });
  } catch (error) {
    return response.send({
      _status: false,
      _message: "Something went wrong !",
      _data: "",
      _error: error.message,
    });
  }
};


// ================= DETAILS =================
const details = async (request, response) => {
  try {
    const data = await accordionModel.findOne({
      _id: request.params.id,
      deleted_at: null,
    });

    if (data) {
      return response.send({
        _status: true,
        _message: "Record Fetched !",
        _data: data,
        _error: "",
      });
    }

    return response.send({
      _status: false,
      _message: "Record Not Found !",
      _data: "",
      _error: "",
    });
  } catch (error) {
    return response.send({
      _status: false,
      _message: "Something went wrong !",
      _data: "",
      _error: error.message,
    });
  }
};


// ================= UPDATE =================
const update = async (request, response) => {
  try {
    const { question, answer, order } = request.body;

    const updateData = {
      question: question,
      answer: answer,
      order: order || 0,
      updatedAt: new Date(),
    };

    if (request.file) {
      updateData.image = request.file.path;
    }

    const result = await accordionModel.findOneAndUpdate(
      {
        _id: request.params.id,
        deleted_at: null,
      },
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
      }
    );

    if (result) {
      return response.send({
        _status: true,
        _message: "Record Updated !",
        _data: result,
        _error: "",
      });
    }

    return response.send({
      _status: false,
      _message: "Record Not Found !",
      _data: "",
      _error: "",
    });
  } catch (error) {
    return response.send({
      _status: false,
      _message: "Something went wrong !",
      _data: "",
      _error: error.message,
    });
  }
};


// ================= CHANGE STATUS =================
const changeStatus = async (request, response) => {
  try {
    const { id, status } = request.body;

    const result = await accordionModel.findOneAndUpdate(
      {
        _id: id,
        deleted_at: null,
      },
      {
        $set: {
          status: status,
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (result) {
      return response.send({
        _status: true,
        _message: "Status Updated !",
        _data: result,
        _error: "",
      });
    }

    return response.send({
      _status: false,
      _message: "Record Not Found !",
      _data: "",
      _error: "",
    });
  } catch (error) {
    return response.send({
      _status: false,
      _message: "Something went wrong !",
      _data: "",
      _error: error.message,
    });
  }
};


// ================= DELETE =================
const destroy = async (request, response) => {
  try {
    const { ids } = request.body;

    const result = await accordionModel.findOneAndUpdate(
      {
        _id: ids,
        deleted_at: null,
      },
      {
        $set: {
          deleted_at: new Date(),
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (result) {
      return response.send({
        _status: true,
        _message: "Record Deleted !",
        _data: result,
        _error: "",
      });
    }

    return response.send({
      _status: false,
      _message: "Record Not Found !",
      _data: "",
      _error: "",
    });
  } catch (error) {
    return response.send({
      _status: false,
      _message: "Something went wrong !",
      _data: "",
      _error: error.message,
    });
  }
};

module.exports = {
  create,
  view,
  details,
  update,
  changeStatus,
  destroy,
};
