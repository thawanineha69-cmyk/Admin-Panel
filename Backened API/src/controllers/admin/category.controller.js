const { generateUniqueSlug } = require("../../config/slugGenerater");
const categoryModel = require("../../models/Category");
var slugify = require('slugify')

exports.create = async(request, response) => {
    
    try {
        const dataSave = request.body;

        if(request.file){
            dataSave.image = request.file.filename;
        }

        if(request.body.name){
            var slug = slugify(request.body.name, {
                lower: true,
                strict: true,
            })

            dataSave.slug = await generateUniqueSlug(categoryModel, slug);
        }

        categoryModel(dataSave).save()
        .then((result) => {
            const data = {
                _status : true,
                _message : 'Record Created !',
                _image_path : process.env.category_image_path,
                _error : '',
                _data : result
            }

            response.send(data)
        })
        .catch((error) => {
            var errors = {};
            for(var i in error.errors){
                errors[i] = error.errors[i].message;
            }

            const data = {
                _status : false,
                _message : 'Something went wrong !',
                _error : errors,
                _data : ''
            }

            response.send(data)
        })
    } catch (error) {
        const data = {
            _status : false,
            _message : 'Something went wrong !',
            _error : error,
            _data : ''
        }

        response.send(data)
    }
}

exports.view = async(request, response) => {
    
    var limit = 15;
    var skip = 0;
    var page = 1;

    const andCondition = [
        {
            deleted_at : null, 
        }
    ];

    const orCondition = [];

    var sort = { _id : 'desc'}

    if(request.body){
        if(request.body.limit){
            limit = request.body.limit;
        }

        if(request.body.page){
            page = request.body.page;
        }

        skip = (page - 1) * limit;

        if(request.body.name){
            var regex = new RegExp(request.body.name, 'i')
            andCondition.push({ name : regex })
        }
    }

    var filter = { $and : andCondition }

    if(orCondition.length > 0){
        filter.$or = orCondition;
    }

    var totalRecords = await categoryModel.find(filter).countDocuments();

    categoryModel.find(filter)
    .select("name image status order")
    .sort(sort)
    .limit(limit).skip(skip)
    .then((result) => {
        if(result.length > 0){
            const data = {
                _status : true,
                _message : 'Record Fetched !',
                _image_path : process.env.category_image_path,
                _paginate : {
                    current_page : page,
                    total_pages : Math.ceil(totalRecords/limit),
                    total_records : totalRecords
                },
                _error : '',
                _data : result
            }

            response.send(data)
        } else {
            const data = {
                _status : false,
                _message : 'No Record Found !',
                _error : '',
                _data : []
            }

            response.send(data)
        }
    })
    .catch((error) => {
        const data = {
            _status : false,
            _message : 'Something went wrong !',
            _error : error,
            _data : []
        }

        response.send(data)
    })
}

exports.details = async(request, response) => {
    categoryModel.findOne({
        _id : request.params.id,
        deleted_at : null
    })
    .then((result) => {
        if(result){
            const data = {
                _status : true,
                _message : 'Record Fetched !',
                _image_path : process.env.category_image_path,
                _error : '',
                _data : result
            }

            response.send(data)
        } else {
            const data = {
                _status : false,
                _message : 'No Record Found !',
                _error : '',
                _data : ''
            }

            response.send(data)
        }
    })
    .catch((error) => {
        const data = {
            _status : false,
            _message : 'Something went wrong !',
            _error : error,
            _data : []
        }

        response.send(data)
    })
}

exports.update = async(request, response) => {
    try {
        const dataSave = request.body;
        dataSave.updated_at = Date.now()

        if(request.file){
            dataSave.image = request.file.filename;
        }

        var getData = await categoryModel.findById(request.params.id);

        if(request.body.name && getData.name != request.body.name){
            var slug = slugify(request.body.name, {
                lower: true,
                strict: true,
            })

            dataSave.slug = await generateUniqueSlug(categoryModel, slug);
        }

        categoryModel.findByIdAndUpdate(
            request.params.id,
            dataSave,
            { new: true, runValidators: true }
        )
        .then((result) => {
            const data = {
                _status : true,
                _message : 'Record Updated !',
                _error : '',
                _data : result
            }

            response.send(data)
        })
        .catch((error) => {

            var errors = {};
            for(var i in error.errors){
                errors[i] = error.errors[i].message;
            }

            const data = {
                _status : false,
                _message : 'Something went wrong !',
                _error : errors,
                _data : ''
            }

            response.send(data)
        })
    } catch (error) {
        const data = {
            _status : false,
            _message : 'Something went wrong !',
            _error : error,
            _data : ''
        }

        response.send(data)
    }
}

exports.changeStatus = async(request, response) => {

    categoryModel.updateMany(
        {
            _id : request.body.ids
        },
        [
            {
                $set : {
                    status : { $not: "$status" },
                    updated_at : Date.now()
                }
            }
        ],
        {
            updatePipeline: true
        }
    )
    .then((result) => {
        const data = {
            _status : true,
            _message : 'Change Status succussfully.',
            _data : result
        }
        response.send(data);
    })
    .catch((error) => {
        const data = {
            _status : false,
            _message : 'Something went wrong.',
            _data : null,
            _error : error
        }
        response.send(data);
    })
}

exports.destroy = async(request, response) => {
    categoryModel.updateMany({
        _id : request.body.ids
    }, {
        $set : {
            deleted_at : Date.now()
        }
    })    
    .then((result) => {
        const data = {
            _status : true,
            _message : 'Record Deleted !',
            _error : '',
            _data : result
        }

        response.send(data)
    })
    .catch((error) => {
        const data = {
            _status : false,
            _message : 'Something went wrong !',
            _error : error,
            _data : ''
        }

        response.send(data)
    })
}