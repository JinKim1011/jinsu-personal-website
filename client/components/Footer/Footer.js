export async function mountFooter(targetSelector = '.footer') {
    const placeholder = document.querySelector(targetSelector);
    if (!placeholder) return;

    const res = await fetch('./components/footer/index.html');
    const html = await res.text();
    placeholder.outerHTML = html;
}