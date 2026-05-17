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
const BANNER_KEY = "app:banners";
app.post("/banner", async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "welcom to our testing website.");
    res.json({ success: true });
});
app.get("/banner", async (req, res) => {
    const message = await redis.get(BANNER_KEY);
    res.json({ message });
});
app.delete("/banner", async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({ success: true });
});
app.get('/banner/exists', async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({ exists: exists });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
// 
//# sourceMappingURL=index.js.map