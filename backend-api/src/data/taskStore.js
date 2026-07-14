import { initialTasks } from "./initialTasks.js";

const cloneTask = (task) => ({
  ...task,
});

const createInitialTasks = () => initialTasks.map(cloneTask);

let tasks = createInitialTasks();

const calculateNextTaskId = () =>
  tasks.reduce((highestId, task) => Math.max(highestId, task.id), 0) + 1;

let nextTaskId = calculateNextTaskId();

export const resetTasks = () => {
  tasks = createInitialTasks();
  nextTaskId = calculateNextTaskId();
};

export const getAllTasks = () => tasks.map(cloneTask);

export const getTaskById = (taskId) => {
  const task = tasks.find((currentTask) => currentTask.id === taskId);

  return task ? cloneTask(task) : undefined;
};

export const createTaskRecord = ({ title }) => {
  const newTask = {
    id: nextTaskId,
    title,
    completed: false,
  };

  nextTaskId += 1;
  tasks.push(newTask);

  return cloneTask(newTask);
};

export const updateTaskRecord = (taskId, updates) => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return undefined;
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
  };

  return cloneTask(tasks[taskIndex]);
};

export const deleteTaskRecord = (taskId) => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);

  return true;
};
