const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JSON database files
const usersFile = path.join(__dirname, "data", "users.json");
const blogsFile = path.join(__dirname, "data", "blogs.json");

// Make sure data folder/files exist
const dataFolder = path.join(__dirname, "data");

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
}

if (!fs.existsSync(blogsFile)) {
    fs.writeFileSync(blogsFile, "[]");
}

// Read JSON file
function readData(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
        return [];
    }
}

// Write JSON file
function writeData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


// ==========================================
// HOME / SERVER TEST
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: "Blog API Server is running"
    });
});


// ==========================================
// REGISTER
// ==========================================

app.post("/api/register", (req, res) => {

    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill in all fields"
        });
    }

    const users = readData(usersFile);

    // Check existing email
    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        return res.status(400).json({
            message: "Email already registered"
        });
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);

    writeData(usersFile, users);

    res.status(201).json({
        message: "Registration successful",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});


// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const users = readData(usersFile);

    const user = users.find(
        user =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});


// ==========================================
// CREATE BLOG
// ==========================================

app.post("/api/blogs", (req, res) => {

    const {
        title,
        category,
        image,
        content,
        userId
    } = req.body;

    if (!title || !category || !content || !userId) {
        return res.status(400).json({
            message: "Title, content and user ID are required"
        });
    }

    const blogs = readData(blogsFile);

    const newBlog = {
        id: blogs.length + 1,
        title: title,
        category: category,
        image: image,
        content: content,
        userId: Number(userId),
        createdAt: new Date().toISOString()
    };

    blogs.push(newBlog);

    writeData(blogsFile, blogs);

    res.status(201).json({
        message: "Blog created successfully",
        blog: newBlog
    });
});


// ==========================================
// GET ALL BLOGS
// ==========================================

app.get("/api/blogs", (req, res) => {

    const blogs = readData(blogsFile);

    res.json(blogs);
});


// ==========================================
// GET SINGLE BLOG
// ==========================================

app.get("/api/blogs/:id", (req, res) => {

    const blogs = readData(blogsFile);

    const blog = blogs.find(
        blog => blog.id === Number(req.params.id)
    );

    if (!blog) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    res.json(blog);
});


// ==========================================
// DELETE BLOG
// ==========================================

app.delete("/api/blogs/:id", (req, res) => {

    const blogs = readData(blogsFile);

    const blogId = Number(req.params.id);

    const blogExists = blogs.find(
        blog => blog.id === blogId
    );

    if (!blogExists) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    const updatedBlogs = blogs.filter(
        blog => blog.id !== blogId
    );

    writeData(blogsFile, updatedBlogs);

    res.json({
        message: "Blog deleted successfully"
    });
});


// ==========================================
// SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});