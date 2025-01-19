// src/types/express/index.d.ts
import { IUser } from "../../models/primary/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // or user: IUser | null if you want to allow null
      files: Express.Multer.File[];
    }
  }
}
