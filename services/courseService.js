const Course = require("../models/Course");

exports.getCreatedCoursesPage = (req, res) => {
  res.render("create");
};

//course create
exports.createRecipe = async (req, res) => {
  const { title, type, certificate, image, description, price } = req.body;

  if (title.length < 2) {
    return res
      .status(400)
      .render("create", { error: "Title length minimum 2 symbols" });
  }

  if (type.length < 3) {
    return res
      .status(400)
      .render("create", { error: "Type length minimum 3 symbols" });
  }

  if (certificate.length < 2) {
    return res
      .status(400)
      .render("create", { error: "Certificate length minimum 2 symbols" });
  }

  if (!image.startsWith("http://" && !image.startsWith("https://"))) {
    return res
      .status(400)
      .render("create", { error: "Url must be http:// or https://" });
  }

  if (description.length < 10) {
    return res
      .status(400)
      .render("create", { error: "Description length minimum 10 symbols" });
  }
  if (price.length < 0) {
    return res
      .status(400)
      .render("create", { error: "Price length must be positive number" });
  }

  try {
    const newCourse = new Course({
      title,
      type,
      certificate,
      image,
      description,
      price,
      owner: req.user._id,
    });
    await newCourse.save();
    res.redirect("/courses");
  } catch (err) {
    res.status(500).render("create", { error: err.message });
  }
};

//get 3 recent created courses
exports.getRecentCourses = async (req, res) => {
  return Course.find().sort({ $natural: -1 }).limit(3).lean();
};

//get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().lean();
    res.render("catalog", { courses });
  } catch (err) {
    res.status(500).render("catalog", { error: err.message });
  }
};

//Get details of courses
exports.getCourseDetails = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId).lean();

    if (!course) {
      return res.status(404).render("details", { error: "Course not found" });
    }

    let isOwner = false;
    let hasSignedUp = false;
    if (req.use) {
      isOwner = course.owner.equals(req.user._id);

      hasSignedUp = Boolean(
        course.signUpList.find((l) => req.use?._id == l.toString())
      );
    }

    res.render("details", {
      course,
      isOwner,
      hasStudent: !!req.user,
      hasSignedUp,
    });
  } catch (err) {
    res.status(500).render("details", { error: err.message });
  }
};

//get edit page
exports.getEditCoursePage = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId).lean();

    if (!course) {
      return res.status(404).render("edit", { error: "Course not found" });
    }

    const isOwner = course.owner.equals(req.user._id);

    res.render("edit", { recipe, isOwner });
  } catch (err) {
    res.status(500).render("edit", { error: err.message });
  }
};

// edit details of course

exports.editPage = async (req, res) => {
  const { title, type, certificate, image, description, price } = req.body;

  const courseId = req.params.courseId;
  if (title.length < 2) {
    return res
      .status(400)
      .render("create", { error: "Title length minimum 2 symbols" });
  }

  if (type.length < 3) {
    return res
      .status(400)
      .render("create", { error: "Type length minimum 3 symbols" });
  }

  if (certificate.length < 2) {
    return res
      .status(400)
      .render("create", { error: "Certificate length minimum 2 symbols" });
  }

  if (!image.startsWith("http://" && !image.startsWith("https://"))) {
    return res
      .status(400)
      .render("create", { error: "Url must be http:// or https://" });
  }

  if (description.length < 10) {
    return res
      .status(400)
      .render("create", { error: "Description length minimum 10 symbols" });
  }
  if (price.length < 0) {
    return res
      .status(400)
      .render("create", { error: "Price length must be positive number" });
  }

  try {
    await Course.findIdAndUpdate(courseId, {
      title,
      type,
      certificate,
      image,
      description,
      price,
    });

    res.redirect(`/courses/details/${courseId}`);
  } catch (err) {
    res.status(500).render("edit", { error: err.message });
  }
};

//Delete course
exports.deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    await Course.findByIdAndDelete(courseId);
    res.redirect("/");
  } catch (err) {
    res.status(500).render("details", { error: err.message });
  }
};
