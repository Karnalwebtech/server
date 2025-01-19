"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// -----------create token and save in  cookies
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield user.getJWT_token();
    //-------------   options for cookie
    const option = {
        expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        path: "/",
        secure: true, // accessible through HTTP
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
});
exports.default = sendToken;
