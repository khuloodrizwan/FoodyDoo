import React, { useContext, useEffect, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${url}/api/coupon/list`)
      if (response.data.success) {
        const today = new Date()
        const activeCoupons = response.data.data.filter(coupon =>
          coupon.isActive && new Date(coupon.expiryDate) > today
        )
        setCoupons(activeCoupons)
      }
    } catch (error) {
      console.log("Coupon fetch error", error)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  return (
    <div className='cart'>

      {/* Available Coupons Strip */}
      {coupons.length > 0 && (
        <div className="available-coupons">
          <p className="coupons-label">🏷️ Available Coupons:</p>
          <div className="coupons-strip">
            {coupons.map((coupon, index) => (
              <div key={index} className="coupon-chip">
                <span className="chip-code">{coupon.code}</span>
                <span className="chip-discount">₹{coupon.discount} OFF</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (<div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={url + "/images/" + item.image} alt="" />
                <p>{item.name}</p>
                <p>₹{item.price}</p>
                <div>{cartItems[item._id]}</div>
                <p>₹{item.price * cartItems[item._id]}</p>
                <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
              </div>
              <hr />
            </div>)
          }
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b></div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        
      </div>
    </div>
  )
}

export default Cart