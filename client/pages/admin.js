
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            window.location.href = 'password.html'
        }
    } catch (e) {
        window.location.href = 'password.html'
    }
});