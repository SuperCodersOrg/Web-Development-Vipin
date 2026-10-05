const express=require("express");

const app=express();

function logger1(req,res,next){
  console.log("middleware1");
  req.username="vipin";
  next();
}

function logger2(req,res,next){
  console.log(req.username);

  next();
}

function logger3(req,res,next){
  console.log(req.username);
  next();
}

app.use(logger1);
app.use(logger2);
app.use(logger3);

app.get('/',(req,res)=>{
  res.status(200);
  res.send("home page");
})

app.listen(3300,()=>{
  console.log("server is running");
})