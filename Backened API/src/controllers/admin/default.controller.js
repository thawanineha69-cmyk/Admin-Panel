const { generateUniqueSlug } = require("../../config/slugGenerater");
const defaultModel = require("../../models/Default");
var slugify = require('slugify')

exports.create = async(request, response) => {
    
    const dataSave = request.body;

    if(request.body.title){
        var slug = slugify(request.body.title, {
            lower: true,
            strict: true,
        })

        dataSave.slug = await generateUniqueSlug(defaultModel, slug);
    }

    defaultModel(dataSave).save()
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

        // var errors = [];
        // for(var i in error.errors){
        //     errors.push(error.errors[i].message)
        // }

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

}


exports.view = async(request, response) => {
    
    var limit = 15;
    var skip = 0;
    var page = 1;

    const addCondition = [
        {
            deleted_at : null, 
        }
    ];

    const orCondition = [];

    var sort = {
        order : 'asc',
        _id : 'desc'
    }

    if(request.body){
        if(request.body.sorting == 1){
            var sort = {
                title : 'asc'
            }
        } else if(request.body.sorting == 2){
            var sort = {
                title : 'desc'
            }
        } 

        if(request.body.limit){
            limit = request.body.limit;
        }

        if(request.body.page){
            page = request.body.page;
        }

        skip = (page - 1) * limit;

        if(request.body.title){
            var titleRegex = new RegExp(request.body.title, 'i')
            addCondition.push({ title : titleRegex })
        }

        if(request.body.order){
            addCondition.push({ order : request.body.order })
        }

    }

    var filter = { $and : addCondition }

    if(orCondition.length > 0){
        filter.$or = orCondition;
    }

    var totalRecords = await defaultModel.find(filter).countDocuments();

    defaultModel.find(filter)
    .select("title status order")
    .sort(sort)
    .limit(limit).skip(skip)
    .then((result) => {
        if(result.length > 0){
            const data = {
                _status : true,
                _message : 'Record Created !',
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
    // defaultModel.findOne({
    //     _id : request.params.id
    // })

    defaultModel.findById(request.params.id)
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
    const dataSave = request.body;
    dataSave.updated_at = Date.now()

    var getData = await defaultModel.findById(request.params.id);

    if(request.body.title && getData.title != request.body.title){
        var slug = slugify(request.body.title, {
            lower: true,
            strict: true,
        })

        dataSave.slug = await generateUniqueSlug(defaultModel, slug);
    }

    defaultModel.findByIdAndUpdate(
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
}

   exports.changeStatus = async(request, response) => {

    defaultModel.updateMany(
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


    exports.destroy = async (request, response) => {
        defaultModel.updateMany({
              _id : request.body.ids
        }, {
            $set: {
                deleted_at: Date.now()
            }
        })
            .then((result) => {

                const data = {
                    _status: true,
                    _message: ' Record Deleted!',
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