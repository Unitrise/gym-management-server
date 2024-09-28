import { Request, Response } from "express";
import { IController } from "../interfaces/Icontroller";
import Inventory from "../models/User"; // Assuming you have an Inventory model

class InventoryController implements IController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const items = await Inventory.find();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching inventory" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const item = new Inventory(req.body);
      await item.save();
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Error creating item" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const item = await Inventory.findById(req.params.id);
      if (!item) {
        res.status(404).json({ message: "Item not found" });
      } else {
        res.json(item);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching item" });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!item) {
        res.status(404).json({ message: "Item not found" });
      } else {
        res.json(item);
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating item" });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const item = await Inventory.findByIdAndDelete(req.params.id);
      if (!item) {
        res.status(404).json({ message: "Item not found" });
      } else {
        res.json({ message: "Item deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting item" });
    }
  }
}

export default new InventoryController();
