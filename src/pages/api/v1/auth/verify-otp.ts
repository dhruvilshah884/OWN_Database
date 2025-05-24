import { dbConnect } from "@/lib/dbConnect";
import { NextApiResponse } from "next";
import { UserService } from "@/services/user.service";
import nextConnect from "next-connect";
import { authCheckMiddleware } from "@/middleware/authCheckMiddleware";
const service = new UserService();
export default nextConnect()
  .use(dbConnect)
  .use(authCheckMiddleware)
  .post(async (req: any, res: NextApiResponse) => {
    try {
      const user = await service.verifyUser(req.user._id, req.body.otp);
      res.status(200).json({
        message: "User Verified successfully",
        user,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  });
