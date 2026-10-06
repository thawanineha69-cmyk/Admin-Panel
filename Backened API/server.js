const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// To Make Executable
const server = express();

server.use(bodyParser.json());

server.use(cors());

// Images / uploads
server.use("/uploads", express.static(path.join(__dirname, "uploads")));

// parse requests of content-type - application/json
server.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: true }));

server.get("/", (request, response) => {
  response.send("Server is working fine !");
});

// Connect to Database
mongoose.connect('mongodb://127.0.0.1:27017/offline_mongoose')
    .then(() => console.log('Database Connected!'))
    .catch((error) => {
        console.log('Database Error - ', error)
    });

// Admin APIS
require('./src/routes/admin/default.routes.js')(server);
require('./src/routes/admin/material.routes.js')(server);
require('./src/routes/admin/color.routes.js')(server);
require('./src/routes/admin/brand.routes.js')(server);
require('./src/routes/admin/testimonial.routes.js')(server);
require('./src/routes/admin/accordian.routes.js')(server);
require('./src/routes/admin/category.routes.js')(server);
require('./src/routes/admin/subCategory.routes.js')(server);
require('./src/routes/admin/subsubCategeory.routes.js')(server);
require('./src/routes/admin/product.routes.js')(server);


// Start Server
server.listen(8000, () => {
    console.log('Server is running on port 8000');
})
