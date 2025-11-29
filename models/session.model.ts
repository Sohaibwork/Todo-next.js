import mongoose from "mongoose";
import User from "./user.model";

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: User },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 259200,
  },
});

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
