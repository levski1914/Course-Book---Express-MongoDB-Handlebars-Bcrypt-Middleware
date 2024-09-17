const router = require("express").Router();
const { isAuth } = require("../middleware/authMiddleware");
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/authorize-test", isAuth, (req, res) => {
  console.log(req.user);
  res.send("You are authorized");
});
module.exports = router;
