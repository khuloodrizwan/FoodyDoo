import couponModel from "../models/couponModel.js";

// Admin - coupon banao
const createCoupon = async (req, res) => {
    try {
        const { code, discount, expiryDate } = req.body;
        const coupon = new couponModel({ code, discount, expiryDate });
        await coupon.save();
        res.json({ success: true, message: "Coupon Created!" })
    } catch (error) {
        res.json({ success: false, message: "Error creating coupon" })
    }
}

// Admin - sab coupons dekho
const listCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({});
        res.json({ success: true, data: coupons })
    } catch (error) {
        res.json({ success: false, message: "Error fetching coupons" })
    }
}

// Admin - coupon delete karo
const deleteCoupon = async (req, res) => {
    try {
        await couponModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Coupon Deleted!" })
    } catch (error) {
        res.json({ success: false, message: "Error deleting coupon" })
    }
}

// User - coupon apply karo
const applyCoupon = async (req, res) => {
    try {
        const coupon = await couponModel.findOne({ code: req.body.code, isActive: true });

        if (!coupon) {
            return res.json({ success: false, message: "Invalid Coupon" })
        }
        if (coupon.expiryDate < Date.now()) {
            return res.json({ success: false, message: "Coupon Expired" })
        }

        // Order amount check
        const orderAmount = req.body.orderAmount;
        if (orderAmount <= coupon.discount) {
            return res.json({
                success: false,
                message: `Minimum order amount must be more than ₹${coupon.discount} to apply this coupon!`
            })
        }

        // Check — yeh user pehle use kar chuka hai?
        const userId = req.body.userId;
        if (coupon.usedBy.includes(userId)) {
            return res.json({ success: false, message: "You have already used this coupon!" })
        }

        res.json({ success: true, discount: coupon.discount })
    } catch (error) {
        res.json({ success: false, message: "Error applying coupon" })
    }
}

export { createCoupon, listCoupons, deleteCoupon, applyCoupon }