import { Request, Response } from 'express';
import LeadModel, { ILead } from '../models/Lead';
import MemberModel, { IMember } from '../models/Member'; // Import Member model for lead conversion
import logger from '../services/LoggerService';

export class LeadController {
  // Get all leads
  static async getAllLeads(req: Request, res: Response) {
    try {
      const leads = await LeadModel.find();
      res.json(leads);
      logger.info('Leads fetched successfully');
    } catch (error) {
      logger.error('Error fetching leads', error);
      res.status(500).json({ error: 'Error fetching leads' });
    }
  }

  // Get lead by ID
  static async getLeadByID(req: Request, res: Response) {
    try {
      const lead = await LeadModel.findById(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      res.json(lead);
      logger.info('Lead fetched successfully');
    } catch (error) {
      logger.error('Error fetching lead', error);
      res.status(500).json({ error: 'Error fetching lead' });
    }
  }

  // Create new lead
  static async createLead(req: Request, res: Response) {
    const { name, email, phone, contactMethod, interest, status } = req.body;
    try {
      const newLead = new LeadModel({
        name,
        email,
        phone,
        contactMethod,
        interest,
        status
      });
      await newLead.save();
      res.json(newLead);
      logger.info('Lead created successfully');
    } catch (error) {
      logger.error('Error creating lead', error);
      res.status(400).json({ error: 'Error creating lead' });
    }
  }

  // Update lead
  static async updateLead(req: Request, res: Response) {
    try {
      const updatedLead = await LeadModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedLead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      res.json(updatedLead);
      logger.info('Lead updated successfully');
    } catch (error) {
      logger.error('Error updating lead', error);
      res.status(400).json({ error: 'Error updating lead' });
    }
  }

  // Delete lead
  static async deleteLead(req: Request, res: Response) {
    try {
      const deletedLead = await LeadModel.findByIdAndDelete(req.params.id);
      if (!deletedLead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      res.json({ message: 'Lead deleted successfully' });
      logger.info('Lead deleted successfully');
    } catch (error) {
      logger.error('Error deleting lead', error);
      res.status(500).json({ error: 'Error deleting lead' });
    }
  }


  static async addNoteToLead(req: Request, res: Response) {
    try {
      const { message, author } = req.body;
      const lead = await LeadModel.findById(req.params.id); // Use _id for finding lead
  
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
  
      // Ensure notes array is initialized
      if (!Array.isArray(lead.notes)) {
        lead.notes = [];
      }
  
      lead.notes.push({ message, author, date: new Date() });
      await lead.save();
  
      res.json(lead);
      logger.info('Note added to lead successfully');
    } catch (error) {
      logger.error('Error adding note to lead', error);
      res.status(500).json({ error: 'Error adding note to lead' });
    }
  }
  

  static async deleteNoteFromLead(req: Request, res: Response) {
    try {
      const lead = await LeadModel.findById(req.params.id); // Use _id instead of email
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
  
      if (!Array.isArray(lead.notes)) {
        return res.status(404).json({ error: 'No notes to delete' });
      }
  
      // Filter notes and check _id
      lead.notes = lead.notes.filter((note:any) => note && note._id.toString() !== req.params.noteId);
      await lead.save();
  
      res.json(lead);
      logger.info('Note deleted from lead successfully');
    } catch (error) {
      logger.error('Error deleting note from lead', error);
      res.status(500).json({ error: 'Error deleting note from lead' });
    }
  }
  

  static async updateNoteInLead(req: Request, res: Response) {
    try {
      const lead = await LeadModel.findById(req.params.id); // Use _id instead of email
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
  
      const noteIndex = lead.notes.findIndex((note: any) => note._id.toString() === req.params.noteId);
      if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      // Update note with new values, ensure to update the date
      lead.notes[noteIndex] = { 
        ...lead.notes[noteIndex], 
        ...req.body.note, 
        date: new Date()  // Update date on edit
      };
      await lead.save();
  
      res.json(lead);
      logger.info('Note updated in lead successfully');
    } catch (error) {
      logger.error('Error updating note in lead', error);
      res.status(500).json({ error: 'Error updating note in lead' });
    }
  }
  

  static async getLeadNotes(req: Request, res: Response) {
    try {
      const lead = await LeadModel.findById(req.params.id); // Use _id instead of email
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
  
      res.json({ notes: lead.notes });
      logger.info('Lead notes fetched successfully');
    } catch (error) {
      logger.error('Error fetching lead notes', error);
      res.status(500).json({ error: 'Error fetching lead notes' });
    }
  }
  

  // Convert lead to member
  static async createMemberFromLead(req: Request, res: Response) {
    try {
      const lead = await LeadModel.findById(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      const { name, email, phone } = lead;
      
      // Convert lead to member
      const newMember = new MemberModel({
        name,
        email,
        phone,
        membership: {
          type: 'Standard',  // Default membership type, can be modified
          status: 'Active',
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))  // 1-year membership
        },
        attendance: {
          checkIns: [],
          lastCheckIn: null,
          totalCheckIns: 0,
        },
        payments: {
          history: [],
          nextDueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          recurringBilling: false,
        },
        progress: {
          fitnessGoals: 'TBD',
          milestones: []
        },
        loyalty: {
          points: 0,
          rewards: []
        },
        emergencyContact: {
          name: 'N/A',
          phone: 'N/A',
          relation: 'N/A'
        },
      });

      await newMember.save();

      // Mark lead as converted
      lead.isConverted = true;
      await lead.deleteOne();

      res.json({ message: 'Lead converted to member successfully', member: newMember });
      logger.info('Lead converted to member successfully');
    } catch (error) {
      logger.error('Error converting lead to member', error);
      res.status(500).json({ error: 'Error converting lead to member' });
    }
  }
}

export default LeadController;
