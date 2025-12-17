import chatHistoryModel from '../models/chatHistoryModel.js';

// Save chat message
const saveChatMessage = async (req, res) => {
  try {
    const { userId, role, content } = req.body;

    let chatHistory = await chatHistoryModel.findOne({ userId });

    if (!chatHistory) {
      chatHistory = new chatHistoryModel({
        userId,
        messages: [{ role, content }]
      });
    } else {
      chatHistory.messages.push({ role, content });
      
      // Keep only last 50 messages
      if (chatHistory.messages.length > 50) {
        chatHistory.messages = chatHistory.messages.slice(-50);
      }
    }

    await chatHistory.save();

    res.json({
      success: true,
      message: "Chat saved"
    });

  } catch (error) {
    console.error("Save chat error:", error);
    res.json({
      success: false,
      message: "Failed to save chat"
    });
  }
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    const chatHistory = await chatHistoryModel.findOne({ userId });

    if (!chatHistory) {
      return res.json({
        success: true,
        messages: []
      });
    }

    res.json({
      success: true,
      messages: chatHistory.messages
    });

  } catch (error) {
    console.error("Get chat error:", error);
    res.json({
      success: false,
      message: "Failed to get chat history"
    });
  }
};

// Clear chat history
const clearChatHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    await chatHistoryModel.findOneAndDelete({ userId });

    res.json({
      success: true,
      message: "Chat history cleared"
    });

  } catch (error) {
    console.error("Clear chat error:", error);
    res.json({
      success: false,
      message: "Failed to clear chat"
    });
  }
};

export { saveChatMessage, getChatHistory, clearChatHistory };