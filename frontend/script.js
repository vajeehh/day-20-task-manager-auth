const API_URL = "https://day-20-task-manager-auth.onrender.com";

// Show Login
function showLogin() {
    document.getElementById("signupSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
}

// Show Signup
function showSignup() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("signupSection").style.display = "block";
}

// Signup
async function signup() {

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {

        const response = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        document.getElementById("message").textContent = data.message;

        if (response.ok) {
            showLogin();
        }

    } catch (error) {

        document.getElementById("message").textContent =
            "Server connection failed";

    }
}

// Login
async function login() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {

        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("message").textContent = data.message;
            return;
        }

        localStorage.setItem("token", data.token);

        document.getElementById("signupSection").style.display = "none";
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("dashboardSection").style.display = "block";

        document.getElementById("message").textContent =
            "Login successful";

        getTasks();

    } catch (error) {

        document.getElementById("message").textContent =
            "Server connection failed";

    }
}

// Get Tasks
async function getTasks() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const tasks = await response.json();

        const taskList = document.getElementById("taskList");

        taskList.innerHTML = "";

        tasks.forEach(task => {

            const taskDiv = document.createElement("div");

            taskDiv.className = "task";

            taskDiv.innerHTML = `
                <h3>${task.title}</h3>
                <p>Category: ${task.category}</p>
                <p>Due Date: ${task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"
                }</p>
                <p>Status: ${task.completed ? "Completed" : "Pending"
                }</p>

                <button onclick="toggleTask('${task._id}', ${task.completed})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button onclick="editTask('${task._id}', '${task.title}')">
                    Edit
                </button>

                <button onclick="deleteTask('${task._id}')">
                    Delete
                </button>
            `;

            taskList.appendChild(taskDiv);

        });

    } catch (error) {

        document.getElementById("message").textContent =
            "Failed to load tasks";

    }
}

// Add Task
async function addTask() {

    const title = document.getElementById("taskTitle").value;
    const category = document.getElementById("taskCategory").value;
    const dueDate = document.getElementById("taskDueDate").value;

    if (!title) {
        document.getElementById("message").textContent =
            "Please enter a task title";
        return;
    }

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                category,
                dueDate
            })
        });

        if (response.ok) {

            document.getElementById("taskTitle").value = "";
            document.getElementById("taskDueDate").value = "";

            getTasks();

        }

    } catch (error) {

        document.getElementById("message").textContent =
            "Failed to add task";

    }
}

// Complete / Undo
async function toggleTask(id, completed) {

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            completed: !completed
        })
    });

    getTasks();
}

// Edit Task
async function editTask(id, oldTitle) {

    const newTitle = prompt("Enter new task title:", oldTitle);

    if (!newTitle) {
        return;
    }

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            title: newTitle
        })
    });

    getTasks();
}

// Delete Task
async function deleteTask(id) {

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    getTasks();
}

// Logout
function logout() {

    localStorage.removeItem("token");

    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";

    document.getElementById("taskList").innerHTML = "";

    document.getElementById("message").textContent =
        "Logged out successfully";
}

// Check existing login
if (localStorage.getItem("token")) {

    document.getElementById("signupSection").style.display = "none";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboardSection").style.display = "block";

    getTasks();
}