const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks },
    } = await axios.get("/api/v1/tasks");
    if (tasks.length < 1) {
      tasksDOM.innerHTML =
        '<h5 class="empty-list"><hr>No tasks in your list<hr></h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task;
        return `<div class="single-task ${completed ? "task-completed" : ""}">
                <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
                <div class="task-links">
                  <a href="task.html?id=${taskID}" class="edit-link">
                    <i class="fas fa-edit"></i>
                  </a>
                  <button type="button" class="delete-btn" data-id="${taskID}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.dataset.id;
    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      showTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
    loadingDOM.style.visibility = "hidden";
  }
});

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value.trim(); // Trim whitespace from task name

  if (!name) {
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = "Task name cannot be empty";
    formAlertDOM.classList.add("text-danger");
    setTimeout(() => {
      formAlertDOM.style.display = "none";
      formAlertDOM.classList.remove("text-danger");
    }, 3000);
    return;
  }

  try {
    await axios.post("/api/v1/tasks", { name });
    showTasks();
    taskInputDOM.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = "Success, task added";
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    console.error("Error adding task:", error.message);
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = "Error, please try again";
    formAlertDOM.classList.add("text-danger");
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success", "text-danger");
  }, 3000);
});
