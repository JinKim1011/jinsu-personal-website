// Simple markdown-like renderer
export function render(text) {
    const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const lines = text.split('\n').map(l => {
        if (l.startsWith('# ')) return '<h1>' + esc(l.slice(2)) + '</h1>';
        if (l.startsWith('## ')) return '<h2>' + esc(l.slice(3)) + '</h2>';
        if (l.startsWith('### ')) return '<h3>' + esc(l.slice(3)) + '</h3>';
        if (l.startsWith('- ')) return '<li>' + esc(l.slice(2)) + '</li>';
        // markdown image: ![alt text](https://...png "optional title")
        const mdImage = l.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]+)")?\)/);
        if (mdImage) {
            const [, alt, url, title] = mdImage;
            return '<img style="max-width:100%" src="' + esc(url) + '" alt="' + esc(alt) + '"' + (title ? ' title="' + esc(title) + '"' : '') + '/>';
        }

        // bare image URL (allow query/hash params)
        if (/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)(?:[?#].*)?$/i.test(l.trim())) return '<img style="max-width:100%" src="' + esc(l.trim()) + '"/>';
        return '<p>' + esc(l) + '</p>';
    }).join('');

    return lines.replace(/(<li>.*?<\/li>)+/gs, m => '<ul>' + m + '</ul>');
}

// Setup live preview
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const preview = document.getElementById('preview');
    const titleEl = document.getElementById('title');
    const summaryEl = document.getElementById('summary');
    const dateEl = document.getElementById('date');

    if (!input || !preview) return;

    const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const update = () => {
        const title = titleEl ? titleEl.value.trim() : '';
        const summary = summaryEl ? summaryEl.value.trim() : '';
        const dateVal = dateEl ? dateEl.value : '';

        let dateStr = '';
        if (dateVal) {
            const d = new Date(dateVal);
            if (!isNaN(d)) {
                // Format as abbreviated month + year (e.g. "Jul 2025")
                dateStr = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
            }
        }

        let html = '';
        if (title) html += '<h1>' + esc(title) + '</h1>';
        if (summary) html += '<p class="post-summary">' + esc(summary) + '</p>';
        if (dateStr) html += '<p class="post-date">' + esc(dateStr) + '</p>';

        html += render(input.value || '');

        preview.innerHTML = html;
    };

    // listen for changes to metadata and body
    [input, titleEl, summaryEl, dateEl].forEach(el => {
        if (!el) return;
        el.addEventListener('input', update);
    });

    update();
});