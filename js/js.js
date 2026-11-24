// ================================
// Blog Application - script.js
// ================================

// Wait until the HTML page is loaded
document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // Mobile Menu
    // ================================
    loadLatestBlogs();
    //loadDashboardBlogs();
    const menuButton = document.querySelector(".menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    if (menuButton && navMenu) {
        menuButton.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }



    async function loadLatestBlogs() {
        const container = document.getElementById("latestBlogs");

        if (!container) return;

        try {
            const response = await fetch(
                "http://localhost:5000/api/blogs"
            );

            const blogs = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load blogs");
            }

            if (blogs.length === 0) {
                container.innerHTML =
                    "<p>No blogs published yet.</p>";
                return;
            }

            container.innerHTML = blogs.map(blog => `
            <div class="blog-card">
                <img
                    src="${blog.image || 'https://placehold.co/600x300?text=Blog'}"
                    alt="Blog image"
                >

                <h3>${blog.title}</h3>

                <p>${blog.content}</p>

                <p>
                    <strong>By:</strong>
                    ${blog.author || "Unknown"}
                </p>

               <button
            onclick="viewBlog('${blog._id}')"
            class="read-more-btn">
            Read More
        </button>
        `).join("");


        } catch (error) {
            console.error("Latest blogs error:", error);

            container.innerHTML =
                "<p>Unable to load latest blogs.</p>";
        }
    }
    // ADD THIS BELOW loadLatestBlogs()

    function viewBlog(blogId) {
        window.location.href = "blog-details.html?id=" + blogId;
    }
    // ================================
    // Login Form
    // ================================

    console.log("Login JavaScript loaded");

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            console.log("Login button clicked");
            const loginForm = document.getElementById("loginForm");

            if (loginForm) {
                loginForm.addEventListener("submit", async function (e) {
                    e.preventDefault();

                    const email = document.getElementById("email").value.trim();
                    const password = document.getElementById("password").value;

                    try {
                        const response = await fetch(
                            "http://localhost:5000/api/login",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ email, password })
                            }
                        );

                        const data = await response.json();

                        if (!response.ok) {
                            alert(data.message || "Login failed");
                            return;
                        }

                        if (!data.user) {
                            alert("Login succeeded, but the user data is missing from the server response.");
                            console.error("Login response:", data);
                            return;
                        }

                        localStorage.setItem("user", JSON.stringify(data.user));

                        window.location.href = "dashboard.html";

                    } catch (error) {
                        console.error("Login error:", error);
                        alert("Cannot connect to backend. Check that the server is running.");
                    }
                });
            }
        });
    }


    // ================================
    // Create Blog Form
    // ================================

    const createBlogForm = document.getElementById("createBlogForm");

    if (createBlogForm) {
        createBlogForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const title = document.getElementById("blogTitle").value.trim();
            const category = document.getElementById("blogCategory").value;
            const image = document.getElementById("blogImage").value.trim();
            const content = document.getElementById("blogContent").value.trim();

            const savedUser = localStorage.getItem("user");

            if (!savedUser) {
                alert("Please login first.");
                window.location.href = "login.html";
                return;
            }

            const user = JSON.parse(savedUser);
            const userId = user.id || user._id;

            if (!userId) {
                alert("User ID missing. Please login again.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/blogs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        category,
                        image,
                        content,
                        userId,
                        author: user.name || user.email
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Failed to publish blog.");
                    console.error(data);
                    return;
                }

                alert("Blog published successfully!");

                createBlogForm.reset();

                window.location.href = "dashboard.html";

            } catch (error) {
                console.error("Publish error:", error);
                alert("Cannot connect to backend. Check if server is running.");
            }
        });
    }

    // ================================
    // Dashboard - Load Blogs
    // ================================

    const blogList =
        document.getElementById("blogList");


    const blog = document.getElementById("blogList");

    async function loadBlogs() {
        if (!blogList) return;

        try {
            const savedUser = localStorage.getItem("user");

            if (!savedUser) {
                window.location.href = "login.html";
                return;
            }

            const user = JSON.parse(savedUser);
            const userId = String(user._id || user.id || "");

            if (!userId) {
                alert("User ID not found. Please login again.");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/blogs"
            );

            if (!response.ok) {
                throw new Error("Failed to load blogs");
            }

            const allBlogs = await response.json();

            // Filter blogs belonging to the logged-in author
            const myBlogs = allBlogs.filter(blog => {
                const blogUserId =
                    typeof blog.userId === "object"
                        ? blog.userId?._id
                        : blog.userId;

                return String(blogUserId || "") === userId;
            });

            if (myBlogs.length === 0) {
                blogList.innerHTML = `
                <div class="no-blogs">
                    <h2>No Blogs Yet</h2>
                    <p>You haven't published any blogs yet.</p>
                    <a href="create-blog.html" class="btn">
                        Create Blog
                    </a>
                </div>
            `;
                return;
            }

            blogList.innerHTML = myBlogs.map(blog => {
                const blogId = blog._id || blog.id;

                return `
                <div class="blog-card">
                    ${blog.image ? `
                        <img src="${blog.image}" alt="${blog.title || "Blog"}">
                    ` : ""}

                    <div class="content">
                        <span class="category">
                            ${blog.category || "General"}
                        </span>

                        <h3>${blog.title || "Untitled"}</h3>
                        <p>${blog.content || ""}</p>

                        <small>
                            ${blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "No date"}
                        </small>

                        <div class="blog-actions">
                            <button onclick="editBlog('${blogId}')">
                                Edit
                            </button>

                            <button onclick="deleteBlog('${blogId}')">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            }).join("");

        } catch (error) {
            console.error("Error loading blogs:", error);

            blogList.innerHTML = `
            <div class="no-blogs">
                <h2>Unable to Load Blogs</h2>
                <p>Please check your backend server.</p>
            </div>
        `;
        }
    }

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

function viewBlog(id) {
    window.location.href =
        `blog-details.html?id=${encodeURIComponent(id)}`;
}
// ================================
// Email Validation Function
// ================================

function validateEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}