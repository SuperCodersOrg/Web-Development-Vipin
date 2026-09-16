const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");
    next();
});

app.get("/about",(req,res)=>{
    res.sendFile(path.join(__dirname,"data","college.json"),(error)=>{
        if(error){
            res.status(500);
            res.send("Error in opening file");
            return;
        }
    });
});

app.get("/courses",(req,res)=>{
    res.sendFile(path.join(__dirname,"data","courses.json"),(error)=>{
        if(error){
            res.status(500);
            res.send("Error in opening file");
            return;
        }
    });
});

app.get("/courses/:course",(req,res)=>{
    const courseName = req.params.course;

    fs.readFile(path.join(__dirname,"data","courses.json"),(error,data)=>{
        if(error){
            res.status(500);
            res.send("Error in opening file");
            return;
        }

        const courses = JSON.parse(data);

        const course = courses.find((course)=>{
            return course.name.toLowerCase() === courseName.toLowerCase();
        });

        if(!course){
            res.status(404);
            res.send("Course not found");
            return;
        }

        res.status(200);
        res.json(course);
    });
});

app.get("/students",(req,res)=>{
    fs.readFile(path.join(__dirname,"data","students.json"),(error,data)=>{
        if(error){
            res.status(500);
            res.send("Error in opening file");
            return;
        }

        const students=JSON.parse(data);

        const result={
            totalStudents: students.length,
            students: students
        };

        res.status(200);
        res.json(result);
    });
});

app.post("/students",(req,res)=>{
    const student = req.body;

    fs.readFile(path.join(__dirname,"data","students.json"),(error,data)=>{
        if(error){
            res.status(500);
            res.send("Error in opening file");
            return;
        }

        const students = JSON.parse(data);

        students.push(student);

        fs.writeFile(
            path.join(__dirname,"data","students.json"),
            JSON.stringify(students),
            (error)=>{
                if(error){
                    res.status(500);
                    res.send("Error in saving student");
                    return;
                }

                res.status(200);
                res.json({
                    message:"Student registered successfully",
                    student:student
                });
            }
        );
    });
});

app.get("/contact",(req,res)=>{
    const filePath = path.join(__dirname,"data","contact.json");

    res.sendFile(filePath,(error)=>{
        if(error){
            res.status(500);
            res.send("Error in opening file");
            return;
        }
    });
});

app.get("/facilities",(req,res)=>{
    const filePath = path.join(__dirname,"data","facilities.json");

    res.sendFile(filePath,(error)=>{
        if(error){
            res.status(500);
            res.send("Error in opening file");
            return;
        }
    });
});

app.get("/placement",(req,res)=>{
    const filePath = path.join(__dirname,"data","placement.json");

    res.sendFile(filePath,(error)=>{
        if(error){
            res.status(500);
            res.send("Error in opening file");
            return;
        }
    });
});

app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000");
});