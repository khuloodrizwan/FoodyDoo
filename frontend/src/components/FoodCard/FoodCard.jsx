import React, { useState } from 'react';
import './FoodCard.css';

const FoodCard = ({ food, url, onAddToCart, onAddToFavorite, isFavorited }) => {
  const [showNutrition, setShowNutrition] = useState(false);

  return (
    <div className="food-card">
      <div className="food-card-image">
        <img 
          src={food.image ? `${url}/images/${food.image}` : `${url}/images/food_1.png`} 
          alt={food.name} 
        />
        <button 
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={() => onAddToFavorite(food)}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="food-card-content">
        <div className="food-card-header">
          <h3>{food.name}</h3>
          <span className="food-price">₹{food.price}</span>
        </div>
        
        <p className="food-category">{food.category}</p>
        <p className="food-description">{food.description}</p>
        
        {food.nutrition && (
          <div className="nutrition-section">
            <button 
              className="nutrition-toggle"
              onClick={() => setShowNutrition(!showNutrition)}
            >
              {showNutrition ? '▼' : '▶'} Nutrition Info
            </button>
            
            {showNutrition && (
              <div className="nutrition-details">
                <div className="nutrition-item">
                  <span>Calories:</span>
                  <strong>{food.nutrition.calories} kcal</strong>
                </div>
                <div className="nutrition-item">
                  <span>Protein:</span>
                  <strong>{food.nutrition.protein}g</strong>
                </div>
                <div className="nutrition-item">
                  <span>Carbs:</span>
                  <strong>{food.nutrition.carbs}g</strong>
                </div>
                <div className="nutrition-item">
                  <span>Fat:</span>
                  <strong>{food.nutrition.fat}g</strong>
                </div>
              </div>
            )}
          </div>
        )}
        
        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart(food._id || food.id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;