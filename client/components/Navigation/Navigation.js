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
}