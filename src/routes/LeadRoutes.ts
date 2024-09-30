import { AbstractRoute } from "./AbstractRoute";
import LeadController from "../controllers/LeadController";

class LeadRoutes extends AbstractRoute {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes(): void {
    // Route to get all leads
    this.router.get("/leads", LeadController.getAllLeads);

    // Route to create a new lead
    this.router.post("/leads", LeadController.createLead);

    // Route to get a lead by ID
    this.router.get("/leads/:id", async (req,res) => {await LeadController.getLeadByID(req,res)});

    // Route to update a lead
    this.router.put("/leads/:id", async  (req,res) => {await LeadController.updateLead(req,res)});

    // Route to delete a lead
    this.router.delete("/leads/:id",async  (req,res) => {await LeadController.deleteLead(req,res)});

    // Route to convert a lead to a member
    this.router.post("/leads/:id/convert", async  (req,res) => { await LeadController.createMemberFromLead (req,res)});

    this.router.post('/leads/:id/notes', async (req, res) => { await LeadController.addNoteToLead(req, res) });

    this.router.delete('/leads/:id/notes/:noteId', async (req, res) => { await LeadController.deleteNoteFromLead(req, res) });

    this.router.put('/leads/:id/notes/:noteId', async (req, res) => { await LeadController.updateNoteInLead(req, res) });

    this.router.get('/leads/:id/notes', async (req, res) => { await LeadController.getLeadNotes(req, res) });

  }
}

export default LeadRoutes;
