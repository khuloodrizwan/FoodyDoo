import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usedBy: { type: Array, default: [] }  
})

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);
export default couponModel;