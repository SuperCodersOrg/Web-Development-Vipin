const http = require("http");
const fs = require("fs");

const server = http.createServer((req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");

    if(req.method==='OPTIONS'){
      res.writeHead(200);
      res.end();
      return;
    }
    if(req.url === "/about" && req.method === "GET"){
        fs.readFile("data/college.json",(error,data)=>{
            if(error){
                res.statusCode = 500;
                res.end("Error in opening file");
                return;
            }
            const college = JSON.parse(data);
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.end(JSON.stringify(college));
        });
    }else if(req.url === "/courses" && req.method === "GET"){
        fs.readFile("data/courses.json",(error,data)=>{
            if(error){
                res.statusCode = 500;
                res.end("Error in opening file");
                return;
            }
            const courses = JSON.parse(data);
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.end(JSON.stringify(courses));
        });
    }else if(req.url.startsWith("/courses/") && req.method === "GET"){
        const parts = req.url.split("/");
        const courseName = parts[2];
        fs.readFile("data/courses.json",(error,data)=>{
            if(error){
                res.statusCode = 500;
                res.end("Error in opening file");
                return;
            }
            const courses = JSON.parse(data);
            const course = courses.find((course)=>{
                return course.name.toLowerCase() === courseName.toLowerCase();
            });

            if(!course){
                res.statusCode = 404;
                res.end("Course not found");
                return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.end(JSON.stringify(course));
        });
    }else if(req.url === "/students" && req.method === "GET"){
        fs.readFile("data/students.json",(error,data)=>{
            if(error){
                res.statusCode = 500;
                res.end("Error in opening file");
                return;
            }

            const students = JSON.parse(data);

            const result = {
                totalStudents: students.length,
                students: students
            };

            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.end(JSON.stringify(result));
        });

    }else if(req.url === "/students" && req.method === "POST"){
        let body = "";

        req.on("data",(chunk)=>{
            body += chunk;
        });

        req.on("end",()=>{
            const student = JSON.parse(body);

            fs.readFile("data/students.json",(error,data)=>{
                if(error){
                    res.statusCode = 500;
                    res.end("Error in opening file");
                    return;
                }
                const students = JSON.parse(data);
                student.id = students.length + 1;
                students.push(student);
                fs.writeFile("data/students.json",JSON.stringify(students),(error)=>{
                        if(error){
                            res.statusCode = 500;
                            res.end("Error in saving student");
                            return;
                        }
                        res.statusCode = 200;
                        res.setHeader("Content-Type","application/json");
                        res.end(JSON.stringify({
                            message:"Student registered successfully",
                            student:student
                        }));
                    }
                );
            });
        });
    }else if(req.url === "/contact" && req.method === "GET"){
        fs.readFile("data/contact.json",(error,data)=>{
            if(error){
                res.statusCode = 500;
                res.end("Error in opening file");
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.end(data);
        });
    }else if(req.url === "/facilities" && req.method === "GET"){
        fs.readFile("data/facilities.json",(error,data)=>{
            if(error){
                res.statusCode = 500;
                res.end("Error in opening file");
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.end(data);
        });
    }else if(req.url === "/placement" && req.method === "GET"){
        fs.readFile("data/placement.json",(error,data)=>{
            if(error){
                res.statusCode = 500;
                res.end("Error in opening file");
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.end(data);
        });
    }else{
        res.statusCode = 404;
        res.setHeader("Content-Type","text/plain");
        res.end("404 - Page Not Found");
    }
});

server.listen(3100);