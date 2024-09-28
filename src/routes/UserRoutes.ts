import { AbstractRoute } from "./AbstractRoute";
import UserController from "../controllers/UserController";

class UserRoutes extends AbstractRoute {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/users", UserController.getAll);
    this.router.post("/users", UserController.create);
    this.router.get("/users/:id", UserController.getById);
    this.router.get("/users/email/:email", UserController.getByEmail);
    this.router.post("/auth/login", UserController.login);
    this.router.put("/users/:id", UserController.update);
    this.router.get("/auth/me", UserController.getMe);  // Add the "me" route
    this.router.delete("/users/:id", UserController.delete);
  }
}

export default UserRoutes;
