import mongoose, { Schema, Document } from "mongoose"

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId
  email: string
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
  answers: Record<string, string>
  createdAt: Date
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    answers: {
      type: Schema.Types.Mixed,
      required: true,
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

export default mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema)

