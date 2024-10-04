const router = require("express").Router();

const { usersOnly, ownerOnly } = require("../middleware/routerGuards");
const courseService = require("../services/courseService");

//Catalog
router.get("/catalog", courseService.getAllCourses);

//Create
router.get("/create", usersOnly, courseService.getCreatedCoursePage);
//Post create
router.post("/create", courseService.createCourse);

//Details
router.get("/details/:courseId", usersOnly, courseService.getDetailsPage);

//signUp
router.get("/signUp/:courseId", usersOnly, courseService.signUpForCourse);

//EDIT
router.get("/edit/:courseId", ownerOnly, courseService.getEditPage);

router.post("/edit/:courseId", courseService.editPage);

//DELETE
router.get("/delete/:courseId", ownerOnly, courseService.deleteCourse);

module.exports = router;
