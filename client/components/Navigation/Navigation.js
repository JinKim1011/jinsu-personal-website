export async function mountNavigation(targetSelector = '.nav') {
    const placeholder = document.querySelector(targetSelector);

    if (!placeholder) return;

    const res = await fetch('./components/navigation/index.html');
    const html = await res.text();

    placeholder.outerHTML = html;

    // hightlight the active link
    const current = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href').endsWith(current));
    });

    // set headline text based on current page
    const headlineEl = document.getElementById('nav-headline');
    if (headlineEl) {
        const headlines = {
            'index.html': "Hello, I'm Jin",
            'blog.html': "Notes & Reflections",
            'work.html': "Designing for impact",
            'admin.html': "Editing posts",
        };
        headlineEl.textContent = headlines[current] || 'Headline';
    }

    const adminLink = document.getElementById('admin');
    if (adminLink && current === 'admin.html') {
        adminLink.classList.remove('hide');
    }
}
