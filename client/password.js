document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pw-form');
    const input = document.getElementById('pw');
    const error = document.getElementById('error');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const pw = (input.value || '').trim();

        if (pw === 'admin123') {
            try { sessionStorage.setItem('isAdmin', 'true'); } catch (e) { }
            window.location.href = '/admin';
        } else {
            if (error) { error.textContent = 'wrong password'; error.classList.remove('hide'); }
        }
    })
});