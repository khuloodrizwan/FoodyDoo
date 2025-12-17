import favoriteModel from '../models/favoriteModel.js';

// Add to favorites
const addFavorite = async (req, res) => {
  try {
    const { userId, foodId, foodName, recommendation } = req.body;

    // Check if already favorited
    const existingFavorite = await favoriteModel.findOne({ userId, foodId });
    
    if (existingFavorite) {
      return res.json({
        success: false,
        message: "Already in favorites"
      });
    }

    const favorite = new favoriteModel({
      userId,
      foodId,
      foodName,
      recommendation
    });

    await favorite.save();

    res.json({
      success: true,
      message: "Added to favorites"
    });

  } catch (error) {
    console.error("Add favorite error:", error);
    res.json({
      success: false,
      message: "Failed to add favorite"
    });
  }
};

// Get user favorites
const getFavorites = async (req, res) => {
  try {
    const { userId } = req.body;

    const favorites = await favoriteModel.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      favorites
    });

  } catch (error) {
    console.error("Get favorites error:", error);
    res.json({
      success: false,
      message: "Failed to get favorites"
    });
  }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
  try {
    const { userId, foodId } = req.body;

    await favoriteModel.findOneAndDelete({ userId, foodId });

    res.json({
      success: true,
      message: "Removed from favorites"
    });

  } catch (error) {
    console.error("Remove favorite error:", error);
    res.json({
      success: false,
      message: "Failed to remove favorite"
    });
  }
};

export { addFavorite, getFavorites, removeFavorite };