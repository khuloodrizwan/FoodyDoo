import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  foodId: { type: String, required: true },
  foodName: { type: String, required: true },
  recommendation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const favoriteModel = mongoose.models.favorite || mongoose.model("favorite", favoriteSchema);

export default favoriteModel;