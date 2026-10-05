const express = require("express");
const app=express();
const products=require("./routes/products");
const session = require("express-session");

app.use(
    session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.json());

app.use("/products",products);

app.listen(3200,()=>{
  console.log("server is runnning on ");
})