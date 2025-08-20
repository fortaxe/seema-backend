import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.ts";
import { createAdminSchema, editAdminSchema } from "../validations/auth.ts";
import { Request, Response } from "express";

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await createAdminSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }

    const { email, password } = result.data;

    // Find admin user by email
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
       res.status(400).send("Invalid credentials");
       return
    }

    // Check if admin has a valid password
    if (!admin.password) {
       res.status(500).send("Admin password is missing or invalid");
       return
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcryptjs.compare(password, admin.password);

    if (!isMatch) {
       res.status(400).send("Invalid credentials");
       return
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET as string
    );

    res.send({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createAdmin = async (req: Request, res: Response): Promise<void>  => {
  try {
    const result = await createAdminSchema.safeParse(req.body);

    if (!result.success) {
       res.status(400).json({ error: result.error });
       return
    }

    const { email, password } = result.data;

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
       res.status(400).json({ error: "Admin account already exists" });
       return
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new admin
    const admin = new User({ email, password: hashedPassword, role: "admin" });

    // Save the admin
    await admin.save();
    res.status(201).json("Admin created successfully");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const editAdmin = async (req: Request, res: Response): Promise<void>  => {
  try {
 
    
    
    const result = await editAdminSchema.safeParse(req.body);

    if (!result.success) {
       res.status(400).json({ error: result.error });
       return
    }

    const { newEmail, newPassword, confirmPassword } = result.data;

    // Check if passwords match
    if (newPassword && newPassword !== confirmPassword) {
       res.status(400).json({ message: "Passwords do not match" });
       return
    }

    // Find the admin by ID
    const admin = await User.findOne({  role: "admin" });
    if (!admin) {
       res.status(404).json({ message: "Admin not found" });
       return
    }

    // Hash the new password if provided
    if (newPassword) {
      admin.password = await bcryptjs.hash(newPassword, 10);
    }

    // Update the admin's email if provided
    admin.email = newEmail || admin.email;

    // Save the updated admin
    await admin.save();
    res
      .status(200)
      .json({ message: "Admin email and password updated successfully" });
  } catch (err: any) {
    console.error("Error updating admin email and password:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAdmin = async (req: Request, res: Response): Promise<void>  => {
  try {
    const admin = await User.findOne({ role: "admin" });
    res.status(200).json(admin);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


