const express = require("express");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false
  })
);

app.use("/",authRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});