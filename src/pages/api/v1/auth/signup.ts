import { dbConnect } from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "@/services/user.service";
import nextConnect from "next-connect";
const service = new UserService();
export default nextConnect()
  .use(dbConnect)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const user = await service.createUser(req.body);
      res.status(200).json({
        message: "User created successfully",
        user,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  });
