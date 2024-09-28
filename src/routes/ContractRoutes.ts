import ContractController from "../controllers/ContractController";
import { AbstractRoute } from "./AbstractRoute";

class ContractRoutes extends AbstractRoute {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/contracts", ContractController.getAllContracts);
    this.router.post("/contracts", ContractController.createContract);
    this.router.put("/contracts/:id", async (req, res) => {await ContractController.updateContract(req, res)});
    this.router.delete("/contracts/:id",async (req, res) => {await ContractController.deleteContract(req, res)});
  }
}

export default ContractRoutes;
