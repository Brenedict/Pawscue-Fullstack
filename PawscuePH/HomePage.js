function resetLocalStorage() {
    const currentUser = {
         userId: null,
        adopterId: null 
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    console.log(JSON.parse(localStorage.getItem('currentUser')));
}
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const paginationDotsContainer = document.getElementById('carouselPagination');

    const signInLink = document.querySelector('.nav-user a[href="SignIn.html"]');
    const logInLink = document.querySelector('.nav-user a[href="LogIn.html"]');
    const logoutContainer = document.getElementById('logoutContainer');
    const logoutBtn = document.getElementById('logoutBtn');


    let currentIndex = 0;
    const totalSlides = slides.length;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        const adoptNowLink = document.querySelector('a[href="AdoptNow.html"]');
        console.log(currentUser)
        if (adoptNowLink) {
            if (currentUser.adopterId != null) {
                adoptNowLink.textContent = "View Form";
            } else {
                adoptNowLink.textContent = "Adopt Now";
            }
        }
    }

    // Function to update the carousel display
    function updateCarousel() {
        const offset = -currentIndex * (100 / totalSlides); // Calculate percentage offset
        carouselContainer.style.transform = `translateX(${offset}%)`;
        updatePaginationDots();
        updateArrowStates();
    }

    // Function to create and update pagination dots
    function updatePaginationDots() {
        paginationDotsContainer.innerHTML = ''; // Clear existing dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            paginationDotsContainer.appendChild(dot);
        }
    }

    // Function to update arrow states (enabled/disabled)
    function updateArrowStates() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === totalSlides - 1;
    }

    // Event listeners for navigation arrows
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Initial carousel setup
    updateCarousel();

    // Check login state
    function checkLoginStatus() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    function updateNavigationVisibility() {
        console.log(checkLoginStatus());
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
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'false');
            updateNavigationVisibility();
        });
    }

    updateNavigationVisibility();
});