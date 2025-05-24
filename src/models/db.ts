import mongoose from "mongoose";

const dbSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dbName: {
    type: String,
    required: true,
  },
  dbEmail: {
    type: String,
    required: true,
  },
  dbPassword: {
    type: String,
    required: true,
  },
  dbUrl: {
    type: String,
  },
},{timestamps:true,versionKey:false});
export const DbModel = mongoose.models.dbs || mongoose.model("dbs", dbSchema);
