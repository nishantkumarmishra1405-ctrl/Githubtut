let students = [];


// ---------------- LOGIN / REGISTER ----------------

function showLogin() {
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "flex";
}

function showRegister() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "flex";
}

function closePopup() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "none";
}


// Register

document.getElementById("registerForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let confirm = document.getElementById("regConfirm").value;

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    let user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Registration successful");

    document.getElementById("registerForm").reset();

    showLogin();
});


// Login

document.getElementById("loginForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser == null) {
        alert("Please register first");
        return;
    }

    if (
        email === savedUser.email &&
        password === savedUser.password
    ) {

        alert("Login successful");

        closePopup();

        document.getElementById("loginForm").reset();

    } else {

        alert("Wrong email or password");

    }

});


// ---------------- STUDENTS ----------------

document.getElementById("studentForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("name").value;
    let id = document.getElementById("studentId").value;
    let email = document.getElementById("email").value;
    let course = document.getElementById("course").value;
    let gender = document.getElementById("gender").value;

    let student = {
        name: name,
        id: id,
        email: email,
        course: course,
        gender: gender
    };

    students.push(student);

    displayStudents();

    document.getElementById("studentForm").reset();

});


// Show students

function displayStudents(data = students) {

    let list = document.getElementById("studentList");

    list.innerHTML = "";

    data.forEach(function(student, index) {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.email}</td>

            <td>
                <button class="edit"
                    onclick="editStudent(${index})">
                    Edit
                </button>

                <button class="delete"
                    onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
        `;

        list.appendChild(row);

    });

}


// Delete

function deleteStudent(index) {

    if (confirm("Delete this student?")) {

        students.splice(index, 1);

        displayStudents();

    }

}


// Edit

function editStudent(index) {

    let student = students[index];

    let name = prompt("Enter student name", student.name);

    if (name == null || name == "") {
        return;
    }

    student.name = name;

    displayStudents();

}


// Search

document.getElementById("search").addEventListener("input", function() {

    let text = this.value.toLowerCase();

    let result = students.filter(function(student) {

        return (
            student.name.toLowerCase().includes(text) ||
            student.id.toLowerCase().includes(text) ||
            student.course.toLowerCase().includes(text)
        );

    });

    displayStudents(result);

});