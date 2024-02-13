import express, { Request, Response } from "express";

const buildApp = async () => {
  const app = express();

  app.get("/test-running", (_: Request, res: Response) => {
    res.send("API is running");
  });

  return app
};

export default buildApp
