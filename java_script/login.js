// login.js - Completely rewritten
const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Reset message
    messageDiv.className = 'message';
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';

    // Get values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    try {
        setLoading(true);

        const response = await fetch('https://petzone-backend-3.onrender.com/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMsg = data.detail || 'Login failed';
            if (Array.isArray(errorMsg)) {
                errorMsg = errorMsg.map(err => `${err.loc ? err.loc[err.loc.length - 1] : '?'}: ${err.msg}`).join(', ');
            }
            throw new Error(errorMsg);
        }

        // Success
        console.log("Login successful", data);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("username", data.username);
        // We can decode the token to get user info if needed, or decode on backend
        // For now, simpler is better.

        showMessage('Login successful! Redirecting...', 'success');

        // Slight delay to show success message
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);

    } catch (error) {
        console.error("Login Error:", error);
        if (error.message.includes('Failed to fetch')) {
            showMessage('Cannot connect to server. Is the backend running?', 'error');
        } else {
            showMessage(error.message, 'error');
        }
    } finally {
        setLoading(false);
    }
});

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging In...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
    }
}
