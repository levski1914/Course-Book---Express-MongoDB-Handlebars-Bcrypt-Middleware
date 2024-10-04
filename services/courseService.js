const Courses = require("../models/Courses");

//+++++++++++++++++++++++++

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.find().lean();
    res.render("catalog", { courses });
  } catch (err) {
    res.status(500).render("catalog", { error: err.message });
  }
};

exports.getRecentCourses = async (req, res) => {
  return Courses.find().sort({ $natural: -1 }).limit(3).lean();
};

//+++++++++++++++++++++++++

// CREATE

//+++++++++++++++++++++++++
exports.getCreatedCoursePage = (req, res) => {
  res.render("create");
};

exports.createCourse = async (req, res) => {
  const { title, certificate, type, image, description, price } = req.body;

  if (title.length < 5) {
    return res
      .status(400)
      .render("create", { error: "title must be 5 characters" });
  }
  if (!image.startsWith("http://") && !image.startsWith("https://")) {
    return res.status(400).render("create", {
      error: "image must starts with http:// or https://",
    });
  }
  if (description.length < 10) {
    return res.status(400).render("create", {
      error: "description must be minimum 10 characters long",
    });
  }
  if (type.length < 3) {
    return res
      .status(400)
      .render("create", { error: "type must be minimum 3 characters long" });
  }
  if (certificate.length < 2) {
    return res
      .status(400)
      .render("create", { error: "must be minimum 2 characters long" });
  }
  if (price.length < 0) {
    return res
      .status(400)
      .render("create", { error: "price must be positive number" });
  }

  try {
    const newCourse = new Courses({
      title,
      type,
      certificate,
      image,
      description,
      price,
      owner: req.user._id,
    });

    await newCourse.save();
    res.redirect("/");
  } catch (err) {
    res.status(400).render("create", { error: err.message });
  }
};

//++++++++++++++++++++++++++

// DETAILS

//++++++++++++++++++++++++++

exports.getDetailsPage = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await Courses.findById(courseId)
      .populate("owner")
      .populate("signUpList")
      .lean();

    if (!course) {
      return res.status(404).render("details", { error: "Course not found" });
    }

    const isOwner =
      req.user && req.user._id.toString() === course.owner._id.toString();
    const hasSignedUp = course.signUpList.some(
      (user) => user._id.toString() === req.user._id.toString()
    );
    res.render("details", { course, isOwner, hasSignedUp });
  } catch (err) {
    res.status(500).render("details", { error: err.message });
  }
};

exports.signUpForCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await Courses.findById(courseId);

    if (!course) {
      req.flash("error", "Course not found");
      return res.redirect(`/courses/details/${courseId}`);
    }

    // Проверка дали собственикът се опитва да се запише на собствения си курс
    if (course.owner.toString() === req.user._id.toString()) {
      req.flash("error", "You cannot sign up for your own course");
      return res.redirect(`/courses/details/${courseId}`);
    }

    // Проверка дали потребителят вече се е записал за този курс
    if (course.signUpList.includes(req.user._id)) {
      req.flash("error", "You are already signed up for this course");
      return res.redirect(`/courses/details/${courseId}`);
    }

    // Добавяне на потребителя към списъка със записани
    course.signUpList.push(req.user._id);
    await course.save();

    req.flash("success", "You have successfully signed up for the course");
    res.redirect(`/courses/details/${courseId}`);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/courses/details/${courseId}`);
  }
};

//++++++++++++++++++++++++++++++++++++++++

//EDIT

//++++++++++++++++++++++++++++++++++++++++

exports.getEditPage = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await Courses.findById(courseId).lean();

    if (!course) {
      return res.status(404).render("edit", { error: "Course not found" });
    }

    const isOwner =
      req.user && req.user._id.toString() === course.owner._id.toString();
    res.render("edit", { course, isOwner });
  } catch (err) {
    res.status(500).render("edit", { error: err.message });
  }
};

exports.editPage = async (req, res) => {
  const { title, certificate, type, image, description, price } = req.body;
  const courseId = req.params.courseId;
  if (title.length < 5) {
    return res
      .status(400)
      .render("create", { error: "title must be 5 characters" });
  }
  if (!image.startsWith("http://") && !image.startsWith("https://")) {
    return res.status(400).render("create", {
      error: "image must starts with http:// or https://",
    });
  }
  if (description.length < 10) {
    return res.status(400).render("create", {
      error: "description must be minimum 10 characters long",
    });
  }
  if (type.length < 3) {
    return res
      .status(400)
      .render("create", { error: "type must be minimum 3 characters long" });
  }
  if (certificate.length < 2) {
    return res
      .status(400)
      .render("create", { error: "must be minimum 2 characters long" });
  }
  if (price.length < 0) {
    return res
      .status(400)
      .render("create", { error: "price must be positive number" });
  }

  try {
    await Courses.findByIdAndUpdate(courseId, {
      title,
      type,
      certificate,
      image,
      description,
      price,
    });

    res.redirect(`/courses/details/${courseId}`);
  } catch (err) {
    res.status(400).render("create", { error: err.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++

// DELETE

//++++++++++++++++++++++++++++++++++++++++++++

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    await Courses.findByIdAndDelete(courseId);
    res.redirect("/");
  } catch (err) {
    res.status(500).render("details", { error: err.message });
  }
};
