import React, { useState, useEffect } from 'react'
import './Analytics.css'
import axios from 'axios'

const Analytics = ({ url }) => {

    const [data, setData] = useState(null)
    const [investment, setInvestment] = useState("")
    const [profit, setProfit] = useState(null)

    const fetchAnalytics = async () => {
        const response = await axios.get(`${url}/api/analytics/get`)
        if (response.data.success) {
            setData(response.data.data)
        }
    }

    const calculateProfit = () => {
        if (data && investment) {
            const result = data.annualRevenue - Number(investment)
            setProfit(result)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [])

    return (
        <div className='analytics'>
            <p className='analytics-title'>Analytics Dashboard</p>

            {data ? (
                <>
                    {/* Cards */}
                    <div className="analytics-cards">
                        <div className="analytics-card">
                            <h3>📦 Monthly Orders</h3>
                            <p>{data.monthlyOrders}</p>
                        </div>
                        <div className="analytics-card">
                            <h3>📦 Annual Orders</h3>
                            <p>{data.annualOrders}</p>
                        </div>
                        <div className="analytics-card">
                            <h3>💰 Monthly Revenue</h3>
                            <p>₹{data.monthlyRevenue}</p>
                        </div>
                        <div className="analytics-card">
                            <h3>💰 Annual Revenue</h3>
                            <p>₹{data.annualRevenue}</p>
                        </div>
                    </div>

                    {/* Profit/Loss Calculator */}
                    <div className="profit-section">
                        <p className='analytics-title'>Profit / Loss Calculator</p>
                        <div className="profit-input">
                            <input
                                type="number"
                                placeholder='Enter Total Investment (₹)'
                                value={investment}
                                onChange={(e) => setInvestment(e.target.value)}
                            />
                            <button onClick={calculateProfit}>Calculate</button>
                        </div>
                        {profit !== null && (
                            <div className={`profit-result ${profit >= 0 ? 'profit' : 'loss'}`}>
                                {profit >= 0
                                    ? `✅ Profit: ₹${profit}`
                                    : `❌ Loss: ₹${Math.abs(profit)}`
                                }
                            </div>
                        )}
                    </div>

                    {/* Monthly Chart */}
                    <div className="monthly-chart">
                        <p className='analytics-title'>Monthly Orders Chart</p>
                        <div className="chart">
                            {data.monthlyData.map((item, index) => (
                                <div key={index} className="chart-bar">
                                    <div
                                        className="bar"
                                        style={{ height: `${item.orders * 10}px` }}
                                    ></div>
                                    <p>{item.month}</p>
                                    <p>{item.orders}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Analytics