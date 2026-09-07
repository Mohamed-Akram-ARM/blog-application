// ================================
// Blog Application - script.js
// ================================

// Wait until the HTML page is loaded
document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // Mobile Menu
    // ================================

    const menuButton = document.querySelector(".menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    if (menuButton && navMenu) {
        menuButton.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }


    // ================================
    // Login Form
    // ================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (e) {

            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please enter email and password.");
                return;
            }

            if (!validateEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:5000/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    alert("Login successful!");

                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user || data)
                    );

                    window.location.href = "dashboard.html";

                } else {

                    alert(data.message || "Login failed.");

                }

            } catch (error) {

                console.error("Login error:", error);

                alert("Cannot connect to backend server.");

            }

        });

    }


    // ================================
    // Register Form
    // ================================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async function (e) {

            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            // Check empty fields
            if (!name || !email || !password) {

                alert("Please fill all fields.");

                return;
            }

            // Check email
            if (!validateEmail(email)) {

                alert("Please enter a valid email address.");

                return;
            }

            try {

                console.log("Sending registration data...");

                const response = await fetch(
                    "http://localhost:5000/api/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password
                        })
                    }
                );

                const data = await response.json();

                console.log("Register response:", data);

                if (response.ok) {

                    alert(
                        data.message ||
                        "Registration successful!"
                    );

                    registerForm.reset();

                    window.location.href = "login.html";

                } else {

                    alert(
                        data.message ||
                        "Registration failed."
                    );

                }

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                alert(
                    "Cannot connect to backend server. " +
                    "Make sure your server is running on port 5000."
                );

            }

        });

    }


    // ================================
    // Create Blog Form
    // ================================

    const createBlogForm =
        document.getElementById("createBlogForm");

    if (createBlogForm) {

        createBlogForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();

                const title =
                    document.getElementById("title").value.trim();

                const category =
                    document.getElementById("category").value;

                const image =
                    document.getElementById("image").value.trim();

                const content =
                    document.getElementById("content").value.trim();


                // Get logged-in user
                const savedUser =
                    localStorage.getItem("user");

                if (!savedUser) {

                    alert("Please login first.");

                    window.location.href = "login.html";

                    return;
                }

                const user = JSON.parse(savedUser);


                if (!title || !content) {

                    alert(
                        "Please enter blog title and content."
                    );

                    return;
                }


                try {

                    const response = await fetch(
                        "http://localhost:5000/api/blogs",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({

                                title: title,

                                category: category,

                                image: image,

                                content: content,

                                userId: user.id || user._id,

                                author:
                                    user.name ||
                                    user.email ||
                                    "Unknown",

                                createdAt:
                                    new Date().toISOString()

                            })
                        }
                    );

                    const data = await response.json();


                    if (response.ok) {

                        alert(
                            "Blog published successfully!"
                        );

                        localStorage.removeItem("editBlog");

                        createBlogForm.reset();

                        window.location.href =
                            "dashboard.html";

                    } else {

                        alert(
                            data.message ||
                            "Failed to publish blog."
                        );

                    }

                } catch (error) {

                    console.error(
                        "Create blog error:",
                        error
                    );

                    alert(
                        "Cannot connect to backend server."
                    );

                }

            }
        );

    }


    // ================================
    // Dashboard - Load Blogs
    // ================================

    const blogList =
        document.getElementById("blogList");


    async function loadBlogs() {

        if (!blogList) {
            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/blogs"
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to load blogs."
                );

            }


            const blogs = await response.json();


            if (!Array.isArray(blogs) ||
                blogs.length === 0) {

                blogList.innerHTML = `

                    <div class="no-blogs">

                        <i class="fa-solid fa-newspaper"></i>

                        <h2>No Blogs Yet</h2>

                        <p>
                            Create your first blog
                            to get started.
                        </p>

                        <a
                            href="create_blog.html"
                            class="btn"
                        >
                            Create Blog
                        </a>

                    </div>

                `;

                return;
            }


            blogList.innerHTML = blogs.map(
                function (blog) {

                    return `

                    <div class="blog-card">

                        ${blog.image
                            ?
                            `
                            <img
                                src="${blog.image}"
                                alt="${blog.title}"
                            >
                            `
                            :
                            `
                            <div class="no-image">

                                <i class="fa-solid fa-image"></i>

                            </div>
                            `
                        }


                        <div class="content">

                            <span class="category">

                                ${blog.category || "General"}

                            </span>


                            <h3>

                                ${blog.title || "Untitled"}

                            </h3>


                            <p>

                                ${blog.content || ""}

                            </p>


                            <small>

                                <i
                                    class="fa-regular fa-calendar"
                                ></i>

                                ${blog.createdAt
                            ?
                            new Date(
                                blog.createdAt
                            ).toLocaleDateString()
                            :
                            "No date"
                        }

                            </small>


                            <div class="blog-actions">

                                <button
                                    class="edit-btn"
                                    onclick="editBlog('${blog.id}')"
                                >

                                    <i
                                        class="fa-solid fa-pen"
                                    ></i>

                                    Edit

                                </button>


                                <button
                                    class="delete-btn"
                                    onclick="deleteBlog('${blog.id}')"
                                >

                                    <i
                                        class="fa-solid fa-trash"
                                    ></i>

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                    `;

                }
            ).join("");


        } catch (error) {

            console.error(
                "Error loading blogs:",
                error
            );


            blogList.innerHTML = `

                <div class="no-blogs">

                    <i
                        class="fa-solid fa-triangle-exclamation"
                    ></i>

                    <h2>
                        Unable to Load Blogs
                    </h2>

                    <p>
                        Please make sure the backend
                        server is running.
                    </p>

                </div>

            `;

        }

    }


    // Load blogs
    loadBlogs();


    // ================================
    // Edit Blog
    // ================================

    window.editBlog = async function (id) {

        try {

            const response = await fetch(
                `http://localhost:5000/api/blogs/${id}`
            );


            const blog = await response.json();


            if (!response.ok) {

                alert(
                    blog.message ||
                    "Blog not found."
                );

                return;
            }


            // Save blog temporarily
            localStorage.setItem(
                "editBlog",
                JSON.stringify(blog)
            );


            // Open create/edit page
            window.location.href =
                "create_blog.html";


        } catch (error) {

            console.error(
                "Edit blog error:",
                error
            );

            alert(
                "Cannot connect to backend server."
            );

        }

    };


    // ================================
    // Delete Blog
    // ================================

    window.deleteBlog = async function (id) {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this blog?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/blogs/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (response.ok) {

                alert(
                    "Blog deleted successfully!"
                );

                loadBlogs();

            } else {

                let data = {};

                try {
                    data = await response.json();
                } catch (error) {
                    console.error(error);
                }

                alert(
                    data.message ||
                    "Failed to delete blog."
                );

            }


        } catch (error) {

            console.error(
                "Delete blog error:",
                error
            );

            alert(
                "Cannot connect to backend server."
            );

        }

    };


    // ================================
    // Logout
    // ================================

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                localStorage.removeItem("user");

                localStorage.removeItem("editBlog");

                window.location.href =
                    "login.html";

            }
        );

    }


    // ================================
    // Show / Hide Password
    // ================================

    const passwordToggle =
        document.querySelector(".password-toggle");


    if (passwordToggle) {

        passwordToggle.addEventListener(
            "click",
            function () {

                const passwordInput =
                    document.getElementById("password");


                if (!passwordInput) {

                    return;

                }


                if (
                    passwordInput.type === "password"
                ) {

                    passwordInput.type = "text";

                    passwordToggle.textContent =
                        "Hide";

                } else {

                    passwordInput.type =
                        "password";

                    passwordToggle.textContent =
                        "Show";

                }

            }
        );

    }

});


// ================================
// Email Validation Function
// ================================

function validateEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}