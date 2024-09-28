import { Request, Response } from "express";
import { AbstractRoute } from "./AbstractRoute";
import { MemberController } from "../controllers/memberController";

class MemberRoutes extends AbstractRoute {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/members", MemberController.getAllMembers);
    this.router.post("/members", MemberController.createMember);
    this.router.get("/members/:id", MemberController.getMemberById);
    this.router.put("/members/:id", async (req,res) => {await MemberController.updateMember(req,res)});
    this.router.delete("/members/:id", async (req,res) => {await MemberController.deleteMember(req,res)});
    this.router.post("/members/:id/add-attendance", async (req,res) => {await MemberController.updateMemberAttendance(req,res)});

    // Additional routes can be added here
  }


}

export default MemberRoutes;
