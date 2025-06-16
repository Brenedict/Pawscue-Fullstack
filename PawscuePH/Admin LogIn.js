document.addEventListener('DOMContentLoaded', () => {
    // Admin Credentials (Predefined)
    const ADMIN_USERNAME = 'pawscue admin'; // Admin username
    const ADMIN_PASSWORD = 'admin123'; // Admin password

    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const logUsernameInput = document.getElementById('log-username');
    const logPasswordInput = document.getElementById('log-password');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const messageBox = document.getElementById('messageBox');

    // Forgot Password Modal Elements
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotModalBtn = document.getElementById('closeForgotModal');
    const cancelForgotModalBtn = document.getElementById('cancelForgotModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const forgotUsernameInput = document.getElementById('forgot-username'); // New input for username in modal
    const sendResetLinkBtn = document.getElementById('sendResetLinkBtn'); // New button for sending link

    // --- Utility Functions ---

    /**
     * Displays a message box with a given message and type.
     * @param {string} message The message to display.
     * @param {string} type The type of message (info, success, error).
     */
    function displayMessage(message, type = 'info') {
        if (!messageBox) {
            console.error('Message box element with ID "messageBox" not found!');
            return;
        }
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = 'block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    }

    /**
     * Resets the forgot password form fields.
     */
    function resetForgotPasswordForm() {
        forgotPasswordForm.reset();
    }

    /**
     * Shows the forgot password modal.
     */
    function showForgotPasswordModal() {
        resetForgotPasswordForm(); // Always reset when opening
        forgotPasswordModal.style.display = 'flex'; // Use flex for centering
    }

    /**
     * Hides the forgot password modal.
     */
    function hideForgotPasswordModal() {
        forgotPasswordModal.style.display = 'none';
        resetForgotPasswordForm(); // Reset on close
    }

    // --- Event Listeners ---

    // Login Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const username = logUsernameInput.value.trim();
        const password = logPasswordInput.value.trim();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            displayMessage('Login successful! Redirecting to dashboard...', 'success');
            // Set a flag in sessionStorage upon successful login
            sessionStorage.setItem('isLoggedIn', 'true');
            // Redirect to Admin dashboard
            setTimeout(() => {
                window.location.href = 'Admin.html';
            }, 1500);
        } else {
            displayMessage('Invalid username or password.', 'error');
        }
    });

    // Forgot Password Link Click
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotPasswordModal();
    });

    // Close Forgot Password Modal Button
    closeForgotModalBtn.addEventListener('click', hideForgotPasswordModal);
    cancelForgotModalBtn.addEventListener('click', hideForgotPasswordModal);

    // Click outside modal to close
    window.addEventListener('click', (event) => {
        if (event.target === forgotPasswordModal) {
            hideForgotPasswordModal();
        }
    });

    // Forgot Password Form Submission (to send reset link)
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameToReset = forgotUsernameInput.value.trim();

        // Simulate sending an email. In a real app, you'd make an API call here.
        if (usernameToReset === ADMIN_USERNAME) {
            displayMessage('A password reset link has been sent to the associated email (simulated).', 'success');
            // In a real application, a server would generate and send an actual link.
            // For this demo, we can just inform the user.
            setTimeout(() => {
                hideForgotPasswordModal();
            }, 2000); // Give time for message to be seen
        } else {
            // It's good practice not to reveal if a username exists for security reasons.
            // Instead, give a generic message.
            displayMessage('If an account with that username exists, a password reset link has been sent.', 'info');
            setTimeout(() => {
                hideForgotPasswordModal();
            }, 2000); // Give time for message to be seen
        }
    });
});
