import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    weight: { type: Number, required: true, min: 1 },
    icon: { type: String },
    schedule: {
      type: [String],
      enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      default: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    },
  },
  { _id: false },
)

const userDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    tasks: {
      type: [taskSchema],
      default: [],
    },
    records: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
  },
  { timestamps: true },
)

export const UserData = mongoose.model('UserData', userDataSchema)
