import { dbConnectMiddleware } from "@/middleware/dbConnectMiddleware";

export const dbConnect = async (req: any, res: any, next: any) => {
  await dbConnectMiddleware();
  next();
};
