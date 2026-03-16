// signup.js - Completely rewritten
const form = document.getElementById('signupForm');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Reset message
    messageDiv.className = 'message';
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';

    // Get values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const location = document.getElementById('location').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!name || !email || !password) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    try {
        setLoading(true);

        const response = await fetch('http://127.0.0.1:5000/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                location: location,
                phone: phone,
                password: password
            })
        });

        // Safely parse JSON
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server Error (${response.status}): ${text}`);
        }

        if (!response.ok) {
            let errorMsg = data.detail || 'Signup failed';
            if (Array.isArray(errorMsg)) {
                errorMsg = errorMsg.map(err => `${err.loc ? err.loc[err.loc.length - 1] : '?'}: ${err.msg}`).join(', ');
            }
            throw new Error(errorMsg);
        }

        // Success
        showMessage('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        console.error("Signup Error:", error);
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
        submitBtn.textContent = 'Creating Account...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
    }
}
