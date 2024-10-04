module.exports = {
  usersOnly: (req, res, next) => {
    if (!req.user) {
      return res.redirect("/auth/login");
    }
    next();
  },

  guestsOnly: (req, res, next) => {
    if (req.user) {
      return res.redirect("/");
    }
    next();
  },

  ownerOnly: async (req, res, next) => {
    const Courses = require("../models/Courses");

    try {
      const course = await Courses.findById(req.params.courseId);

      if (!course) {
        return res.redirect("/");
      }

      if (!req.user) {
        return res.redirect("/auth/login");
      }

      if (course.owner.equals(req.user._id)) {
        next();
      } else {
        return res.redirect("/");
      }
    } catch (err) {
      return res.status(500).send(`Server error: ${err.message}`);
    }
  },
};
