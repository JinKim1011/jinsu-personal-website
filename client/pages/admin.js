document.addEventListener('DOMContentLoaded', () => {
    if (window.__IS_ADMIN__ === true) return;

    try {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            window.location.href = '/password';
        }
    } catch (e) {
        window.location.href = '/password';
    }
});