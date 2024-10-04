const router = require("express").Router();

const courseService = require("../services/courseService");

router.get("/catalog", courseService.getAllCourses);

module.exports = router;
