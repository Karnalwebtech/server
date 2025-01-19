import { Request, Response, NextFunction } from "express";

class AsyncHandler {
  public handle(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((error: unknown) => {
        if (!res.headersSent) { // Check if the headers have already been sent
          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred" });
          }
        }
      });
    };
  }
}

export default new AsyncHandler();
