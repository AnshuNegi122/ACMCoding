import mongoose, { Schema, Document } from "mongoose"

export interface IQuestion extends Document {
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: "A" | "B" | "C" | "D"
  createdAt: Date
}

const QuestionSchema = new Schema<IQuestion>(
  {
    text: {
      type: String,
      required: true,
      maxlength: 500,
    },
    optionA: {
      type: String,
      required: true,
    },
    optionB: {
      type: String,
      required: true,
    },
    optionC: {
      type: String,
      required: true,
    },
    optionD: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
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

export default mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema)

