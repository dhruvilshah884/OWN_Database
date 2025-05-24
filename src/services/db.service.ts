import { models } from "@/models";

export class dbService {
  public async createDb(data: any) {
    const dbUrl = `mongodb+srv://${data.dbEmail}:${data.dbPassword}@cluster0.aeq9bm1.mongodb.net/${data.dbName}?retryWrites=true&w=majority&appName=Cluster0`;
    const db = await models.Db.create({
      userId: data.userId,
      dbName: data.dbName,
      dbEmail: data.dbEmail,
      dbPassword: data.dbPassword,
      dbUrl: dbUrl,
    });
    return db;
  }
  public async getDb(userId: string) {
    const db = await models.Db.find({ userId: userId }).populate("userId")
    return db;
  }
}
