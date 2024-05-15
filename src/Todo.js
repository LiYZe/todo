import React, { useState } from "react";
import "./Todo.css";

function Todo() {
  // an array to store todo tasks.
  const [tasks, setTasks] = useState([]);
  // stores the current input text for adding new tasks.
  const [input, setInput] = useState("");
  // a string to manage the filter state (all, active, completed).
  const [filter, setFilter] = useState("all");
  // an integer to track which task is currently being edited.
  const [editingIndex, setEditingIndex] = useState(-1);
  //  a string to hold the text being edited.
  const [editText, setEditText] = useState(""); // Temporary storage for the edited text

  //Handles changes in the task input field and updates the input state accordingly.
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  //Adds a new task to the tasks array when the Enter key is pressed, provided the input is not empty, then clears the input field.
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && input.trim() !== "") {
      setTasks([...tasks, { text: input, completed: false }]);
      setInput("");
    }
  };

  // If Enter is pressed, it checks if the edited text is empty (deletes the task if true) or updates the task with new text. It then exits the editing mode by setting editingIndex to -1.
  const handleEditKeyPress = (event, index) => {
    if (event.key === "Enter") {
      if (editText.trim() === "") {
        // Delete task if input is empty
        setTasks(tasks.filter((_, i) => i !== index));
      } else {
        // Update task with new text if input is not empty
        const updatedTasks = tasks.map((task, i) => {
          if (i === index) {
            return { ...task, text: editText.trim() };
          }
          return task;
        });
        setTasks(updatedTasks);
      }
      setEditingIndex(-1); 
    }
  };

  //Triggered when the input field loses focus. It handles updating or deleting the task based on the edited text and also exits editing mode.
  const handleBlur = (index) => {
    if (editText.trim() === "") {
      // Delete task if input is empty
      setTasks(tasks.filter((_, i) => i !== index));
    } else {
      // Update task with new text if input is not empty
      const updatedTasks = tasks.map((task, i) => {
        if (i === index) {
          return { ...task, text: editText.trim() };
        }
        return task;
      });
      setTasks(updatedTasks);
    }
    setEditingIndex(-1); 
  };

  //Toggles the completion status of a task based on its index.
  const toggleCompletion = (index) => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(newTasks);
  };

  //Clears all tasks that are marked as completed.
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  //Returns a filtered list of tasks based on the current filter state.
  const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  };

  //Toggles the completion status of all tasks based on whether all are completed or not.
  const toggleAllTasksCompletion = () => {
    const allCompleted = tasks.every((task) => task.completed);
    setTasks(tasks.map((task) => ({ ...task, completed: !allCompleted })));
  };

  //Dellete task base on its index
  const deleteTask = (index) => {
    setTasks(tasks.filter((task, i) => i !== index));
  };

  return (
    <div className="app-background">
      <div className="centered-container">
        <h1 className="app-title">todos</h1>
      </div>
      <div className="centered-container">
        <div className="todo-container">
          <div className="input-and-toggle-container">
            <button className="toggle-all" onClick={toggleAllTasksCompletion}>
              &#x25bc;
            </button>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <ul>
            {getFilteredTasks().map((task, index) => (
              <li key={index} className={task.completed ? "completed" : ""}>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompletion(index)}
                    style={{ display: "none" }}
                  />
                  <span
                    className={`checkmark ${task.completed ? "checked" : ""}`}
                  ></span>
                </label>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => handleBlur(index)}
                    onKeyPress={(e) => handleEditKeyPress(e, index)}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => {
                      setEditingIndex(index);
                      setEditText(task.text);
                    }}
                    className="task-text"
                  >
                    {task.text}
                  </span>
                )}
                <button
                  onClick={() => deleteTask(index)}
                  className="delete-task"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <footer>
            <span>
              {tasks.filter((task) => !task.completed).length} items left
            </span>
            <div className="filters">
              <button
                onClick={() => setFilter("all")}
                className={filter === "all" ? "selected" : ""}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={filter === "active" ? "selected" : ""}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={filter === "completed" ? "selected" : ""}
              >
                Completed
              </button>
            </div>
            <div className="completed">
              {tasks.some((task) => task.completed) ? (
                <button onClick={clearCompleted} className="clear-completed">
                  Clear completed
                </button>
              ) : (
                <div style={{ visibility: "hidden" }}>Placeholder</div>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Todo;
