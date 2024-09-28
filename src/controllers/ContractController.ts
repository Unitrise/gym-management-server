import { Request, Response } from 'express';
import Contract from '../models/Contract';

export class ContractController {
  public async getAllContracts(req: Request, res: Response) {
    try {
      const contracts = await Contract.find().populate('memberId');
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching contracts' });
    }
  }

  public async createContract(req: Request, res: Response) {
    const { memberId, contractDetails, startDate, endDate } = req.body;
    try {
      const newContract = new Contract({
        memberId,
        contractDetails,
        startDate,
        endDate,
      });
      await newContract.save();
      res.json(newContract);
    } catch (error) {
      res.status(400).json({ error: 'Error creating contract' });
    }
  }

  public async updateContract(req: Request, res: Response) {
    try {
      const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedContract) {
        return res.status(404).json({ error: 'Contract not found' });
      }
      res.json(updatedContract);
    } catch (error) {
      res.status(400).json({ error: 'Error updating contract' });
    }
  }

  public async deleteContract(req: Request, res: Response) {
    try {
      const result = await Contract.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Contract not found' });
      }
      res.json({ message: 'Contract deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting contract' });
    }
  }
}

export default new ContractController();