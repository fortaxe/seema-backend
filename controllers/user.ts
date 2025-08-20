import User from "../models/user.ts";
import { createUserSchema, editUserSchema, deleteUserSchema } from "../validations/user.ts";
import { Request, Response } from "express";

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await createUserSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }

    const { firstName, lastName, email, phone, message, subject } = result.data;

    const user = new User({ firstName, lastName, email, phone, message, subject, role: "user" });

    const savedUser = await user.save();
    
    res.status(201).json({
      message: "User created successfully",
      data: savedUser
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
  

    // Find the user by ID
    const user = await User.find({ role: "user" })

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ data: user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const result = await deleteUserSchema.safeParse(req.body);

    if (!result.success) {
       res.status(400).json({ error: result.error });
       return
    }

    const { userId } = result.data;

    // Find the user by ID
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
       res.status(404).json({ message: "User not found" });
       return
    }

    res
      .status(200)
      .json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const result = await editUserSchema.safeParse(req.body);

    if (!result.success) {
       res.status(400).json({ error: result.error });
       return
    }

    const { firstName, lastName, email, phone, message, subject,  } = result.data;

    // Find the user by ID
    const user = await User.findOne({ _id: userId, role: "user" });
    if (!user) {
       res.status(404).json({ message: "User not found" });
       return
    }

      // Update the user's firstName, lastName, email, phone, and message
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.phone = phone;
      user.message = message;
      user.subject = subject;
    // Save the updated user
    await user.save();
    res
      .status(200)
      .json({ data: user });
  } catch (err: any) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId, role: "user" });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ data: user });
  } catch (err: any) {
    console.error("Error getting user by ID:", err);
    res.status(500).json({ error: err.message });
  }
};