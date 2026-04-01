import React, { useState, useEffect, useContext } from 'react';
import './Favorites.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, token, addToCart, food_list } = useContext(StoreContext);

  useEffect(() => {
    if (token) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadFavorites = async () => {
    try {
      const response = await axios.post(
        `${url}/api/favorite/list`,
        { userId: 'user' },
        { headers: { token } }
      );

      if (response.data.success) {
        // Match favorites with food_list to get full details
        const favoritesWithDetails = response.data.favorites.map(fav => {
          const foodDetails = food_list.find(food => food._id === fav.foodId);
          return {
            ...fav,
            foodDetails: foodDetails || null
          };
        });
        setFavorites(favoritesWithDetails);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setLoading(false);
    }
  };

  const removeFavorite = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/favorite/remove`,
        { userId: 'user', foodId },
        { headers: { token } }
      );

      if (response.data.success) {
        setFavorites(prev => prev.filter(fav => fav.foodId !== foodId));
        toast.success("Removed from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove favorite");
    }
  };

  const handleAddToCart = (foodId) => {
    addToCart(foodId);
    toast.success('Added to cart!');
  };

  if (!token) {
    return (
      <div className="favorites-page">
        <div className="favorites-empty">
          <h2>❤️ My Favorites</h2>
          <p>Please login to view your favorite recommendations</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-loading">
          <p>Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-empty">
          <h2>❤️ My Favorites</h2>
          <p>You haven't added any favorites yet!</p>
          <p>Chat with AI Assistant and save your favorite recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>❤️ My Favorites</h1>
        <p>{favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      <div className="favorites-grid">
        {favorites.map((fav) => (
          <div key={fav._id} className="favorite-card">
            {fav.foodDetails ? (
              <>
                <div className="favorite-card-image">
                  <img 
                    src={`${url}/images/${fav.foodDetails.image}`} 
                    alt={fav.foodName} 
                  />
                  <button 
                    className="remove-favorite-btn"
                    onClick={() => removeFavorite(fav.foodId)}
                  >
                    ❤️
                  </button>
                </div>
                <div className="favorite-card-content">
                  <h3>{fav.foodName}</h3>
                  <p className="favorite-category">{fav.foodDetails.category}</p>
                  <p className="favorite-description">{fav.foodDetails.description}</p>
                  <p className="favorite-recommendation">{fav.recommendation}</p>
                  <div className="favorite-card-footer">
                    <span className="favorite-price">₹{fav.foodDetails.price}</span> 
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(fav.foodId)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="favorite-card-content">
                <h3>{fav.foodName}</h3>
                <p className="favorite-recommendation">{fav.recommendation}</p>
                <button 
                  className="remove-favorite-btn-alt"
                  onClick={() => removeFavorite(fav.foodId)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;