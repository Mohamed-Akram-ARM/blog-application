const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");
const Blog = require("./models/Blog");
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
const path = require("path");

app.use(express.static(path.join(__dirname, "..")));



// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

//ROOT API
app.get("/", (req, res) => {
    res.json({
        message: "Blog API Server is running"
    });
});

// ================================
// REGISTER API
// ================================
app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered."
            });
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {

        console.error("Register error:", error);

        res.status(500).json({
            message: "Server error."
        });

    }

});

// ================================
// LOGIN API
// ================================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password."
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Login successful
        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error."
        });

    }

});

// ================================
// CREATE BLOG API
// ================================

app.post("/api/blogs", async (req, res) => {

    try {

        const {
            title,
            category,
            image,
            content,
            userId,
            author
        } = req.body;

        if (!title || !content || !userId) {
            return res.status(400).json({
                message: "Title, content and user are required."
            });
        }

        const blog = new Blog({
            title,
            category,
            image,
            content,
            userId,
            author,
            createdAt: new Date()
        });

        await blog.save();

        res.status(201).json({
            message: "Blog published successfully!",
            blog: blog
        });

    } catch (error) {

        console.error("Create blog error:", error);

        res.status(500).json({
            message: "Failed to create blog."
        });

    }

});

// 1. GET ALL BLOGS — for index.html
app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.status(200).json(blogs);
    } catch (error) {
        console.error("Get all blogs error:", error);

        res.status(500).json({
            message: "Failed to load blogs"
        });
    }
});

// 2. GET LOGGED-IN AUTHOR'S BLOGS — for dashboard.html
app.get("/api/my-blogs", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const blogs = await Blog.find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json(blogs);
    } catch (error) {
        console.error("Get my blogs error:", error);

        res.status(500).json({
            message: "Failed to load your blogs"
        });
    }
});

// GET INDIVIDUAL BLOG DETAILS
app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.status(200).json(blog);

    } catch (error) {
        console.error("Get blog details error:", error);

        res.status(500).json({
            message: "Failed to load blog details"
        });
    }
});

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});