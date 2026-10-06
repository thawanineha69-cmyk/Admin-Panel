const express = require('express');
const { create, view, update, details, changeStatus, destroy } = require('../../controllers/admin/category.controller');
const multer  = require('multer')
var upload = multer({ dest: 'uploads/categories' })
var path = require('path');

const route = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categories')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const imageExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix+imageExtension)
  }
})

var upload = multer({ storage: storage })

module.exports = server  => {

    route.post('/create', upload.single('image'), create)

    route.post('/view', upload.none(), view)

    route.put('/update/:id', upload.single('image'), update)

    route.post('/details/:id', upload.none(), details)

    route.put('/change-status', upload.none(), changeStatus)

    route.put('/delete', upload.none(), destroy)

    server.use('/api/admin/categories', route);
}