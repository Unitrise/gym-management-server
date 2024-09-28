import { AbstractRoute } from "./AbstractRoute";
import InventoryController from "../controllers/InventoryController";

class InventoryRoutes extends AbstractRoute {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/inventory", InventoryController.getAll);
    this.router.post("/inventory", InventoryController.create);
    this.router.get("/inventory/:id", InventoryController.getById);
    this.router.put("/inventory/:id", InventoryController.update);
    this.router.delete("/inventory/:id", InventoryController.delete);
  }
}

export default InventoryRoutes;
