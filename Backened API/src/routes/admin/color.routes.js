const express = require('express');
const {  create ,view, update, details, changeStatus, destroy } = require('../../controllers/admin/color.controller');

const route = express.Router();

module.exports = server =>  {

   route.post('/create', create)

    route.post('/view', view)

    route.put('/update/:id',update)

    route.post('/details/:id', details)

    route.put('/change-status', changeStatus)

    route.delete('/delete', destroy)

    server.use('/api/admin/colors', route);
}