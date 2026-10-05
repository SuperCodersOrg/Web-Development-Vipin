const input = document.getElementById("input");
const btn = document.getElementById("btn");
const list = document.getElementById("list");

function loadTodos(){
    fetch("http://localhost:3000/todos")
    .then((response) => {
        return response.json();
    })
    .then((todos) => {
        list.innerHTML = "";

        todos.forEach((todo) => {
            addTodo(todo.task,todo.id,todo.completed);
        });
    });
}

function addTodo(task,id,completed){
    let taskCard = document.createElement("div");
    taskCard.classList.add("todo-card");
    taskCard.setAttribute("todo-id",id);

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.classList.add("checkbox");

    let title = document.createElement("span");
    title.innerText = task;

    if(completed){
        title.style.textDecoration = "line-through";
    }

    let btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    let btnEdit = document.createElement("button");
    btnEdit.innerText = "Edit";
    btnEdit.classList.add("edit-btn");

    let btnDelete = document.createElement("button");
    btnDelete.innerText = "Delete";
    btnDelete.classList.add("delete-btn");

    btnContainer.appendChild(btnEdit);
    btnContainer.appendChild(btnDelete);

    taskCard.appendChild(checkbox);
    taskCard.appendChild(title);
    taskCard.appendChild(btnContainer);

    list.appendChild(taskCard);
}

btn.addEventListener("click",() => {
    let task = input.value.trim();

    if(task == ""){
        alert("Please enter a task");
        return;
    }

    fetch("http://localhost:3000/todos",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({'task':task})
    }).then((response)=>{
        return response.json();
    }).then((todo) => {
        addTodo(todo.task,todo.id,todo.completed);
        input.value = "";
    });
});

list.addEventListener("click",(event) => {
    let taskCard = event.target.closest(".todo-card");

    if(!taskCard){
        return;
    }

    let id = taskCard.getAttribute("todo-id");

    if(event.target.classList.contains("checkbox")){
        let title = taskCard.querySelector("span");

        fetch("http://localhost:3000/todos/" + id,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                completed:event.target.checked
            })
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(event.target.checked){
                title.style.textDecoration = "line-through";
            }
            else{
                title.style.textDecoration = "none";
            }
        });
    }

    if(event.target.classList.contains("edit-btn")){
        let title = taskCard.querySelector("span");

        let newTask = prompt("Enter new task",title.innerText);

        if(newTask == null){
            return;
        }

        newTask = newTask.trim();

        if(newTask == ""){
            return;
        }

        fetch("http://localhost:3000/todos/" + id,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                task:newTask
            })
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            title.innerText = newTask;
        });
    }

    if(event.target.classList.contains("delete-btn")){
        let confirmDelete = confirm("Are you sure you want to delete this task?");

        if(!confirmDelete){
            return;
        }

        fetch("http://localhost:3000/todos/" + id,{
            method:"DELETE"
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            taskCard.remove();
        });
    }
});

loadTodos();