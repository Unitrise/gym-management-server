import { Request, Response } from 'express';
import Member from '../models/Member';
import logger from '../services/LoggerService';

export class MemberController {
  static async getAllMembers(req: Request, res: Response) {
    try {
      const members = await Member.find();
      res.json(members);
      logger.info('Members fetched successfully'); // Log success message
    } catch (error) {
        logger.error('Error fetching members', error); // Log error message
      res.status(500).json({ error: 'Error fetching members' });
    }
  }

  static async getMemberById(req: Request, res: Response) {
    try {
      const member = await Member.findById(req.params.id);
      if (!member) {
        logger.error('Member not found'); // Log error message
        res.status(404).json({ error: 'Member not found' });
      } else {
        logger.info('Member fetched successfully'); // Log success message
        res.json(member);
      }
    } catch (error) {
        logger.error('Error fetching member', error); // Log error
      res.status(500).json({ error: 'Error fetching member' });
    }
  }





  static async createMember(req: Request, res: Response) {
    const {
      name,
      email,
      phone,
      address,
      membership,
      emergencyContact,
      progress,
      loyalty,
    } = req.body;
  
    try {
      const newMember = new Member({
        name,
        email,
        phone,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
        },
        membership: {
          type: membership.type,
          status: membership.status || 'Active', // Default to 'Active'
          startDate: membership.startDate,
          endDate: membership.endDate,
          renewalDate: membership.renewalDate || null, // Optional field
        },
        emergencyContact: {
          name: emergencyContact.name,
          phone: emergencyContact.phone,
          relation: emergencyContact.relation,
        },
        progress: {
          fitnessGoals: progress.fitnessGoals || '',
          milestones: progress.milestones || [],
        },
        loyalty: {
          points: loyalty.points || 0,
          rewards: loyalty.rewards || [],
        },
      });
  
      await newMember.save();
      logger.info('Member created successfully');
      res.json(newMember);
    } catch (error:any) {
      logger.error('Error creating member', error);
      res.status(400).json({ error: 'Error creating member', details: error.message });
    }
  }
  

  static async updateMember(req: Request, res: Response) {
    try {
      const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedMember) {
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json(updatedMember);
      logger.info('Member updated successfully'); // Log success message    
    } catch (error) {
        logger.error('Error updating member', error); // Log error message
      res.status(400).json({ error: 'Error updating member' });
    }
  }

  static async deleteMember(req: Request, res: Response) {
    try {
      const result = await Member.findByIdAndDelete(req.params.id);
      if (!result) {
        logger.error('Member not found'); // Log error message
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json({ message: 'Member deleted' });
      logger.info('Member deleted successfully'); // Log success message
    } catch (error) {
        logger.error('Error deleting member', error); // Log error message
      res.status(500).json({ error: 'Error deleting member' });
    }
  }

  static async updateMemberAttendance(req: Request, res: Response) {
    try {
      const member = await Member.findById(req.params.id);
        if (!member) {
            logger.error('Member not found'); // Log error message
            return res.status(404).json({ error: 'Member not found' });
        }
        member.attendance.checkIns.push({ date: new Date(), method: req.body.checkInMethod });
        member.attendance.lastCheckIn = new Date();
        member.attendance.totalCheckIns += 1;
        member.loyalty.points += 10; // Add 10 loyalty points for each check-in
        await member.save();
        logger.info('Member attendance updated successfully'); // Log success message
        res.json(member);
    } catch (error) {
        logger.error('Error updating member attendance', error); // Log error message
        res.status(500).json({ error: 'Error updating member attendance' });
    }

}
}
