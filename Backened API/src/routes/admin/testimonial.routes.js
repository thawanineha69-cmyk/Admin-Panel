const express = require("express");
const multer = require("multer");

const {
    create,
    view,
    update,
    details,
    changeStatus,
    destroy
} = require("../../controllers/admin/testimonial.controller");

const route = express.Router();

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, "uploads/testimonials/");
    },

    filename: function (request, file, cb) {
        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage
});

route.post("/create", upload.single("image"), create);

route.post("/view", view);

route.post("/details/:id", details);

route.put("/update/:id", upload.single("image"), update);

route.put("/change-status", changeStatus);

route.delete("/delete", destroy);

module.exports = server => {
    server.use("/api/admin/testimonials", route);
};