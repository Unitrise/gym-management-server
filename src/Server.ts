import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/UserRoutes";
import InventoryRoutes from "./routes/InventoryRoutes";
import ContractRoutes from "./routes/ContractRoutes";
import logger from "./services/LoggerService"; // Import the logger
import ClassesRoutes from "./routes/ClassesRoutes";
import MemberRoutes from "./routes/MembersRoutes";

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = 5000; // Port number can be from environment variables
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.connectToDatabase();
    this.initializeErrorHandling();

  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors({
        origin: "*",
        methods: ["*"],
        allowedHeaders: ["*"]
        
        
    }));
  }

  private initializeErrorHandling(): void {
    // Catch 404 errors and forward to error handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const error = new Error("Not Found");
      res.status(404);
      next(error);
    });

    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      res.status(500).json({ message: "An unexpected error occurred" });
    });
  }

  private initializeRoutes(): void {
    const userRoutes = new UserRoutes();
    const inventoryRoutes = new InventoryRoutes();
    const contractRoutes = new ContractRoutes();
    const memberRoutes = new MemberRoutes();
    const classesRoutes = new ClassesRoutes();

    this.app.use("/api", userRoutes.getRouter());
    this.app.use("/api", inventoryRoutes.getRouter());
    this.app.use("/api", contractRoutes.getRouter());
    this.app.use("/api", memberRoutes.getRouter());
    this.app.use("/api", classesRoutes.getRouter());

  }

  private connectToDatabase(): void {
    mongoose.connect("mongodb://localhost:27017/gym_management", {}).then(() => {
      console.log("Connected to MongoDB");
    }).catch(err => {
      console.error("MongoDB connection error:", err);
    });
  }

  

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

export default Server;
