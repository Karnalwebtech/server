import { Response } from "express";
import { IUser } from "../models/primary/userModel";

// -----------create token and save in  cookies
const sendToken = async (user: IUser, statusCode: number, res: Response) => {
  const token = await user.getJWT_token();
  //-------------   options for cookie

  const option:any = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    path: "/",
    secure: true,// accessible through HTTP
    httpOnly: true, // only server can access the cookie
    sameSite: "none", // enforcement type
    partitioned: false, 
  };
  res.status(statusCode)
  // .cookie("token", token, option)
  .json({
    success: true,
    token,
    user,
  });
};

export default sendToken;
