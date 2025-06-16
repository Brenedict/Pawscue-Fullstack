// document.addEventListener('DOMContentLoaded', function() {
//     // Get references to the form elements
//     const signInForm = document.querySelector('.login.form'); // Assuming .login.form is used for both
//     const usernameInput = document.getElementById('reg-user');
//     const emailInput = document.getElementById('reg-email');
//     const passwordInput = document.getElementById('reg-password');
//     const agreeCheckbox = document.getElementById('Agree');
//     const signInButton = document.getElementById('SignInBtn');

//     // Get the login status from localStorage (mock)
//     function setLoginStatus(status) {
//         localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
//     }

//     // Function to display messages (instead of alert)
//     function showMessage(message, isError = false) {
//         let messageBox = document.getElementById('signInMessageBox');
//         if (!messageBox) {
//             messageBox = document.createElement('div');
//             messageBox.id = 'signInMessageBox';
//             messageBox.style.cssText = `
//                 margin-top: 15px;
//                 padding: 10px;
//                 border-radius: 5px;
//                 text-align: center;
//                 font-size: 14px;
//                 color: #fff;
//             `;
//             signInForm.insertBefore(messageBox, signInButton.closest('.input-box').nextSibling);
//         }

//         messageBox.textContent = message;
//         messageBox.style.backgroundColor = isError ? '#dc3545' : '#28a745'; // Red for error, green for success
//         messageBox.style.display = 'block';

//         // Automatically hide after a few seconds
//         setTimeout(() => {
//             messageBox.style.display = 'none';
//         }, 3000);
//     }

//     if (signInForm && usernameInput && emailInput && passwordInput && agreeCheckbox && signInButton) {
//         signInForm.addEventListener('submit', function(event) {
//             event.preventDefault(); // Prevent default form submission

//             const username = usernameInput.value;
//             const email = emailInput.value;
//             const password = passwordInput.value;

//             // Basic client-side validation
//             if (!username || !email || !password) {
//                 showMessage('All fields are required.', true);
//                 return;
//             }
//             if (!agreeCheckbox.checked) {
//                 showMessage('You must agree to the terms & conditions.', true);
//                 return;
//             }
//             if (password.length < 6) {
//                 showMessage('Password must be at least 6 characters long.', true);
//                 return;
//             }

//             // Mock registration logic
//             // In a real application, you would send this data to a server
//             // to create a new user account (with password hashing!).
//             try {
//                 // Simulate saving user data
//                 localStorage.setItem('registeredUserEmail', email);
//                 localStorage.setItem('registeredUserPassword', password); // NOT SECURE IN REAL APP!
//                 localStorage.setItem('registeredUsername', username);

//                 setLoginStatus(true); // Simulate automatic login after registration
//                 showMessage('Registration successful! You are now logged in.', false);

//                 // Redirect based on the stored 'redirectAfterLogin' or to HomePage.html
//                 const redirectTo = localStorage.getItem('redirectAfterLogin') || 'HomePage.html';
//                 localStorage.removeItem('redirectAfterLogin'); // Clear the flag

//                 // Small delay to show message before redirecting
//                 setTimeout(() => {
//                     window.location.href = redirectTo;
//                 }, 1000);

//             } catch (error) {
//                 showMessage('Registration failed. Please try again later.', true);
//                 console.error('Registration error:', error);
//                 setLoginStatus(false);
//             }
//         });
//     } else {
//         console.error('Sign-in form elements not found.');
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    // Get references to the form elements
    const signInForm = document.querySelector('.login.form');
    const usernameInput = document.getElementById('reg-user');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const agreeCheckbox = document.getElementById('Agree');
    const signInButton = document.getElementById('SignInBtn');

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
        localStorage.setItem('loggedInUserId', userId || '');
    }

    // Function to display messages (instead of alert)
    function showMessage(message, isError = false) {
        let messageBox = document.getElementById('signInMessageBox');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'signInMessageBox';
            messageBox.style.cssText = `
                margin-top: 15px;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                font-size: 14px;
                color: #fff;
            `;
            // Insert message box after the form for better visibility
            signInForm.parentNode.insertBefore(messageBox, signInForm.nextSibling);
        }

        messageBox.textContent = message;
        messageBox.style.backgroundColor = isError ? '#dc3545' : '#28a745'; // Red for error, green for success
        messageBox.style.display = 'block';

        // Automatically hide after a few seconds
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }

    if (signInForm && usernameInput && emailInput && passwordInput && agreeCheckbox && signInButton) {
        signInForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!username || !email || !password) {
                showMessage('All fields are required.', true);
                return;
            }
            if (!agreeCheckbox.checked) {
                showMessage('You must agree to the terms & conditions.', true);
                return;
            }
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long.', true);
                return;
            }

            const emailIsUnique = await checkUniqueEmail(email);
            if (!emailIsUnique) {
                showMessage('This email is already registered. Please login instead.', true);
                return;
            }

            const registrationDate = new Date().toISOString().split('T')[0];

            const newUser = {
                userId: null, // Leave null, let DB assign
                username: username,
                email: email,
                passwordHash: password, // Still store hashed in production
                registrationDate: registrationDate,
                adopterId: null
            };

            const savedUser = await postUserData(newUser);

            if (!savedUser || !savedUser.userId) {
                showMessage('Registration failed. Please try again later.', true);
                setLoginStatus(false);
                return;
            }

            setLoginStatus(true, savedUser.userId); // Use returned user ID

            // Store currentUser for later access (e.g., delete, form viewing)
            const currentUser = {
                userId: savedUser.userId,
                adopterId: null  // In case adopter hasn't applied yet
            };

            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showMessage('Registration successful! You are now logged in.');

            const redirectTo = localStorage.getItem('redirectAfterLogin') || 'HomePage.html';
            localStorage.removeItem('redirectAfterLogin');

            setTimeout(() => {
                window.location.href = redirectTo;
            }, 1000);
        });
    } else {
        console.error('Sign-in form elements not found.');
    }
});

async function checkUniqueEmail(email) {
    try {
        const response = await fetch(`http://localhost:8080/api/appdata/email=${encodeURIComponent(email)}`);
        const emailIsUnique = await response.json(); // <--- parse the boolean
        console.log("Email is unique")
        return emailIsUnique;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function postUserData(newUser) {
    try {
        const response = await fetch('http://localhost:8080/api/appdata/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        const result = await response.json(); // Parse server response (e.g. user object or success flag)
        return result;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
