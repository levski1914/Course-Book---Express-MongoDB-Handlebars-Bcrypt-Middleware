const express = require("express");
const routes = require("./routes");
const handleBars = require("express-handlebars");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const { authMiddleWare } = require("./middleware/authMiddleware");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authMiddleWare);

app.engine(
  "hbs",
  handleBars.engine({
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.use(routes);

//TODO change database
mongoose.connect("mongodb://127.0.0.1:27017/mongodb");

mongoose.connection.on("connected", () => console.log("DB is connected"));
mongoose.connection.on("disconnected", () => console.log("DB is disconnected"));
mongoose.connection.on("err", (err) => console.log(err));

app.listen(5000, () =>
  console.log("App is listenning on http://localhost:5000")
);
