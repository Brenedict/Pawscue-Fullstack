// document.addEventListener('DOMContentLoaded', function() {
//     // Get references to the form elements
//     const loginForm = document.querySelector('.login.form'); // Select the form with class 'login form'
//     const emailInput = document.getElementById('log-email');
//     const passwordInput = document.getElementById('log-password');
//     const loginButton = document.getElementById('LogInBtn');

//     // Get the login status from localStorage (mock)
//     function setLoginStatus(status) {
//         localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
//     }

//     // Function to display messages (instead of alert)
//     function showMessage(message, isError = false) {
//         let messageBox = document.getElementById('loginMessageBox');
//         if (!messageBox) {
//             messageBox = document.createElement('div');
//             messageBox.id = 'loginMessageBox';
//             messageBox.style.cssText = `
//                 margin-top: 15px;
//                 padding: 10px;
//                 border-radius: 5px;
//                 text-align: center;
//                 font-size: 14px;
//                 color: #fff;
//             `;
//             loginForm.insertBefore(messageBox, loginButton.closest('.input-box').nextSibling);
//         }

//         messageBox.textContent = message;
//         messageBox.style.backgroundColor = isError ? '#dc3545' : '#28a745'; // Red for error, green for success
//         messageBox.style.display = 'block';

//         // Automatically hide after a few seconds
//         setTimeout(() => {
//             messageBox.style.display = 'none';
//         }, 3000);
//     }

//     if (loginForm && emailInput && passwordInput && loginButton) {
//         loginForm.addEventListener('submit', function(event) {
//             event.preventDefault(); // Prevent default form submission

//             const email = emailInput.value;
//             const password = passwordInput.value;

//             // Mock login validation
//             // In a real application, you would send these credentials to a server
//             // and validate them securely.
//             if (email === 'user@example.com' && password === 'password123') {
//                 setLoginStatus(true); // Simulate successful login
//                 showMessage('Login successful!', false);

//                 // Redirect based on the stored 'redirectAfterLogin' or to HomePage.html
//                 const redirectTo = localStorage.getItem('redirectAfterLogin') || 'HomePage.html';
//                 localStorage.removeItem('redirectAfterLogin'); // Clear the flag

//                 // Small delay to show message before redirecting
//                 setTimeout(() => {
//                     window.location.href = redirectTo;
//                 }, 1000);

//             } else {
//                 setLoginStatus(false); // Ensure login status is false on failure
//                 showMessage('Invalid email or password. Please try again.', true);
//             }
//         });
//     } else {
//         console.error('Login form elements not found.');
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    // Get references to the form elements
    const loginForm = document.querySelector('.login.form');
    const emailInput = document.getElementById('log-email');
    const passwordInput = document.getElementById('log-password');
    const loginButton = document.getElementById('LogInBtn');

    // Function to initialize or retrieve app data from localStorage
    function getAppData() {
        const defaultData = {
            users: [],
            login_attempts: [],
            application_submissions: []
        };
        try {
            const data = localStorage.getItem('pawscueAppData');
            return data ? JSON.parse(data) : defaultData;
        } catch (e) {
            console.error("Error parsing app data from localStorage:", e);
            return defaultData;
        }
    }

    // Function to save app data to localStorage
    function saveAppData(data) {
        try {
            localStorage.setItem('pawscueAppData', JSON.stringify(data));
        } catch (e) {
            console.error("Error saving app data to localStorage:", e);
        }
    }

    // Function to set login status in localStorage
    function setLoginStatus(status, userId = null) {
        localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
        localStorage.setItem('loggedInUserId', userId || ''); // Store the logged-in user's ID
    }

    // Function to display messages (instead of alert)
    function showMessage(message, isError = false) {
        let messageBox = document.getElementById('loginMessageBox');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'loginMessageBox';
            messageBox.style.cssText = `
                margin-top: 15px;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                font-size: 14px;
                color: #fff;
            `;
            // Insert message box after the form for better visibility
            loginForm.parentNode.insertBefore(messageBox, loginForm.nextSibling);
        }

        messageBox.textContent = message;
        messageBox.style.backgroundColor = isError ? '#dc3545' : '#28a745'; // Red for error, green for success
        messageBox.style.display = 'block';

        // Automatically hide after a few seconds
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }

    // Record successful login attempt
                // appData.login_attempts.push({
                //     attemptId: `login_${Date.now()}`,
                //     userId: user.userId,
                //     emailAttempted: email,
                //     timestamp: new Date().toISOString(),
                //     success: true,
                //     ipAddress: '127.0.0.1' // Mock IP address
                // });
                
    if (loginForm && emailInput && passwordInput && loginButton) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                showMessage('Both fields are required.', true);
                return;
            }

            const user = await checkCredentials(email, password);
            console.log(user);
            if (user) {
                const currentUser = {
                    userId: user.userId,
                    adopterId: user.adopterId
                }

                localStorage.setItem('currentUser', JSON.stringify(currentUser));   
                setLoginStatus(true, user.userId);
                showMessage('Login successful!');
                const redirectTo = localStorage.getItem('redirectAfterLogin') || 'HomePage.html';
                localStorage.removeItem('redirectAfterLogin');

                setTimeout(() => {
                    window.location.href = redirectTo;
                }, 1000);
            } else {
                setLoginStatus(false);
                showMessage('Invalid email or password. Please try again.', true);
            }
        });
    } else {
        console.error('Login form elements not found.');
    }
});

async function checkCredentials(email, password) {
    try {
        const response = await fetch('http://localhost:8080/api/appdata/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) return null;

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Login fetch error:', error);
        return null;
    }
}