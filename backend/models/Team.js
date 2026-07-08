import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false },
);

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    track: {
      type: String,
      required: true,
      trim: true,
    },
    teamSize: {
      type: Number,
      required: true,
      min: 1,
    },
    ideaPitch: {
      type: String,
      required: true,
      trim: true,
    },
    leader: {
      type: participantSchema,
      required: true,
    },
    members: {
      type: [participantSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'round1', 'round2', 'winner', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

teamSchema.index({ teamName: 1 }, { unique: true });
teamSchema.index({ 'leader.email': 1 }, { unique: true });
teamSchema.index({ status: 1 });
teamSchema.index({ track: 1 });
teamSchema.index({ collegeName: 1 });

export const Team = mongoose.model('Team', teamSchema);
