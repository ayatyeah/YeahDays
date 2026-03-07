import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    id: { type: String, required: true },
    name: { type: String, required: true },
    weight: { type: Number, required: true, min: 1 },
    icon: { type: String },
    schedule: {
      type: [String],
      enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      default: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    },
    plannedDate: {
      type: String,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    reminderTime: {
      type: String,
      match: /^\d{2}:\d{2}$/,
    },
  },
  { timestamps: true },
)

taskSchema.index({ userId: 1, id: 1 }, { unique: true })

export const Task = mongoose.model('Task', taskSchema)
