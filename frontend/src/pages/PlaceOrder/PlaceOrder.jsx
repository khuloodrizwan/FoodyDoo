import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod")
    const [couponCode, setCouponCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [coupons, setCoupons] = useState([])
    const [appliedCoupon, setAppliedCoupon] = useState("")
    const [data, setData] = useState({
        firstName: "", lastName: "", email: "", street: "",
        city: "", state: "", zipcode: "", country: "", phone: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);
    const navigate = useNavigate();

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

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const applyCoupon = async (code) => {
        const codeToApply = code || couponCode
        if (!codeToApply) return
        const response = await axios.post(url + "/api/coupon/apply", {
            code: codeToApply,
            orderAmount: getTotalCartAmount(),
            userId: localStorage.getItem("userId")
        })
        if (response.data.success) {
            setDiscount(response.data.discount)
            setAppliedCoupon(codeToApply)
            setCouponCode(codeToApply)
            toast.success("Coupon Applied!")
        } else {
            toast.error(response.data.message)
        }
    }

    const removeCoupon = () => {
        setDiscount(0)
        setAppliedCoupon("")
        setCouponCode("")
        toast.info("Coupon Removed")
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        })
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge - discount,
            couponCode: appliedCoupon
        }
        if (payment === "razorpay") {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { order, orderId, key_id } = response.data;
                const options = {
                    key: key_id,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Your Company Name",
                    description: "Food Order Payment",
                    order_id: order.id,
                    handler: async function (response) {
                        try {
                            const verifyResponse = await axios.post(url + "/api/order/verify", {
                                orderId: orderId,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            }, { headers: { token } });
                            if (verifyResponse.data.success) {
                                navigate("/myorders");
                                toast.success("Payment Successful");
                                setCartItems({});
                            } else {
                                toast.error("Payment verification failed");
                            }
                        } catch (error) {
                            toast.error("Payment verification error");
                        }
                    },
                    prefill: {
                        name: `${data.firstName} ${data.lastName}`,
                        email: data.email,
                        contact: data.phone
                    },
                    theme: { color: "#3399cc" }
                };
                const razorpayInstance = new window.Razorpay(options);
                razorpayInstance.open();
            } else {
                toast.error("Something Went Wrong")
            }
        } else {
            let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
            if (response.data.success) {
                navigate("/myorders")
                toast.success(response.data.message)
                setCartItems({});
            } else {
                toast.error("Something Went Wrong")
            }
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
        fetchCoupons()
    }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>

            <div className="place-order-right">

                {/* Available Coupon Chips */}
                {coupons.length > 0 && (
                    <div className="available-coupons">
                        <p className="coupons-label">🏷️ Available Coupons:</p>
                        <div className="coupons-strip">
                            {coupons.map((coupon, index) => (
                                <div
                                    key={index}
                                    className={`coupon-chip ${appliedCoupon === coupon.code ? 'chip-active' : ''}`}
                                    onClick={() => appliedCoupon === coupon.code ? removeCoupon() : applyCoupon(coupon.code)}
                                >
                                    <span className="chip-code">{coupon.code}</span>
                                    <span className="chip-discount">₹{coupon.discount} OFF</span>
                                    {appliedCoupon === coupon.code && <span className="chip-check">✓</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cart Totals */}
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Discount</p><p>-{currency}{discount}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge - discount}</b></div>
                    </div>
                </div>

                {/* Manual Coupon Input */}
                <div className="coupon">
                    <h2>Have a Coupon?</h2>
                    <div className="coupon-input">
                        <input
                            type="text"
                            placeholder='Enter coupon code'
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button type='button' onClick={() => applyCoupon()}>Apply</button>
                    </div>
                </div>

                {/* Payment */}
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("razorpay")} className="payment-option">
                        <img src={payment === "razorpay" ? assets.checked : assets.un_checked} alt="" />
                        <p>Razorpay ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
        </form>
    )
}

export default PlaceOrder