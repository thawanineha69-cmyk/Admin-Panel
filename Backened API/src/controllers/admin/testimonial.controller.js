const { generateUniqueSlug } = require("../../config/slugGenerater");
const testimonialModel = require("../../models/testimonial")
var slugify = require('slugify')

exports.create = async (request, response) => {
    try {

        console.log("REQUEST BODY:", request.body);
        console.log("REQUEST FILE:", request.file);

        const dataSave = request.body;

        if (request.file) {
            dataSave.image = request.file.filename;
        }

        testimonialModel(dataSave)
            .save()
            .then((result) => {

                const data = {
                    _status: true,
                    _message: "Record Created !",
                    _error: "",
                    _data: result
                };

                response.send(data);
            })
            .catch((error) => {

                const errors = {};

                for (const i in error.errors) {
                    errors[i] = error.errors[i].message;
                }

                response.send({
                    _status: false,
                    _message: "Something went wrong !",
                    _error: errors,
                    _data: ""
                });
            });

    } catch (error) {

        response.send({
            _status: false,
            _message: "Something went wrong !",
            _error: error.message || error,
            _data: ""
        });
    }
};

exports.view = async (request, response) => {

    var limit = 15;
    var skip = 0;
    var page = 1;

    const andCondition = [
        {
            deleted_at: null,
        }
    ];

    const orCondition = [];

    var sort = { _id: 'desc' }

    if (request.body) {
        if (request.body.limit) {
            limit = request.body.limit;
        }

        if (request.body.page) {
            page = request.body.page;
        }

        skip = (page - 1) * limit;

        if (request.body.name) {
            var regex = new RegExp(request.body.name, 'i')
            andCondition.push({ name: regex })
        }

        if (request.body.code) {
            var regex = new RegExp(request.body.code, 'i')
            andCondition.push({ code: regex })
        }
    }

    var filter = { $and: andCondition }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    var totalRecords = await testimonialModel.find(filter).countDocuments();

    testimonialModel.find(filter)
        .select("name designation image description rating status order")
        .sort(sort)
        .limit(limit).skip(skip)
        .then((result) => {
            if (result.length > 0) {
                const data = {
                    _status: true,
                    _message: 'Record Fetched !',
                    _paginate: {
                        current_page: page,
                        total_pages: Math.ceil(totalRecords / limit),
                        total_records: totalRecords
                    },
                    _error: '',
                    _data: result
                }

                response.send(data)
            } else {
                const data = {
                    _status: false,
                    _message: 'No Record Found !',
                    _error: '',
                    _data: []
                }

                response.send(data)
            }
        })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong !',
                _error: error,
                _data: []
            }

            response.send(data)
        })
}

exports.details = async (request, response) => {
    testimonialModel.findOne({
        _id: request.params.id,
        deleted_at: null
    })
        .then((result) => {
            if (result) {
                const data = {
                    _status: true,
                    _message: 'Record Fetched !',
                    _error: '',
                    _data: result
                }

                response.send(data)
            } else {
                const data = {
                    _status: false,
                    _message: 'No Record Found !',
                    _error: '',
                    _data: ''
                }

                response.send(data)
            }
        })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong !',
                _error: error,
                _data: []
            }

            response.send(data)
        })
}

exports.update = async (request, response) => {
    try {

        const dataSave = request.body;

        // Agar new image upload hui hai
        if (request.file) {
            dataSave.image = request.file.filename;
        }

        dataSave.updated_at = Date.now();

        const getData = await testimonialModel.findOne({
            _id: request.params.id,
            deleted_at: null
        });

        if (!getData) {
            return response.send({
                _status: false,
                _message: 'Testimonial not found !',
                _error: '',
                _data: ''
            });
        }

        testimonialModel.findOneAndUpdate(
            {
                _id: request.params.id
            },
            dataSave,
            {
                returnDocument: 'after',
                runValidators: true
            }
        )
            .then((result) => {

                const data = {
                    _status: true,
                    _message: 'Record Updated !',
                    _error: '',
                    _data: result
                };

                response.send(data);

            })
            .catch((error) => {

                const errors = {};

                for (var i in error.errors) {
                    errors[i] = error.errors[i].message;
                }

                const data = {
                    _status: false,
                    _message: 'Something went wrong !',
                    _error: errors,
                    _data: ''
                };

                response.send(data);
            });

    } catch (error) {

        console.log("TESTIMONIAL UPDATE ERROR:", error);

        const data = {
            _status: false,
            _message: 'Something went wrong !',
            _error: error.message || error,
            _data: ''
        };

        response.send(data);
    }
};

exports.changeStatus = async (request, response) => {

    testimonialModel.updateMany(
        {
            _id: request.body.ids
        },
        [
            {
                $set: {
                    status: { $not: "$status" },
                    updated_at: Date.now()
                }
            }
        ],
        {
            updatePipeline: true
        }
    )
        .then((result) => {
            const data = {
                _status: true,
                _message: 'Change Status succussfully.',
                _data: result
            }
            response.send(data);
        })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong.',
                _data: null,
                _error: error
            }
            response.send(data);
        })
}

exports.destroy = async (request, response) => {
    testimonialModel.updateMany({
        _id: request.body.ids
    }, {
        $set: {
            deleted_at: Date.now()
        }
    })
        .then((result) => {
            const data = {
                _status: true,
                _message: 'Record Deleted !',
                _error: '',
                _data: result
            }

            response.send(data)
        })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong !',
                _error: error,
                _data: ''
            }

            response.send(data)
        })
}