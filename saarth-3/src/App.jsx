import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceTasks = [...tasks[source.droppableId]];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const destinationTasks = [...tasks[destination.droppableId]];
    destinationTasks.splice(destination.index, 0, movedTask);
    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destinationTasks,
    });
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-columns">
          {Object.keys(tasks).map((category) => (
            <Droppable droppableId={category} key={category}>
              {(provided) => (
                <div className="task-column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h3>{category.toUpperCase()}</h3>
                  {tasks[category].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h4>{task.title}</h4>
                          <p>{task.description}</p>
                          <div className="task-actions">
                            {category !== "done" && (
                              <>
                                {category === "todo" && (
                                  <button onClick={() => handleMoveTask(category, task.id, "inProgress")}>
                                    Move to In Progress
                                  </button>
                                )}
                                {category === "inProgress" && (
                                  <button onClick={() => handleMoveTask(category, task.id, "done")}>
                                    Move to Done
                                  </button>
                                )}
                              </>
                            )}
                            <button onClick={() => handleDeleteTask(category, task.id)}>Delete</button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const App = () => <TaskManager />;

export default App;