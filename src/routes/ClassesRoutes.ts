import { Router } from 'express';
import { ClassController } from '../controllers/ClassesController';
import { AbstractRoute } from './AbstractRoute';

class ClassRoutes extends AbstractRoute {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/classes', ClassController.getAllClasses); // Get all classes
    this.router.get('/classes/:id', async (req,res) => {await ClassController.getClassById(req,res)}); // Get class by ID
    this.router.post('/classes',async (req,res) => {await ClassController.createClass(req,res)}); // Create new class
    this.router.put('/classes/:id', async (req,res) => {await ClassController.updateClass(req,res)}); // Update class
    this.router.delete('/classes/:id', async (req,res) => { await ClassController.deleteClass(req,res)}); // Delete class
    this.router.post('/classes/:id/add-attendee',async (req,res) => {await ClassController.addAttendee(req,res)}); // Add member to class
  }
}

export default ClassRoutes;
