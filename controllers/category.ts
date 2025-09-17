import Category from "../models/category";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description?.trim()
    });

    await newCategory.save();

    return res.status(201).json({ 
      message: "Category created successfully",
      data: newCategory 
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { active } = req.query;
    
    const filter: any = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    
    return res.status(200).json({ 
      data: categories,
      count: categories.length 
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ data: category });
  } catch (error) {
    console.error("Error getting category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: categoryId }
      });

      if (existingCategory) {
        return res.status(400).json({ message: "Category name already exists" });
      }
    }

    // Update fields
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description?.trim();
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json({ 
      message: "Category updated successfully",
      data: category 
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category is being used by any videos
    const Video = require("../models/video").default;
    const videoCount = await Video.countDocuments({ category: categoryId });
    
    if (videoCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. ${videoCount} video(s) are using this category.` 
      });
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
