import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [
    {
      role: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const chatHistoryModel = mongoose.models.chatHistory || mongoose.model("chatHistory", chatHistorySchema);

export default chatHistoryModel;