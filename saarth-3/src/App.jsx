import React, { useState, useEffect } from "react";
import "./index.css";

const initialTasks = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  inProgress: [],
  done: [],
};

const TaskManager = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.title) return;
    setTasks({ ...tasks, todo: [...tasks.todo, { id: Date.now().toString(), ...newTask }] });
    setNewTask({ title: "", description: "" });
  };

  const handleMoveTask = (category, taskId, newCategory) => {
    const taskToMove = tasks[category].find((task) => task.id === taskId);
    setTasks({
      ...tasks,
      [category]: tasks[category].filter((task) => task.id !== taskId),
      [newCategory]: [...tasks[newCategory], taskToMove],
    });
  };

  const handleDeleteTask = (category, taskId) => {
    setTasks({
      ...tasks,
      [category]: tasks[category].filter((task) => task.id !== taskId),
    });
  };

  const handleDragStart = (e, category, taskId) => {
    e.dataTransfer.setData("category", category);
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e, newCategory) => {
    const category = e.dataTransfer.getData("category");
    const taskId = e.dataTransfer.getData("taskId");
    handleMoveTask(category, taskId, newCategory);
  };

  return (
    <div className="container">
      <h2>Task Manager</h2>
      <div className="task-input">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        ></textarea>
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div className="task-columns">
        {Object.keys(tasks).map((category) => (
          <div
            className="task-column"
            key={category}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, category)}
          >
            <h3>{category.toUpperCase()}</h3>
            {tasks[category].map((task) => (
              <div
                key={task.id}
                className="task-card"
                draggable
                onDragStart={(e) => handleDragStart(e, category, task.id)}
              >
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <div className="task-actions">
                  {category !== "done" && (
                    <button onClick={() => handleMoveTask(category, task.id, category === "todo" ? "inProgress" : "done")}>
                      Move to {category === "todo" ? "In Progress" : "Done"}
                    </button>
                  )}
                  <button onClick={() => handleDeleteTask(category, task.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => <TaskManager />;

export default App;
