const express = require('express');
const { create, view, update, details, changeStatus, destroy } = require('../../controllers/admin/material.controller');

const route = express.Router();

module.exports = server => {

    route.post('/create', create)

    route.post('/view', view)

    route.put('/update/:id', update)

    route.get('/details/:id', details)

    route.put('/change-status', changeStatus)

    route.delete('/delete', destroy)

    server.use('/api/admin/materials', route);
}