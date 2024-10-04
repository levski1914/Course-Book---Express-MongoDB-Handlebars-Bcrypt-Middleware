const router = require("express").Router();
const { isAuth } = require("../middleware/authMiddleware");
const { getRecentCourses } = require("../services/courseService");
router.get("/", async (req, res) => {
  const courses = await getRecentCourses();
  res.render("home", { courses });
});

router.get("/authorize-test", isAuth, (req, res) => {
  res.send("You are authorized");
});
module.exports = router;
