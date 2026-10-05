const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");

    if(req.method == "OPTIONS"){
        res.status(200).end();
        return;
    }

    next();
});

const filePath = path.join(__dirname,"..","data","todo.json");

app.get("/todos",(req,res) => {
    fs.readFile(filePath,"utf8",(error,data)=>{
        if(error){
            res.status(500)
            res.json({
                message:"Error reading file"
            });
            return;
        }

        let todos=JSON.parse(data);

        let active=todos.filter((todo)=>{
            return todo.deleted==false;
        });

        res.json(active);
    });
});

app.post("/todos",(req,res)=>{
    fs.readFile(filePath,"utf8",(error,data)=>{
        if(error){
            res.status(500)
            res.json({
                message:"Error reading todo file"
            });
            return;
        }

        let todos=JSON.parse(data);

        let id=1;

        if(todos.length > 0){
            id = todos[todos.length - 1].id + 1;
        }

        let newTodo={
            id:id,
            task:req.body.task,
            completed:false,
            deleted:false
        };

        todos.push(newTodo);

        fs.writeFile(filePath,JSON.stringify(todos),(error)=>{
            if(error){
                res.status(500)
                res.json({
                    message:"Error saving todo"
                });
                return;
            }

            res.status(201)
            res.json(newTodo);
        });
    });
});

app.put("/todos/:id",(req,res)=>{
    let id = Number(req.params.id);

    fs.readFile(filePath,"utf8",(error,data) => {
        if(error){
            res.status(500)
            res.json({
                message:"Error reading todo file"
            });
            return;
        }

        let todos=JSON.parse(data);

        let updatedData=todos.map((todo)=>{
            if(todo.id == id){
                return{
                    id:id,
                    task:req.body.task,
                    completed:todo.completed,
                    deleted:todo.deleted
                };
            }

            return todo;
        });

        fs.writeFile(filePath,JSON.stringify(updatedData),(error) => {
            if(error){
                res.status(500)
                res.json({
                    message:"Error updating todo"
                });
                return;
            }

            res.json({
                message:"Todo updated"
            });
        });
    });
});

app.patch("/todos/:id",(req,res) => {
    let id = Number(req.params.id);

    fs.readFile(filePath,"utf8",(error,data) => {
        if(error){
            res.status(500)
            res.json({
                message:"Error reading todo file"
            });
            return;
        }

        let todos = JSON.parse(data);

        let updatedData = todos.map((todo) => {
            if(todo.id == id){
                todo.completed = req.body.completed;
            }

            return todo;
        });

        fs.writeFile(filePath,JSON.stringify(updatedData),(error) => {
            if(error){
                res.status(500)
                res.json({
                    message:"Error updating todo"
                });
                return;
            }

            res.json({
                message:"Todo status updated"
            });
        });
    });
});

app.delete("/todos/:id",(req,res) => {
    let id = Number(req.params.id);

    fs.readFile(filePath,"utf8",(error,data) => {
        if(error){
            res.status(500)
            res.json({
                message:"Error reading todo file"
            });
            return;
        }

        let todos = JSON.parse(data);

        let updatedData = todos.map((todo) => {
            if(todo.id == id){
                todo.deleted = true;
            }

            return todo;
        });

        fs.writeFile(filePath,JSON.stringify(updatedData),(error) => {
            if(error){
                res.status(500)
                res.json({
                    message:"Error deleting todo"
                });
                return;
            }

            res.json({
                message:"Todo deleted"
            });
        });
    });
});

app.listen(3000,() => {
    console.log("Server running on http://localhost:3000");
});