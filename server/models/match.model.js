import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  players: [{ 
    type: String, 
    required: true }],
  result: { 
    type: String, 
    required: true },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Match", MatchSchema);
