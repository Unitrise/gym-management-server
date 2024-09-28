import { Request, Response } from 'express';
import ClassModel, { IClass } from '../models/Classes';
import logger from '../services/LoggerService';

export class ClassController {
  // Get all classes
  static async getAllClasses(req: Request, res: Response) {
    try {
      const classes = await ClassModel.find().populate('attendees'); // Populate with member data
      res.json(classes);
      logger.info('Classes fetched successfully');
    } catch (error) {
      logger.error('Error fetching classes', error);
      res.status(500).json({ error: 'Error fetching classes' });
    }
  }

  // Get class by ID
  static async getClassById(req: Request, res: Response) {
    try {
      const classItem = await ClassModel.findById(req.params.id).populate('attendees');
      if (!classItem) {
        return res.status(404).json({ error: 'Class not found' });
      }
      res.json(classItem);
      logger.info('Class fetched successfully');
    } catch (error) {
      logger.error('Error fetching class', error);
      res.status(500).json({ error: 'Error fetching class' });
    }
  }

  // Create new class
  static async createClass(req: Request, res: Response) {
    const { name, instructor, date, time, capacity, description } = req.body;
    try {
      const newClass = new ClassModel({
        name,
        instructor,
        date,
        time,
        capacity,
        description,
      });
      await newClass.save();
      res.json(newClass);
      logger.info('Class created successfully');
    } catch (error) {
      logger.error('Error creating class', error);
      res.status(400).json({ error: 'Error creating class' });
    }
  }

  // Update class
  static async updateClass(req: Request, res: Response) {
    try {
      const updatedClass = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedClass) {
        return res.status(404).json({ error: 'Class not found' });
      }
      res.json(updatedClass);
      logger.info('Class updated successfully');
    } catch (error) {
      logger.error('Error updating class', error);
      res.status(400).json({ error: 'Error updating class' });
    }
  }

  // Delete class
  static async deleteClass(req: Request, res: Response) {
    try {
      const deletedClass = await ClassModel.findByIdAndDelete(req.params.id);
      if (!deletedClass) {
        return res.status(404).json({ error: 'Class not found' });
      }
      res.json({ message: 'Class deleted successfully' });
      logger.info('Class deleted successfully');
    } catch (error) {
      logger.error('Error deleting class', error);
      res.status(500).json({ error: 'Error deleting class' });
    }
  }

  // Add attendee (member) to class
  static async addAttendee(req: Request, res: Response) {
    try {
      const classItem = await ClassModel.findById(req.params.id);
      if (!classItem) {
        return res.status(404).json({ error: 'Class not found' });
      }
      classItem.attendees.push(req.body.memberId); // Add member to attendees
      await classItem.save();
      res.json(classItem);
      logger.info('Member added to class successfully');
    } catch (error) {
      logger.error('Error adding attendee', error);
      res.status(500).json({ error: 'Error adding attendee' });
    }
  }
}
