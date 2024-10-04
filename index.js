const express = require("express");
const routes = require("./routes");
const handleBars = require("express-handlebars");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const { authMiddleWare } = require("./middleware/authMiddleware");

const catchErrors = require("./middleware/catchErrors");
const session = require("express-session");
const flash = require("connect-flash");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(authMiddleWare);

app.engine(
  "hbs",
  handleBars.engine({
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.use(routes);

app.use(catchErrors);

app.use((req, res, next) => {
  res.status(404).render("404");
});

mongoose.connect("mongodb://127.0.0.1:27017/mongodb");

mongoose.connection.on("connected", () => console.log("DB is connected"));
mongoose.connection.on("disconnected", () => console.log("DB is disconnected"));
mongoose.connection.on("err", (err) => console.log(err));

app.listen(5000, () =>
  console.log("App is listenning on http://localhost:5000")
);
