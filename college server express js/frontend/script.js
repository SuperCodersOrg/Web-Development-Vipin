const nav = document.querySelector("nav");
const sections = document.querySelectorAll("#main section");

nav.addEventListener("click",(event)=>{
    event.preventDefault();
    const sectionName = event.target.innerText.toLowerCase();

    sections.forEach((section)=>{
      section.classList.add("hidden");
    });

    document.getElementById(sectionName).classList.remove("hidden");
    loadSection(sectionName);
});

function loadSection(sectionName){
    if(sectionName === "about"){
      loadAbout();
    }
    if(sectionName === "courses"){
      loadCourses();
    }
    if(sectionName === "students"){
      loadStudents();
    }
    if(sectionName === "contact"){
      loadContact();
    }
    if(sectionName === "facilities"){
      loadFacilities();
    }
    if(sectionName === "placement"){
      loadPlacement();
    }
}

function loadAbout(){
    fetch("http://localhost:3000/about").then(response=>response.json())
    .then(data=>{
      document.getElementById("aboutInfo").innerHTML = `<h3>${data.name}</h3>   
      <p>Established: ${data.established}</p>
      <p>Location: ${data.location}</p> `;
    });
}

function loadCourses(){
   fetch("http://localhost:3000/courses").then(response=>response.json())
     .then(courses=>{
       const coursesList = document.getElementById("coursesList");
       coursesList.innerHTML = "";

            courses.forEach(course=>{
                const button = document.createElement("button");
                button.textContent = course.name;
                button.className = "course-button";
                button.addEventListener("click",()=>{
                    loadCourseDetails(course.name);
                });
                coursesList.appendChild(button);
            });
        });
}

function loadCourseDetails(courseName){
    const coursesList = document.getElementById("coursesList");

    fetch("http://localhost:3000/courses/" + courseName.toLowerCase())
        .then(response => response.json())
        .then(course =>{
            coursesList.innerHTML = `
                <button id="backToCourses">Back to Courses</button>
                <div class="course-card">
                    <h3>${course.name}</h3>
                    <p><strong>Full Name:</strong> ${course.fullName}</p>
                    <p><strong>Duration:</strong> ${course.duration}</p>
                    <p><strong>Seats:</strong> ${course.seats}</p>
                    <p><strong>Eligibility:</strong> ${course.eligibility}</p>
                    <p><strong>Fees:</strong> ₹${course.fees}</p>
                </div>`;

            document.getElementById("backToCourses").addEventListener("click",()=>{
                loadCourses();
            });
        });
}

function loadStudents(){
    fetch("http://localhost:3000/students")
        .then(response=>response.json())
        .then(data=>{
            const studentInfo = document.getElementById("studentInfo");

            studentInfo.innerHTML = `<h3>Total Students: ${data.totalStudents}</h3>`;

            data.students.forEach(student=>{
                const studentCard = document.createElement("div");
                studentCard.className = "student-card";

                studentCard.innerHTML = `
                    <h4>${student.name}</h4>
                    <p>Email: ${student.email}</p>
                    <p>Phone: ${student.phone}</p>
                    <p>Course: ${student.course}</p>
                    <p>Batch: ${student.batch}</p>
                `;

                studentInfo.appendChild(studentCard);
            });
        });
}

function loadContact(){
   fetch("http://localhost:3000/contact")
        .then(response => response.json())
        .then(data=>{
            document.getElementById("contactInfo").innerHTML = `
                <p>Phone: ${data.phone}</p>
                <p>Email: ${data.email}</p>
                <p>Location: ${data.location}</p>
            `;
        });
}

function loadFacilities(){
    fetch("http://localhost:3000/facilities").then(response=>response.json())
        .then(data=>{
            const list = document.getElementById("facilitiesList");
            list.innerHTML = "";

            data.facilities.forEach(facility=>{
                const item = document.createElement("li");
                item.textContent = facility;
                list.appendChild(item);
            });
        });
}

function loadPlacement() {
    fetch("http://localhost:3000/placement").then(response => response.json())
        .then(data => {
            let companies = "";

            data.companies.forEach(company=>{
                companies+=`<li>${company}</li>`;
            });

            document.getElementById("placementInfo").innerHTML = `
                <h3>${data.placementCell}</h3>
                <p>Average Package: ${data.averagePackage}</p>
                <p>Highest Package: ${data.highestPackage}</p>
                <p>Companies Visited: ${data.companiesVisited}</p>
                <p>Placement Rate: ${data.placementRate}</p>
                <h4>Companies</h4>
                <ul>${companies}</ul>`;
        });
}

const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit",(event)=>{
    event.preventDefault();

    const student={
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        course: document.getElementById("course").value,
        batch: document.getElementById("batch").value
    };

    fetch("http://localhost:3000/students",{
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(student)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("studentMessage").textContent = data.message;
        studentForm.reset();
        loadStudents();
    });
});

loadAbout();