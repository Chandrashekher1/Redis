import mongoose from "mongoose";
import Redis from "ioredis";
import express from "express";

const app = express()

const redis = new Redis("redis://localhost:6379")

app.get('/redis', async (req, res) => {
    const reply = await redis.ping()
    res.json({ message: reply })
})

const url = 'mongodb://localhost:27017/redis_aur_mongo'

app.get('/mongo', async (req, res) => {
    await mongoose.connect(url)
    res.json({ message: 'Connected to MongoDB successfully!' })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})