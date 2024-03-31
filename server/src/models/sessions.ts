import mongoose from "mongoose";

// Managed by connect mongo
const schema = new mongoose.Schema({}, { strict: false, collection: "sessions" });

export default mongoose.models.Sessions || mongoose.model("Sessions", schema);
