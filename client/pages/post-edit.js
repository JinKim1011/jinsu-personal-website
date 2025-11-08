// Simple markdown-like renderer
export function render(text) {
    const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const lines = text.split('\n').map(l => {
        if (l.startsWith('# ')) return '<h1>' + esc(l.slice(2)) + '</h1>';
        if (l.startsWith('## ')) return '<h2>' + esc(l.slice(3)) + '</h2>';
        if (l.startsWith('### ')) return '<h3>' + esc(l.slice(3)) + '</h3>';
        if (l.startsWith('- ')) return '<li>' + esc(l.slice(2)) + '</li>';
        if (/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/.test(l.trim())) return '<img style="max-width:100%" src="' + esc(l.trim()) + '"/>';
        return '<p>' + esc(l) + '</p>';
    }).join('');

    return lines.replace(/(<li>.*?<\/li>)+/gs, m => '<ul>' + m + '</ul>');
}

// Setup live preview
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const preview = document.getElementById('preview');

    if (!input || !preview) return;

    const update = () => {
        preview.innerHTML = render(input.value);
    };

    input.addEventListener('input', update);

    update();
});