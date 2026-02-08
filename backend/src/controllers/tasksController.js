import * as taskService from "../services/taskService.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask({
      userId: req.user.id,
      data: req.body
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask({
      userId: req.user.id,
      taskId: req.params.id,
      data: req.body
    });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask({
      userId: req.user.id,
      taskId: req.params.id
    });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const listTasks = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 20);
    const result = await taskService.listTasks({
      userId: req.user.id,
      filters: req.query,
      page,
      pageSize
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createSubtask = async (req, res, next) => {
  try {
    const sub = await taskService.createSubtask({
      userId: req.user.id,
      taskId: req.params.id,
      title: req.body.title
    });
    res.status(201).json(sub);
  } catch (err) {
    next(err);
  }
};

export const updateSubtask = async (req, res, next) => {
  try {
    const sub = await taskService.updateSubtask({
      userId: req.user.id,
      subtaskId: req.params.subtaskId,
      data: req.body
    });
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

export const deleteSubtask = async (req, res, next) => {
  try {
    const sub = await taskService.deleteSubtask({
      userId: req.user.id,
      subtaskId: req.params.subtaskId
    });
    res.json(sub);
  } catch (err) {
    next(err);
  }
};
