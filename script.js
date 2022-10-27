//Variables formed from elements in the DOM
let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let msg = document.getElementById("msg");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

//This prevents the user from adding a new task with an incomplete Task Title field in the modal.
form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
});

//This function validates if the Tast Title field in the modal is filled out.
    //If if isn't, an error populates in the modal.
    //If successful, it clears away the error message (if needed), runs the acceptData function,
        //and allows the user to click the Add button to close.
let formValidation = () => {
    if(textInput.value === "") {
        msg.innerHTML = "Task cannot be blank";
    } else {
        msg.innerHTML = "";
        acceptData();
        add.setAttribute("data-bs-dismiss", "modal");
        add.click();
        (() => {
            add.setAttribute("data-bs-dismiss", "");
        });
    }
};

//Empty data array
let data = [];

//This function takes the data that the user provided in the New Task modal, creates a data object and
    //pushes it into the data array, stores the data in local storage, and activates the createTasks() function.
let acceptData = () => {
    data.push({
        text: textInput.value,
        date: dateInput.value,
        description: textarea.value
    });
    localStorage.setItem("data", JSON.stringify(data));
    createTasks();
};

//This function creates a Task Card with data in the local storage to show on the screen to the user.
    //Then runs resetForm function at the end.
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

//This function deletes a Task Card by pressing the Trash Can icon on a specific card.
    //It also deletes the data in the local storage.
let deleteTask = (e) => {
    e.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.id, 1);
    localStorage.setItem("data", JSON.stringify(data));
};

//This function edits a Task Card by pressing the Paper with Pencil icon on a specific card.
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

//This function grabs the data in local storage and shows it on screen for the user.
(() => {
    data = JSON.parse(localStorage.getItem("data")) || [];
    createTasks();
})();