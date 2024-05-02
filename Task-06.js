document.addEventListener('DOMContentLoaded', function () {
    // Define an array to store the tasks
    let itemsList = JSON.parse(localStorage.getItem('itemList')) || [];

    function addTask(event) {
        event.preventDefault(); // Prevent form submission

        // Get the input value
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        // Check if the input is not empty
        if (taskText !== '') {
            const existingTask = itemsList.find(item => item.text.toLowerCase() === taskText.toLowerCase());

            if (existingTask) {
                alert('Task already exists.');
                return;
            }

            // Add the task to the itemsList array
            itemsList.push({ text: taskText, done: false });

            // Store the updated itemList array in local storage
            localStorage.setItem('itemList', JSON.stringify(itemsList));

            // Clear the input field
            taskInput.value = '';

            // Display the updated task list
            displayTasks();
        }
    }


    function editTask(index) {
        //Retrieve tasks from local storage
        let itemsList = JSON.parse(localStorage.getItem("itemList")) || [];
        //Get the task item to be edited
        const taskItem = document.getElementById('taskItem-${index}');
        const titleContainer = taskItem.querySelector(".task-title");

        //get the current task text
        const currentText = itemsList[index].text;

        //Create and setup an input element
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;

        //replace the task text with the new input field 
        titleContainer.innerHTML = '';
        titleContainer.appendChild(editInput);

        //focus on the input field 
        editInput.focus();

        //save the edited task when the user presses enter or clicks outised the input field
        editInput.addEventListener('blur', function () {
            saveEditedTask(index, editInput.value);
        });
        editInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                saveEditedTask(index, editInput.value);
            }
        });


    }

    function saveEditedTask(index, newText) {
        // Retrieve tasks from local storage
        let itemsList = JSON.parse(localStorage.getItem('itemList')) || [];
        // Check if the new task text already exists in the itemsList array
        const existingTask = itemsList.find((item, i) => i !== index && item.text.toLowerCase() === newText.toLowerCase());
        if (existingTask) {
            alert('Task title already exists.');
            return;
        }
        // Update the task text in the itemsList array
        itemsList[index].text = newText;

        // Update the local storage
        localStorage.setItem('itemList', JSON.stringify(itemsList));

        // Display the updated task list
        displayTasks();

    }


    function deleteTask(index) {
        //retrieve tasks from localstorage
        let itemsList = JSON.parse(localStorage.getItem('itemList')) || [];

        //remove the task at the specified index
        itemsList.splice(index, 1);
        //update local storage with new list
        localStorage.setItem("itemList", JSON.stringify(itemsList));
        //display the updated list of tasks
        displayTasks();
    }

    function deleteTasks() {
        //clear the itemList array
        itemsList = [];
        //update local storage 
        localStorage.removeItem('itemList');
        //display the updated list of tasks
        displayTasks();
    }
    window.deleteTasks = deleteTasks;

    function toggleDone(index) {
        //Retrieve tasks from local storage
        let itemsList = JSON.parse(localStorage.getItem('itemList'));

        //toggle the done property of the task
        itemsList[index].done = !itemsList[index].done;
        //Update local storage
        localStorage.setItem('itemList', JSON.stringify(itemsList));

        //Display the updated list of tasks
        displayTasks();


    }
    function displayTasks(filter = 'all') {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Clear existing tasks

        //Retrieve tasks from my local storage 
        const storedItemsList = JSON.parse(localStorage.getItem('itemList')) || [];

        const filteredItems = storedItemsList.filter(item => {
            if (filter === 'all') return true;
            if (filter === 'done') return item.done;
            if (filter === 'undone') return !item.done;
        })
        // Iterate over each task in the filteredItems array
        filteredItems.forEach((item, index) => {
            // Create a new task element
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.id = 'taskItem-${index}';

            //create task title 
            const titleContainer = document.createElement('div');
            titleContainer.textContent = item.text;
            titleContainer.classList.add('task-title');

            //create buttons container
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('task-buttons');

            // Create "Done" button
            const doneBtn = document.createElement('button');
            doneBtn.textContent = item.done ? 'Undone' : 'Done';
            doneBtn.onclick = function () { toggleDone(index); };
            if (item.done) {
                doneBtn.classList.add('done');
            }
            buttonContainer.appendChild(doneBtn);

            // Create "Edit" button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = function () { editTask(index); };
            buttonContainer.appendChild(editBtn);

            // Create "Delete" button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function () { deleteTask(index); };
            buttonContainer.appendChild(deleteBtn);

            // Append title and buttons container to task item
            taskItem.appendChild(titleContainer);
            taskItem.appendChild(buttonContainer);
            // Append the task element to the taskList
            taskList.appendChild(taskItem);
        });

        //update the filter dropdown value
        const filterDropdown = document.getElementById('filterDropdown');
        filterDropdown.value = filter;
    }

    function searchTask() {
        if (event.key === 'Enter') {
            const searchInput = document.getElementById('searchTask');
            const searchTerm = searchInput.value.trim();

            // Check if the search term is not empty
            if (searchTerm !== '') {
                const taskTitles = itemsList.map(item => item.text.toLowerCase());
                const index = taskTitles.indexOf(searchTerm.toLowerCase());

                if (index !== -1) {
                    // Task found, change its color to yellow
                    const taskItem = document.querySelector(`.task-item:nth-child(${index + 1}) .task-title`);
                    taskItem.style.color = 'yellow';
                } else {
                    // Task not found, display a message
                    alert('Task not found.');
                }
            }
        }
    }
    // Add event listener to the form for adding tasks
    const addTaskBtn = document.getElementById('addTaskBtn');
    addTaskBtn.addEventListener('click', addTask);

    // Add event listener to the filter dropdown
    const filterDropdown = document.getElementById('filterDropdown');
    filterDropdown.addEventListener('change', function () {
        const filter = filterDropdown.value;
        displayTasks(filter);
    });

    //add event listener to delete all tasks button 
    const deleteTasksBtn = document.getElementById('deleteTasksBtn');
    deleteTasksBtn.addEventListener('click', deleteTasks);
    // Add event listener to the search button
    const searchInput = document.getElementById('searchTask');
    searchInput.addEventListener('keypress', searchTask);

    //Display the tasks when the page is loaded
    displayTasks();
});
