export async function mountNavigation(targetSelector = '.nav') {
    const placeholder = document.querySelector(targetSelector);
    if (!placeholder) return;
    if (placeholder.children.length === 0) {
        const res = await fetch('./components/navigation/index.html');
        if (res && res.ok) {
            const html = await res.text();
            placeholder.outerHTML = html;
        }
    }

    const currentPath = (location.pathname || '/').replace(/\/$/, '') || '/';

    function normalizeHref(href) {
        if (!href) return '';
        href = href.trim();
        if (href.startsWith('/')) return href.replace(/\/$/, '') || '/';
        if (href.endsWith('.html')) {
            if (href === 'index.html') return '/';
            return '/' + href.replace(/\.html$/, '').replace(/^\//, '');
        }
        return href.replace(/\/$/, '');
    }

    // Highlight active navigation link
    document.querySelectorAll('.nav a').forEach(a => {
        const href = a.getAttribute('href') || '';
        const norm = normalizeHref(href);
        a.classList.toggle('active', norm === currentPath);
    });

    // Set headline based on current path
    const headlineEl = document.getElementById('nav-headline');
    if (headlineEl) {
        const headlines = {
            '/': "Hello, I'm Jin",
            '/blog': "Notes & Reflections",
            '/work': "Designing for impact",
            '/admin': "Editing Posts",
        };
        headlineEl.textContent = headlines[currentPath] || 'Headline';
    }

    // Show/hide admin link based on session storage
    const adminLink = document.getElementById('admin');
    if (adminLink) {
        let isAdmin = false;
        try { isAdmin = sessionStorage.getItem('isAdmin') === 'true'; } catch (e) { }
        if (isAdmin || currentPath === '/admin') adminLink.classList.remove('hide');
        else adminLink.classList.add('hide');
    }
}
