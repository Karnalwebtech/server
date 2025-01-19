import { NextFunction, Request, Response } from "express";
import UserService from "../../../services/crm/userService";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import ErrorHandler from "../../../utils/ErrorHandler";
import sendToken from "../../../utils/jwtToken";

class UserController {
  constructor(private userService: UserService) {}
  logout = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const option: any = {
        expires: new Date(),
        path: "/",
        secure: true, // accessible through HTTP
        httpOnly: true, // only server can access the cookie
        sameSite: "none", // enforcement type
        partitioned: false,
      };
      res.status(200).cookie("token", null, option).json({
        success: true,
      });
    }
  );
  register = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.userService.registerUser(req.body, next);
      res.status(201).json({ succes: true, user });
    }
  );
  profile = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json({ succes: true });
    }
  );

  login = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const user = await this.userService.authenticateUser(
        email,
        password,
        next
      );
      if (!user) {
        return next(new ErrorHandler("Invalid credentials", 404));
      }
      await sendToken(user, 200, res);
    }
  );

  getAllUsers = AsyncHandler.handle(async (req: Request, res: Response) => {
    const query = req.query;

    const resultPerpage = Number(query.rowsPerPage);

    const result = await this.userService.getAllUsers(query);
    const data_counter = await this.userService.data_counter(query);
    if (result) {
      return res.status(201).json({
        success: true,
        result,
        resultPerpage,
        data_counter,
      });
    }
  });

  getUserById = AsyncHandler.handle(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    res.status(200).json({ user });
  });

  updateUser = AsyncHandler.handle(async (req: Request, res: Response) => {
    const user = await this.userService.updateUser(req.params.id, req.body);
    res.status(200).json({ user });
  });

  deleteUser = AsyncHandler.handle(async (req: Request, res: Response) => {
    await this.userService.deleteUser(req.params.id);
    res.status(204).send();
  });
  status_update = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("id not found", 404));
      }
      const result = await this.userService.status_update(id, next);
      if (result) {
        return res.status(201).json({
          success: true,
        });
      }
    }
  );
}

export default UserController;
