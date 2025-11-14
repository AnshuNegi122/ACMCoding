import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "admin" | "participant"
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "participant"],
      default: "participant",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

