module.exports = (err, req, res, next) => {
  console.log(err.stack);

  if (err.name === "CastError" && err.kind === "ObjectId") {
    res.status(404).render("404", { error: "Invalid ID format" });
  }
};
