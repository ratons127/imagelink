import * as listService from "../services/listService.js";

export const createList = async (req, res, next) => {
  try {
    const list = await listService.createList({
      userId: req.user.id,
      name: req.body.name
    });
    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
};

export const getLists = async (req, res, next) => {
  try {
    const lists = await listService.getLists({ userId: req.user.id });
    res.json(lists);
  } catch (err) {
    next(err);
  }
};

export const updateList = async (req, res, next) => {
  try {
    const list = await listService.updateList({
      listId: req.params.id,
      userId: req.user.id,
      name: req.body.name
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const deleteList = async (req, res, next) => {
  try {
    const list = await listService.deleteList({
      listId: req.params.id,
      userId: req.user.id
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const member = await listService.addMember({
      listId: req.params.id,
      userId: req.user.id,
      memberId: req.body.userId,
      role: req.body.role
    });
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const result = await listService.removeMember({
      listId: req.params.id,
      userId: req.user.id,
      memberId: req.params.userId
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
