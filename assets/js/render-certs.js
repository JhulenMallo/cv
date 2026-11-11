'use strict';

// Todas las categorías comparten tarjeta, ficha local y verificación externa explícita.
(() => {
    const create = (tag, className, value) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (value !== undefined) node.textContent = value;
        return node;
    };
    function detailsLink(record, className, label) {
        const link = create('a', className, label);
        link.href = window.credentialsCatalog.detailHref(record.id);
        link.dataset.credentialId = record.id;
        if (label === 'Ver detalles') link.setAttribute('aria-label', `Ver detalles de ${record.title}`);
        return link;
    }
    function renderCard(record) {
        const type = window.credentialsCatalog.types[record.type];
        const card = create('article', 'certification-card');
        card.dataset.type = record.type;
        card.dataset.credentialId = record.id;
        const content = create('div', 'credential-card');
        const visual = create('div', 'credential-visual');
        const preview = create('button', 'credential-preview');
        preview.type = 'button';
        preview.dataset.preview = record.mainImage;
        preview.dataset.caption = record.title;
        preview.setAttribute('aria-label', `Ampliar ${type.document}: ${record.title}`);
        const image = create('img', 'credential-image');
        image.src = record.mainImage;
        image.alt = record.title;
        image.loading = 'lazy';
        image.addEventListener('error', () => {
            image.src = 'assets/docs/png/placeholder-cert.svg';
            image.alt = `Imagen no disponible: ${record.title}`;
            preview.disabled = true;
            delete preview.dataset.preview;
        }, { once: true });
        preview.append(image);
        visual.append(create('span', 'credential-kind', type.label), preview);
        const body = create('div', 'credential-body');
        const provider = create('div', 'credential-provider');
        if (record.providerLogo) {
            const logo = create('img', 'credential-logo');
            logo.src = record.providerLogo;
            logo.alt = '';
            logo.width = 24;
            logo.height = 24;
            provider.append(logo);
        }
        provider.append(create('span', '', record.provider));
        const title = create('h3', 'credential-title');
        title.append(detailsLink(record, 'credential-details-link', record.title));
        const date = create('p', 'credential-date', record.issuedDisplay || (record.expiresDisplay ? `Vence el ${record.expiresDisplay}` : ''));
        const actions = create('div', 'credential-actions');
        actions.append(detailsLink(record, 'credential-details-link', 'Ver detalles'));
        if (record.verifyLink) {
            const verify = create('a', 'credential-verify-link', 'Verificar ↗');
            verify.href = record.verifyLink;
            verify.target = '_blank';
            verify.rel = 'noopener noreferrer';
            verify.setAttribute('aria-label', `Verificar ${record.title} en la fuente oficial`);
            actions.append(verify);
        }
        body.append(provider, title, date, actions);
        content.append(visual, body);
        card.append(content);
        return card;
    }
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('certCardsContainer');
        if (!container || !window.credentialsCatalog) return;
        container.replaceChildren(...window.credentialsCatalog.list.map(renderCard));
        const selected = document.getElementById('selectedCredentials');
        if (selected) selected.replaceChildren(...window.credentialsCatalog.highlights.learning.map(renderCard));
    });
})();
