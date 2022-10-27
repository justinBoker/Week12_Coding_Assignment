let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let msg = document.getElementById("msg");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

//This prevents the user from adding a new task with an incomplete New Task modal.
form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
});

//This function validates if the New Task modal is filled out correctly.
    //If if isn't in logs "failure" in the console and an error populates in the modal.
    //If successful, it logs "success" and calls the acceptData() function.
let formValidation = () => {
    if(textInput.value === "") {
        console.log("failure");
        msg.innerHTML = "Task cannot be blank";
    } else {
        console.log("success");
        msg.innerHTML = "";
        acceptData();
        add.setAttribute("data-bs-dismiss", "modal");
        add.click();
        (() => {
            add.setAttribute("data-bs-dismiss", "");
        });
    }
};

let data = [];

//This function takes the data that the user provided in the New Task modal, creates a data object, and activates the
    //createTasks() function.
let acceptData = () => {
    data.push({
        text: textInput.value,
        date: dateInput.value,
        description: textarea.value
    });
    localStorage.setItem("data", JSON.stringify(data));
    
    console.log(data);
    createTasks();
};

//This function creates a Task Card to show on the screen to the user.
let createTasks = () => {
    tasks.innerHTML = "";
    data.map((x, y) => {
        return (tasks.innerHTML += `
        <div id=${y}>
            <span class="fw-bold">${x.text}</span>
            <span class="small text-secondary">${x.date}</span>
            <p>${x.description}</p>
    
            <span class="options">
                <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
                <i onClick="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i> 
            </span>
        </div>
        `);
    });
    
    resetForm();
};

let deleteTask = (e) => {
    e.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.id, 1);
    localStorage.setItem("data", JSON.stringify(data));
};

let editTask = (e) => {
    let selectedTask = e.parentElement.parentElement;
    textInput.value = selectedTask.children[0].innerHTML;
    dateInput.value = selectedTask.children[1].innerHTML;
    textarea.value = selectedTask.children[2].innerHTML;
    deleteTask(e);
};


//Resets the input fields within the New Task modal after the user clicks Add.
let resetForm = () => {
    textInput.value = "";
    dateInput.value = "";
    textarea.value = "";
};

(() => {
    data = JSON.parse(localStorage.getItem("data")) || [];
    createTasks();
})();