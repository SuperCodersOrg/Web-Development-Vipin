const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "uploads/");
    },filename: function(req,file,cb){
        const extension = path.extname(file.originalname);
        const filename = file.originalname + extension;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 2 * 1024 * 1024
    },
    fileFilter:function(req,file,cb){
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
            cb(null, true);
        }else{
            cb(new Error("Only JPG, JPEG and PNG files are allowed"));
        }
    }
});


app.get("/",(req,res)=>{
    res.send(`<h1>Upload Profile Picture</h1>
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="text" name="username" placeholder="Enter username">
            <br><br>
            <input type="file" name="profile">
            <br><br>
            <button type="submit">Upload</button>
        </form>
        `);
});


app.post("/upload",upload.single("profile"),(req,res)=>{
    console.log("Body:");
    console.log(req.body);
    console.log("File:");
    console.log(req.file);
    res.send("File uploaded successfully");
});


app.listen(3000,()=>{
    console.log("Server running on port 3000");
});