document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const logoutButton = document.getElementById('logoutBtn');
    const bodyElement = document.body; // Reference to the body element

    // Check if the current page is the login page itself
    const isLoginPage = window.location.pathname.endsWith('Admin LogIn.html');

    if (isLoggedIn === 'true') {
        // User is logged in
        if (logoutButton) {
            logoutButton.style.display = 'block'; // Show the logout button
        }
        // If on login page but already logged in, redirect to Admin dashboard
        if (isLoginPage) {
            window.location.href = 'Admin.html';
        } else {
            // User is logged in and on a protected page, make body visible
            bodyElement.style.visibility = 'visible';
        }
    } else {
        // User is NOT logged in
        if (logoutButton) {
            logoutButton.style.display = 'none'; // Ensure logout button is hidden
        }
        // If not on login page and not logged in, redirect to Admin login page
        if (!isLoginPage) {
            window.location.href = 'Admin LogIn.html';
        }
        // If on login page and not logged in, the body will remain visible
        // as Login.css does not set visibility: hidden.
    }

    // Add event listener for the logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn'); // Clear the login flag
            window.location.href = 'Admin LogIn.html'; // Redirect to login page
        });
    }
});
