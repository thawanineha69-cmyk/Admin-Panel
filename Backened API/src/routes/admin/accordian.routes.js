const express = require("express");

const {  create ,view, update, details, changeStatus, destroy } = require('../../controllers/admin/accordian.controller');

const route = express.Router();

// Create
route.post("/create", create);

// View
route.post("/view", view);

// Details
route.post("/details/:id", details);

// Update
route.put("/update/:id", update);

// Change Status
route.put("/change-status", changeStatus);

// Delete
route.delete("/delete", destroy);

module.exports = (server) => {
  server.use("/api/admin/accordions", route);
};