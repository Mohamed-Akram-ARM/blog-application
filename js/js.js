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

        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email === "" || password === "") {
                alert("Please fill in all fields.");
                return;
            }

            if (!validateEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            if (password.length < 6) {
                alert("Password must contain at least 6 characters.");
                return;
            }

            alert("Login successful!");

            // Example redirect
            window.location.href = "dashboard.html";
        });
    }


    // ================================
    // Register Form
    // ================================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (name === "" || email === "" ||
                password === "" || confirmPassword === "") {

                alert("Please fill in all fields.");
                return;
            }

            if (!validateEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            if (password.length < 6) {
                alert("Password must contain at least 6 characters.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            alert("Registration successful!");

            window.location.href = "login.html";
        });
    }


    // ================================
    // Create Blog Form
    // ================================

    const blogForm = document.getElementById("blogForm");

    if (blogForm) {
        blogForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const title = document.getElementById("title").value.trim();
            const content = document.getElementById("content").value.trim();

            if (title === "" || content === "") {
                alert("Please enter the blog title and content.");
                return;
            }

            if (title.length < 5) {
                alert("Blog title must contain at least 5 characters.");
                return;
            }

            if (content.length < 20) {
                alert("Blog content must contain at least 20 characters.");
                return;
            }

            alert("Blog created successfully!");

            blogForm.reset();

            window.location.href = "dashboard.html";
        });
    }


    // ================================
    // Delete Blog
    // ================================

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const confirmation = confirm(
                "Are you sure you want to delete this blog?"
            );

            if (confirmation) {
                const blogCard = button.closest(".blog-card");

                if (blogCard) {
                    blogCard.remove();
                }

                alert("Blog deleted successfully.");
            }
        });

    });


    // ================================
    // Logout
    // ================================

    const logoutButton = document.querySelector(".logout-btn");

    if (logoutButton) {

        logoutButton.addEventListener("click", function (event) {

            event.preventDefault();

            const confirmation = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmation) {
                alert("You have been logged out.");

                window.location.href = "login.html";
            }

        });

    }


    // ================================
    // Show / Hide Password
    // ================================

    const passwordToggle = document.querySelector(".password-toggle");

    if (passwordToggle) {

        passwordToggle.addEventListener("click", function () {

            const passwordInput =
                document.getElementById("password");

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                passwordToggle.textContent = "Hide";
            } else {
                passwordInput.type = "password";
                passwordToggle.textContent = "Show";
            }

        });

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