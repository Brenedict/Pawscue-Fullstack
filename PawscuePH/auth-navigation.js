document.addEventListener('DOMContentLoaded', function () {
    const signInLink = document.getElementById('signInLink');
    const logInLink = document.getElementById('logInLink');
    const logoutContainer = document.getElementById('logoutContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    function checkLoginStatus() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    function updateNavigationVisibility() {
        if (checkLoginStatus()) {
            if (signInLink) signInLink.classList.add('hidden');
            if (logInLink) logInLink.classList.add('hidden');
            if (logoutContainer) logoutContainer.classList.remove('hidden');
        } else {
            if (signInLink) signInLink.classList.remove('hidden');
            if (logInLink) logInLink.classList.remove('hidden');
            if (logoutContainer) logoutContainer.classList.add('hidden');
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('applicationSubmitted');
            console.log('User logged out.');
            window.location.href = 'HomePage.html';
        });
    }

    updateNavigationVisibility();
});
