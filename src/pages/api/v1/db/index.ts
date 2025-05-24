import { dbConnect } from "@/lib/dbConnect";
import { NextApiResponse } from "next";
import { dbService } from "@/services/db.service";
import nextConnect from "next-connect";
import { authCheckMiddleware } from "@/middleware/authCheckMiddleware";

const service = new dbService();

export default nextConnect()
  .use(dbConnect)
  .use(authCheckMiddleware)
  .post(async (req: any, res: NextApiResponse) => {
    try {
      const data = {
        ...req.body,
        userId: req.user._id,
      };
      const dbInfo = await service.createDb(data);
      res.status(200).json({
        message: "MongoDB Cluster & User Created Successfully",
        db: dbInfo,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  })
  .get(async (req: any, res: NextApiResponse) => {
    try {
      const dbs = await service.getDb(req.user._id);
      res.status(200).json({
        message: "Fetched user's DBs successfully",
        dbs,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
