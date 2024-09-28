import { Router } from "express";

export interface IRoute {
  initRoutes(): void;
  getRouter(): Router;
}
