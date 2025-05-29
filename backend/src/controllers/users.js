import User from "../models/User.js";

export const getUser = async (req, res) => {
  res.json({ users: [] });
};

export const getUserFriends = async (req, res) => {};

export const addRemoveFriend = async (req, res) => {};
