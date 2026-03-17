import React, { useState, useEffect } from 'react'
import './Coupons.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Coupons = ({ url }) => {

    const [coupons, setCoupons] = useState([])
    const [data, setData] = useState({
        code: "",
        discount: "",
        expiryDate: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const fetchCoupons = async () => {
        const response = await axios.get(`${url}/api/coupon/list`)
        if (response.data.success) {
            setCoupons(response.data.data)
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        const response = await axios.post(`${url}/api/coupon/create`, data)
        if (response.data.success) {
            toast.success("Coupon Created!")
            setData({ code: "", discount: "", expiryDate: "" })
            fetchCoupons()
        } else {
            toast.error("Error creating coupon")
        }
    }

    const deleteCoupon = async (id) => {
        const response = await axios.post(`${url}/api/coupon/delete`, { id })
        if (response.data.success) {
            toast.success("Coupon Deleted!")
            fetchCoupons()
        } else {
            toast.error("Error deleting coupon")
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    return (
        <div className='coupons'>
            <div className="coupon-form">
                <p className='coupon-title'>Add New Coupon</p>
                <form className='flex-col' onSubmit={onSubmitHandler}>
                    <div className='flex-col'>
                        <p>Coupon Code</p>
                        <input
                            name='code'
                            onChange={onChangeHandler}
                            value={data.code}
                            type="text"
                            placeholder='e.g. SAVE20'
                            required
                        />
                    </div>
                    <div className='flex-col'>
                        <p>Discount Amount (₹)</p>
                        <input
                            name='discount'
                            onChange={onChangeHandler}
                            value={data.discount}
                            type="number"
                            placeholder='e.g. 50'
                            required
                        />
                    </div>
                    <div className='flex-col'>
                        <p>Expiry Date</p>
                        <input
                            name='expiryDate'
                            onChange={onChangeHandler}
                            value={data.expiryDate}
                            type="date"
                            required
                        />
                    </div>
                    <button type='submit' className='add-btn'>ADD COUPON</button>
                </form>
            </div>

            <div className="coupon-list">
                <p className='coupon-title'>All Coupons</p>
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Expiry Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon, index) => (
                            <tr key={index}>
                                <td>{coupon.code}</td>
                                <td>₹{coupon.discount}</td>
                                <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => deleteCoupon(coupon._id)} className='delete-btn'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Coupons