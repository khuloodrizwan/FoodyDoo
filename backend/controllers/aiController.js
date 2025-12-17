import Groq from 'groq-sdk';
import foodModel from '../models/foodModel.js';
import orderModel from '../models/orderModel.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Get AI food recommendations with enhanced data
const getAIRecommendation = async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Fetch all available foods with more details
    const foods = await foodModel.find({});
    
    // Fetch user's order history if userId provided
    let orderHistory = [];
    if (userId) {
      const orders = await orderModel.find({ userId }).limit(5).sort({ date: -1 });
      orderHistory = orders.map(order => order.items).flat();
    }

    // Prepare food data with nutrition info
    const foodList = foods.map(food => ({
      id: food._id,
      name: food.name,
      category: food.category,
      price: food.price,
      description: food.description,
      image: food.image,
      // Mock nutrition data (you can add real data to your food model)
      nutrition: {
        calories: Math.floor(Math.random() * 500) + 200,
        protein: Math.floor(Math.random() * 30) + 5,
        carbs: Math.floor(Math.random() * 50) + 10,
        fat: Math.floor(Math.random() * 20) + 2
      }
    }));

    // Build enhanced context for AI
    const systemPrompt = `You are a helpful food recommendation assistant for Foodydoo, a food delivery platform. 
    
Available foods with details: ${JSON.stringify(foodList)}

${orderHistory.length > 0 ? `User's recent orders: ${JSON.stringify(orderHistory)}` : ''}

When recommending food:
1. Suggest 3-5 specific dishes from the available menu
2. Include the food ID, name, price in ₹
3. Mention key nutrition info (calories, protein)
4. Give brief, friendly reasons for each recommendation
5. If asked about nutrition, provide detailed breakdown
6. If user mentions dietary preferences (veg, spicy, healthy), filter accordingly

Format your response in a conversational way, but include food IDs in square brackets like [ID: 673abc...] so we can display images.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 800
    });

    const aiResponse = completion.choices[0].message.content;

    // Extract food IDs from response
    const foodIdRegex = /\[ID: ([a-f0-9]+)\]/g;
    const mentionedFoodIds = [];
    let match;
    
    while ((match = foodIdRegex.exec(aiResponse)) !== null) {
      mentionedFoodIds.push(match[1]);
    }

    // Get full food details for mentioned foods
    const recommendedFoods = foods.filter(food => 
      mentionedFoodIds.includes(food._id.toString())
    );

    res.json({
      success: true,
      response: aiResponse,
      recommendedFoods: recommendedFoods.map(food => ({
        id: food._id,
        name: food.name,
        category: food.category,
        price: food.price,
        description: food.description,
        image: food.image,
        nutrition: {
          calories: Math.floor(Math.random() * 500) + 200,
          protein: Math.floor(Math.random() * 30) + 5,
          carbs: Math.floor(Math.random() * 50) + 10,
          fat: Math.floor(Math.random() * 20) + 2
        }
      }))
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.json({
      success: false,
      message: "Failed to get AI recommendation",
      error: error.message
    });
  }
};

// Search menu
const searchMenu = async (req, res) => {
  try {
    const { query } = req.body;

    const foods = await foodModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json({
      success: true,
      results: foods
    });

  } catch (error) {
    console.error("Search error:", error);
    res.json({
      success: false,
      message: "Search failed"
    });
  }
};

// Get quick suggestions
const getQuickSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "What should I order today?",
      "Suggest vegetarian dishes under ₹200",
      "Recommend spicy food",
      "What's popular on the menu?",
      "Suggest healthy low-calorie options",
      "Show me high-protein meals",
      "Recommend desserts"
    ];

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    res.json({
      success: false,
      message: "Failed to get suggestions"
    });
  }
};

export { getAIRecommendation, getQuickSuggestions, searchMenu };