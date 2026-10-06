const { generateUniqueSlug } = require("../../config/slugGenerater");
const materialModel = require("../../models/Material");
var slugify = require('slugify')

exports.create = async(request, response) => {
    
    try {
        const dataSave = request.body;

        if(request.body.name){
            var slug = slugify(request.body.name, {
                lower: true,
                strict: true,
            })

            dataSave.slug = await generateUniqueSlug(materialModel, slug);
        }

        new materialModel(dataSave).save()
        .then((result) => {
            const data = {
                _status : true,
                _message : 'Record Created !',
                _error : '',
                _data : result
            }

            response.send(data)
        })
        .catch((error) => {
            var errors = {};
            if(error.errors){
                for(var i in error.errors){
                    errors[i] = error.errors[i].message;
                }
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

    var totalRecords = await materialModel.find(filter).countDocuments();

    materialModel.find(filter)
    .select("name status order")
    .sort(sort)
    .limit(limit).skip(skip)
    .then((result) => {
        if(result.length > 0){
            const data = {
                _status : true,
                _message : 'Record Fetched !',
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
    materialModel.findOne({
        _id : request.params.id,
        deleted_at : null
    })
    .then((result) => {
        if(result){
            const data = {
                _status : true,
                _message : 'Record Fetched !',
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

        var getData = await materialModel.findById(request.params.id);

        if(request.body.name && getData.name != request.body.name){
            var slug = slugify(request.body.name, {
                lower: true,
                strict: true,
            })

            dataSave.slug = await generateUniqueSlug(materialModel, slug);
        }

        materialModel.findByIdAndUpdate(
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

exports.changeStatus = async (request, response) => {
    try {

        const { ids } = request.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response.send({
                _status: false,
                _message: "Please provide valid ids.",
                _data: null
            });
        }

        const materials = await materialModel.find({
            _id: { $in: ids }
        });

        for (const material of materials) {

            material.status = !material.status;
            material.updated_at = new Date();

            await material.save();
        }

        return response.send({
            _status: true,
            _message: "Status changed successfully.",
            _data: materials
        });

    } catch (error) {

        console.log(error);

        return response.send({
            _status: false,
            _message: "Something went wrong.",
            _data: null,
            _error: error.message
        });
    }
};
exports.destroy = async(request, response) => {
    materialModel.updateMany({
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