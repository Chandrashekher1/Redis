import express from 'express'
import Redis from 'ioredis'

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

function otpKey(phoneNo: any) {
    return `otp:${phoneNo}`;
}

app.post("/otp", async (req, res) => {
    const { phoneNo } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    await redis.set(otpKey(phoneNo), otp.toString(), 'EX', '30');
    res.json({ message: "OTP sent successfully", otp });
})


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

})

app.get("/otp/:phoneNo/ttl", async (req, res) => {
    const { phoneNo } = req.params;
    const ttl = await redis.ttl(otpKey(phoneNo));
    res.json({ ttl });
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})