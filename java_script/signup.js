const form = document.getElementById('signupForm');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const location = document.getElementById('location').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();

    
    if (!name || !email || !password) {
        return showMessage('Please fill in all required fields.', 'error');
    }

    try {
        setLoading(true);

        const res = await fetch('https://petzone-backend-3.onrender.com/users/signup', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, location, phone, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || 'Signup failed');
        }

        
        showMessage('Account created successfully! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (err) {
        console.error(err);

        if (err.message.includes('Failed to fetch')) {
            showMessage('Cannot connect to server. Is the backend running?', 'error');
        } else {
            showMessage(err.message, 'error');
        }
    } finally {
        setLoading(false);
    }
});


function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}


function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Creating Account...' : 'Sign Up';
}