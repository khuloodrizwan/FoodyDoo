import React, { useState, useEffect } from 'react'
import './SeasonalBanner.css'
import axios from 'axios'

const SeasonalBanner = ({ url }) => {

    const [offer, setOffer] = useState(null)

    const fetchOffer = async () => {
        try {
            const response = await axios.get(`${url}/api/coupon/list`)
            if (response.data.success) {
                const today = new Date()
                // Active aur unexpired coupon dhundo
                const activeCoupon = response.data.data.find(coupon =>
                    coupon.isActive && new Date(coupon.expiryDate) > today
                )
                setOffer(activeCoupon || null)
            }
        } catch (error) {
            console.log("Banner error", error)
        }
    }

    useEffect(() => {
        fetchOffer()
    }, [])

    // Season detect karo automatically
    const getSeason = () => {
        const month = new Date().getMonth()
        if (month === 2 || month === 3) return { label: "🌙 Ramadan Special", bg: "#6a0dad" }
        if (month >= 4 && month <= 6) return { label: "☀️ Summer Offer", bg: "#ff6b35" }
        if (month >= 5 && month <= 7) return { label: "🥭 Mango Season", bg: "#f7b731" }
        if (month >= 10 && month <= 11) return { label: "❄️ Winter Special", bg: "#2980b9" }
        return { label: "🎉 Special Offer", bg: "tomato" }
    }

    if (!offer) return null

    const season = getSeason()

    return (
        <div className='seasonal-banner' style={{ backgroundColor: season.bg }}>
            <div className='banner-content'>
                <p className='banner-season'>{season.label}</p>
                <p className='banner-text'>
                    Use code <span className='banner-code'>{offer.code}</span> and get <span className='banner-discount'>₹{offer.discount} OFF</span> on your order!
                </p>
                <p className='banner-expiry'>
                    Offer valid till: {new Date(offer.expiryDate).toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}

export default SeasonalBanner