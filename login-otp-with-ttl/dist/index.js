"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const redis = new ioredis_1.default("redis://localhost:6379");
function otpKey(phoneNo) {
    return `otp:${phoneNo}`;
}
app.post("/otp", async (req, res) => {
    const { phoneNo } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    await redis.set(otpKey(phoneNo), otp.toString(), 'EX', '30');
    res.json({ message: "OTP sent successfully", otp });
});
app.post("/otp/verify", async (req, res) => {
    const { phoneNo, otp } = req.body;
    const savedOtp = await redis.get(otpKey(phoneNo));
    if (!savedOtp) {
        return res.json({ message: "OTP not found or expired" });
    }
    if (savedOtp !== otp) {
        return res.json({ message: "Invalid OTP" });
    }
    await redis.del(otpKey(phoneNo));
    res.json({ message: "OTP verified successfully" });
});
app.get("/otp/:phoneNo/ttl", async (req, res) => {
    const { phoneNo } = req.params;
    const ttl = await redis.ttl(otpKey(phoneNo));
    res.json({ ttl });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map