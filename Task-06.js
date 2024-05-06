document.addEventListener('DOMContentLoaded', function () {

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

        // Save the edited task when the user presses enter
        editInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const newText = editInput.value.trim();
                saveEditedTask(index, newText, editInput);
            }
        });

    }

    function saveEditedTask(index, newText, editInput) {
        // Check if the new task text already exists in the itemsList array
        const existingTask = itemsList.find((item, i) => i !== index && item.text.toLowerCase() === newText.toLowerCase());
        if (existingTask) {
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Task title already exists. Please enter a different title.';
            errorMessage.style.color = 'red';
            editInput.parentNode.appendChild(errorMessage);
            return;
        }

        // Remove any previous error message
        const errorMessage = editInput.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }

        // Update the task text in the itemsList array
        itemsList[index].text = newText;

        // Update the local storage
        localStorage.setItem('itemList', JSON.stringify(itemsList));

        // Display the updated task list
        displayTasks();

    }


    function deleteTask(index) {

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
    // function searchTask() {
    //     const searchInput = document.getElementById('searchTask');
    //     const searchTerm = searchInput.value.trim().toLowerCase();
    //     let found = false;

    //     if (searchTerm !== '') {
    //         const regex = new RegExp(searchTerm, 'i');

    //         // Iterate over each task title
    //         itemsList.forEach((item, index) => {
    //             const taskTitle = item.text;
    //             const taskItem = document.querySelector(`.task-item:nth-child(${index + 1}) .task-title`);
    //             const highlightedTitle = taskTitle.replace(regex, '<span style="color: yellow;">$&</span>');

    //             if (highlightedTitle !== taskTitle) {
    //                 taskItem.innerHTML = highlightedTitle;
    //             } else {
    //                 taskItem.innerHTML = taskTitle;
    //             }

    //             if (regex.test(taskTitle.toLowerCase())) {
    //                 found = true;
    //             }
    //         });

    //         if (!found) {
    //             alert('Task not found.');
    //         }
    //     } else {
    //         // Clear all task titles if search input is empty
    //         itemsList.forEach((item, index) => {
    //             const taskItem = document.querySelector(`.task-item:nth-child(${index + 1}) .task-title`);
    //             taskItem.textContent = item.text;
    //         });
    //     }
    // }
    // Add event listener to the form for adding tasks
    

    function searchTask() {
        const searchInput = document.getElementById('searchTask');
        const searchTerm = searchInput.value.trim().toLowerCase();
        let found = false;
    
        if (searchTerm !== '') {
            const regex = new RegExp(searchTerm, 'i');
    
            // Iterate over each task title
            itemsList.forEach((item, index) => {
                const taskTitle = item.text;
                const taskItem = document.querySelector(`.task-item:nth-child(${index + 1})`);
                const taskTitleElement = taskItem.querySelector('.task-title');
    
                // Highlight the matched letters
                const highlightedTitle = taskTitle.replace(regex, '<span style="color: yellow;">$&</span>');
    
                // Update the task title
                taskTitleElement.innerHTML = highlightedTitle;
    
                // Hide or show the task item based on whether it matches the search term
                const match = regex.test(taskTitle.toLowerCase());
                if (match) {
                    taskItem.style.display = 'block'; // Show the task item
                    found = true;
                } else {
                    taskItem.style.display = 'none'; // Hide the task item
                }
            });
    
            // Show alert if no matches found
            if (!found) {
                alert('Task not found.');
            }
        } else {
            // If search term is empty, show all task items
            itemsList.forEach((item, index) => {
                const taskItem = document.querySelector(`.task-item:nth-child(${index + 1})`);
                taskItem.style.display = 'block'; // Show the task item
                const taskTitleElement = taskItem.querySelector('.task-title');
                taskTitleElement.textContent = item.text; // Reset task title to its original text
            });
        }
    }
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
    searchInput.addEventListener('input', searchTask);

    //Display the tasks when the page is loaded
    displayTasks();
});
