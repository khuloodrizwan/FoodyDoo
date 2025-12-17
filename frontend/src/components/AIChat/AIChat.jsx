import React, { useState, useRef, useEffect, useContext } from 'react';
import './AIChat.css';
import axios from 'axios';
import FoodCard from '../FoodCard/FoodCard';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const AIChat = ({ url, token }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef(null);
  const { addToCart, cartItems } = useContext(StoreContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchSuggestions();
    if (token) {
      loadChatHistory();
      loadFavorites();
    } else {
      setMessages([
        { role: 'assistant', content: 'Hi! I\'m your AI food assistant. Ask me anything about our menu or get personalized recommendations!' }
      ]);
    }
  }, [token]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${url}/api/ai/suggestions`);
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await axios.post(
        `${url}/api/chat/history`,
        { userId: 'user' },
        { headers: { token } }
      );
      
      if (response.data.success && response.data.messages.length > 0) {
        setMessages(response.data.messages);
      } else {
        setMessages([
          { role: 'assistant', content: 'Hi! I\'m your AI food assistant. Ask me anything about our menu or get personalized recommendations!' }
        ]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages([
        { role: 'assistant', content: 'Hi! I\'m your AI food assistant. Ask me anything about our menu or get personalized recommendations!' }
      ]);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await axios.post(
        `${url}/api/favorite/list`,
        { userId: 'user' },
        { headers: { token } }
      );
      
      if (response.data.success) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveChatMessage = async (role, content) => {
    if (!token) return;
    
    try {
      await axios.post(
        `${url}/api/chat/save`,
        { userId: 'user', role, content },
        { headers: { token } }
      );
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const clearHistory = async () => {
    if (!token) {
      toast.error("Please login to clear history");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/chat/clear`,
        { userId: 'user' },
        { headers: { token } }
      );
      
      if (response.data.success) {
        setMessages([
          { role: 'assistant', content: 'Hi! I\'m your AI food assistant. Ask me anything about our menu or get personalized recommendations!' }
        ]);
        setRecommendedFoods([]);
        toast.success("Chat history cleared");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
    }
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Save user message
    saveChatMessage('user', messageText);

    try {
      const response = await axios.post(
        `${url}/api/ai/recommend`,
        {
          message: messageText,
          userId: token ? 'user' : null
        },
        token ? { headers: { token } } : {}
      );

      if (response.data.success) {
        const aiMessage = { role: 'assistant', content: response.data.response };
        setMessages(prev => [...prev, aiMessage]);
        
        // Save AI response
        saveChatMessage('assistant', response.data.response);
        
        // Set recommended foods if available
        if (response.data.recommendedFoods && response.data.recommendedFoods.length > 0) {
          setRecommendedFoods(response.data.recommendedFoods);
        }
      } else {
        const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setShowSearch(true);
    try {
      const response = await axios.post(`${url}/api/ai/search`, {
        query: searchQuery
      });

      if (response.data.success) {
        setSearchResults(response.data.results);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleAddToCart = (food) => {
    addToCart(food._id || food.id);
    toast.success(`${food.name} added to cart!`);
  };

  const handleAddToFavorite = async (food) => {
    if (!token) {
      toast.error("Please login to add favorites");
      return;
    }

    const isFavorited = favorites.some(fav => fav.foodId === (food._id || food.id));

    if (isFavorited) {
      // Remove from favorites
      try {
        const response = await axios.post(
          `${url}/api/favorite/remove`,
          { userId: 'user', foodId: food._id || food.id },
          { headers: { token } }
        );

        if (response.data.success) {
          setFavorites(prev => prev.filter(fav => fav.foodId !== (food._id || food.id)));
          toast.success("Removed from favorites");
        }
      } catch (error) {
        console.error("Error removing favorite:", error);
        toast.error("Failed to remove favorite");
      }
    } else {
      // Add to favorites
      try {
        const response = await axios.post(
          `${url}/api/favorite/add`,
          {
            userId: 'user',
            foodId: food._id || food.id,
            foodName: food.name,
            recommendation: `AI recommended: ${food.name}`
          },
          { headers: { token } }
        );

        if (response.data.success) {
          setFavorites(prev => [...prev, {
            foodId: food._id || food.id,
            foodName: food.name
          }]);
          toast.success("Added to favorites!");
        }
      } catch (error) {
        console.error("Error adding favorite:", error);
        toast.error(error.response?.data?.message || "Failed to add favorite");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="ai-chat-container">
      {/* Search Bar */}
      <div className="chat-search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search menu while chatting..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        {token && (
          <button onClick={clearHistory} className="clear-history-btn">
            🗑️ Clear History
          </button>
        )}
      </div>

      {/* Search Results */}
      {showSearch && searchResults.length > 0 && (
        <div className="search-results-section">
          <div className="search-results-header">
            <h3>Search Results ({searchResults.length})</h3>
            <button onClick={() => setShowSearch(false)}>✕</button>
          </div>
          <div className="search-results-grid">
            {searchResults.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onAddToCart={handleAddToCart}
                onAddToFavorite={handleAddToFavorite}
                isFavorited={favorites.some(fav => fav.foodId === food._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* Recommended Foods Cards */}
        {recommendedFoods.length > 0 && (
          <div className="recommended-foods-section">
            <h3>🍽️ Recommended Dishes</h3>
            <div className="recommended-foods-grid">
              {recommendedFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onAddToCart={handleAddToCart}
                  onAddToFavorite={handleAddToFavorite}
                  isFavorited={favorites.some(fav => fav.foodId === food.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {suggestions.length > 0 && messages.length <= 1 && (
        <div className="quick-suggestions">
          <p>Quick suggestions:</p>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-btn"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about food..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChat;