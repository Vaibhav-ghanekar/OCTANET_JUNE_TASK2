window.onload = function() {
  var storedTasks = localStorage.getItem("tasks");
  
  if (storedTasks) {
    var tasks = JSON.parse(storedTasks);
    
    for (var i = 0; i < tasks.length; i++) {
      addTaskToList(tasks[i]);
    }
  }
}

function showNotification(message) {
  var notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(function() {
    notification.style.display = "none";
  }, 3000); // Hide after 3 seconds
}

function addTask() {
  var taskInput = document.getElementById("taskInput");
  var prioritySelect = document.getElementById("prioritySelect");
  var deadlineInput = document.getElementById("deadlineInput");
  
  var task = taskInput.value;
  var priority = prioritySelect.value;
  var deadline = deadlineInput.value;
  
  if (task === "" || priority === "" || deadline === "") {
    showNotification("Enter both the fields");
    return;
  }
  
  var newTask = { task: task, priority: priority, deadline: deadline, completed: false };
  addTaskToList(newTask);
  saveTasks();
  
  taskInput.value = "";
  deadlineInput.value = "";
  
  showNotification("Task added 👍");
}

function addTaskToList(newTask) {
  var taskList = document.getElementById("taskList");

  var tr = document.createElement("tr");

  // Check if the task is completed and apply the appropriate class
  if (newTask.completed) {
    tr.classList.add("completed");
  }

  tr.innerHTML = "<td>" + newTask.task + "</td>" +
                 "<td>" + newTask.priority + "</td>" +
                 "<td>" + newTask.deadline + "</td>" +
                 "<td class='checkbox-container'>" +
                   "<input type='checkbox' onclick='toggleTaskCompletion(this)' " + (newTask.completed ? "checked" : "") + ">" +
                 "</td>" +
                 "<td><button onclick='deleteTask(this)' class='delete-button'>Delete</button></td>";

  var tasks = taskList.getElementsByTagName("tr");
  var inserted = false;

  for (var i = 1; i < tasks.length; i++) {
    var existingPriority = tasks[i].getElementsByTagName("td")[1].innerHTML;

    if (newTask.priority === "low" && existingPriority !== "low") {
      taskList.insertBefore(tr, tasks[i]);
      inserted = true;
      break;
    } else if (newTask.priority === "medium" && (existingPriority === "high" || existingPriority === "low")) {
      taskList.insertBefore(tr, tasks[i]);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    taskList.appendChild(tr);
  }
}

function toggleTaskCompletion(checkboxElement) {
  var trElement = checkboxElement.parentNode.parentNode;
  trElement.classList.toggle("completed");
  
  var taskList = trElement.parentNode;
  var tasks = taskList.getElementsByTagName("tr");
  
  for (var i = 1; i < tasks.length; i++) {
    if (tasks[i] === trElement) {
      var storedTasks = localStorage.getItem("tasks");
      var parsedTasks = JSON.parse(storedTasks);
      
      parsedTasks[i - 1].completed = checkboxElement.checked;
      localStorage.setItem("tasks", JSON.stringify(parsedTasks));
      break;
    }
  }
}

function deleteTask(buttonElement) {
  var trElement = buttonElement.parentNode.parentNode;
  var taskList = trElement.parentNode;
  var tasks = taskList.getElementsByTagName("tr");
  
  for (var i = 1; i < tasks.length; i++) {
    if (tasks[i] === trElement) {
      var storedTasks = localStorage.getItem("tasks");
      var parsedTasks = JSON.parse(storedTasks);
      
      parsedTasks.splice(i - 1, 1);
      localStorage.setItem("tasks", JSON.stringify(parsedTasks));
      trElement.remove();
      break;
    }
  }
  
  showNotification("Task deleted successfully");
}

function saveTasks() {
  var taskList = document.getElementById("taskList");
  var tasks = [];
  
  var rows = taskList.getElementsByTagName("tr");
  
  for (var i = 1; i < rows.length; i++) {
    var task = rows[i].getElementsByTagName("td")[0].innerHTML;
    var priority = rows[i].getElementsByTagName("td")[1].innerHTML;
    var deadline = rows[i].getElementsByTagName("td")[2].innerHTML;
    var completed = rows[i].classList.contains("completed");
    
    tasks.push({ task: task, priority: priority, deadline: deadline, completed: completed });
  }
  
  localStorage.setItem("tasks", JSON.stringify(tasks));
}