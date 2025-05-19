import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middlewares/auth";

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    
  const user = await User.findById(req.user.id);
  res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(user);
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const users = await User.find();
  res.json(users);
};
