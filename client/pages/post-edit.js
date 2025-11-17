// Simple markdown-like renderer
export function render(text) {
    const esc = s => String(s || '').replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    const lines = String(text).split('\n').map(l => {
        const raw = String(l || '');
        const trimmed = raw.trim();
        // skip empty lines (avoid emitting empty <p> tags)
        if (!trimmed) return '';

        if (raw.startsWith('# ')) return '<h1>' + esc(raw.slice(2)) + '</h1>';
        if (raw.startsWith('## ')) return '<h2>' + esc(raw.slice(3)) + '</h2>';
        if (raw.startsWith('### ')) return '<h3>' + esc(raw.slice(4)) + '</h3>';
        const listMatch = raw.match(/^\s*-\s+(.*)/);
        if (listMatch) return '<li>' + esc(listMatch[1]) + '</li>';
        // markdown image: ![alt text](https://...png "optional title")
        const mdImage = raw.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^\"]+)")?\)/);
        if (mdImage) {
            const [, alt, url, title] = mdImage;
            return `<img style="max-width:100%" src="${esc(url)}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ''}/>`;
        }

        // bare image URL (allow query/hash params)
        if (/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)(?:[?#].*)?$/i.test(trimmed)) return `<img style="max-width:100%" src="${esc(trimmed)}"/>`;
        return '<p>' + esc(raw) + '</p>';
    }).join('');

    return lines.replace(/(?:<li>[\s\S]*?<\/li>)+/g, m => '<ul>' + m + '</ul>');
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