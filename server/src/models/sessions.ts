import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String,
        session: Object,
        expires: Date,
    },
    { strict: false, collection: "sessions" }
);

export default mongoose.models.Sessions || mongoose.model("Sessions", schema);
