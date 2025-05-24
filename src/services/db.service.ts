import axios from "axios";
import { models } from "@/models";

export class dbService {
  private publicKey = process.env.MONGODB_ATLAS_PUBLIC_KEY!;
  private privateKey = process.env.MONGODB_ATLAS_PRIVATE_KEY!;
  private projectId = process.env.MONGODB_ATLAS_PROJECT_ID!;

  private getAuthHeader() {
    const auth = Buffer.from(`${this.publicKey}:${this.privateKey}`).toString("base64");
    return `Basic ${auth}`;
  }

  public async createDb(data: any) {
    const clusterName = `user-${data.userId}`;

    // Step 1: Create the cluster
    const clusterPayload = {
      name: clusterName,
      clusterType: "REPLICASET",
      providerSettings: {
        providerName: "AWS",
        instanceSizeName: "M0",
        regionName: "US_EAST_1",
      },
    };

    try {
      await axios.post(
        `https://cloud.mongodb.com/api/atlas/v1.0/groups/${this.projectId}/clusters`,
        clusterPayload,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err: any) {
      console.error("Cluster creation failed:", err.response?.data || err.message);
      throw new Error("Cluster creation failed");
    }

    // Step 2: Create DB user
    const dbUsername = data.dbEmail.replace(/[^a-zA-Z0-9]/g, "_"); // safe username
    try {
      await axios.post(
        `https://cloud.mongodb.com/api/atlas/v1.0/groups/${this.projectId}/databaseUsers`,
        {
          databaseName: "admin",
          username: dbUsername,
          password: data.dbPassword,
          roles: [
            {
              roleName: "readWriteAnyDatabase",
              databaseName: "admin",
            },
          ],
        },
        {
          headers: {
            Authorization: this.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err: any) {
      console.error("User creation failed:", err.response?.data || err.message);
      throw new Error("User creation failed");
    }

    // Step 3: Save to your database
    const dbUrl = `mongodb+srv://${dbUsername}:${data.dbPassword}@${clusterName}.mongodb.net/${data.dbName}?retryWrites=true&w=majority&appName=${clusterName}`;

    const db = await models.Db.create({
      userId: data.userId,
      dbName: data.dbName,
      dbEmail: data.dbEmail,
      dbPassword: data.dbPassword,
      dbUrl: dbUrl,
      clusterName: clusterName,
    });

    return db;
  }

  public async getDb(userId: string) {
    const dbs = await models.Db.find({ userId }).populate("userId");
    return dbs;
  }
}
