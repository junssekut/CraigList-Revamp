function isAuthenticated() {
    return localStorage.getItem('authenticated') === 'true';
}

function login(email_address) {
    if (!email_address) return new Error('Failed to authenticate with undefined email address');

    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('email', email_address);
}

function logout() {
    if (!isAuthenticated()) return new Error('Failed to logout, no logged in account');

    localStorage.setItem('authenticated', 'false');
    localStorage.removeItem('email');
}

function getAccount() {
    if (!isAuthenticated()) return new Error('Not authenticated');

    return {
        authenticated: localStorage.getItem('authenticated'),
        email: localStorage.getItem('email')
    }
}

function initAuthentication() {
    if (!localStorage.getItem('authenticated'))
        localStorage.setItem('authenticated', 'false');
}

initAuthentication();