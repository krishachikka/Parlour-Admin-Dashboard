// USER SCHEMA FOR DB
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
});

export default mongoose.model("User", userSchema);