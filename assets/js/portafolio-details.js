'use strict';

// Una sola plantilla para todas las credenciales del catálogo.
(() => {
    const create = (tag, className, value) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (value !== undefined) node.textContent = value;
        return node;
    };
    const addTags = (container, values) => values.forEach(value => container.append(create('li', '', value)));

    function initializeCertificate() {
        const id = new URLSearchParams(location.search).get('id');
        const catalog = window.credentialsCatalog;
        const state = catalog.readState(new URLSearchParams(location.search).get('catalog') || '');
        document.querySelectorAll('a[href="index.html#certifications"]').forEach(link => { link.href = catalog.returnHref(state); });
        const data = catalog.get(id);
        if (!data) {
            document.title = 'Credencial no encontrada · Jhulen Mallo';
            document.getElementById('certificateContent').hidden = true;
            document.getElementById('certNotFound').hidden = false;
            return;
        }
        const type = catalog.types[data.type];
        document.body.dataset.credentialType = data.type;
        document.title = `${data.title} · Jhulen Mallo`;
        const description = data.description || `${type.label} de ${data.provider}. Consulta la credencial y sus criterios de obtención en la fuente oficial.`;
        document.querySelector('meta[name="description"]').content = `${data.title}. ${description}`;
        document.getElementById('page-type').textContent = `FORMACIÓN CONTINUA / ${type.label.toUpperCase()}`;
        document.getElementById('page-title').textContent = data.title;
        document.querySelector('#page-provider span').textContent = data.provider;
        document.getElementById('page-desc').textContent = description;
        document.getElementById('page-date').textContent = data.issuedDisplay;
        document.getElementById('issued-meta').hidden = !data.issuedDisplay;
        document.getElementById('page-courses-count').textContent = data.format;
        if (data.expiresDisplay) {
            document.getElementById('page-expiry').textContent = data.expiresDisplay;
            document.getElementById('expiry-meta').hidden = false;
        }
        const mainImage = document.getElementById('page-main-img');
        mainImage.src = data.mainImage;
        mainImage.alt = data.title;
        const imageButton = document.getElementById('mainImageButton');
        imageButton.disabled = false;
        imageButton.dataset.preview = data.mainImage;
        imageButton.dataset.caption = data.title;
        imageButton.setAttribute('aria-label', `Ampliar ${type.document}: ${data.title}`);
        document.getElementById('previewCaption').textContent = `Ampliar ${type.document}`;
        document.getElementById('overview-title').textContent = type.overview;
        document.getElementById('modules-title').textContent = type.modules;
        document.getElementById('overview-section').hidden = !(data.overviewText1 || data.overviewText2 || data.skills.length);
        document.querySelector('.cert-skills').hidden = !data.skills.length;
        document.querySelector('.cert-overview-copy').hidden = !(data.overviewText1 || data.overviewText2);
        document.querySelector('.cert-overview-grid').classList.toggle('single-column', !data.skills.length || !(data.overviewText1 || data.overviewText2));
        document.getElementById('credential-information').hidden = !(data.overviewText1 || data.overviewText2 || data.skills.length || data.modules.length || data.projects.length);
        document.getElementById('page-overview-1').textContent = data.overviewText1 || '';
        document.getElementById('page-overview-2').textContent = data.overviewText2 || '';
        addTags(document.getElementById('page-skills'), data.skills || []);

        const modules = data.modules || [];
        document.getElementById('modules-section-container').hidden = !modules.length;
        const moduleContainer = document.getElementById('page-modules');
        modules.forEach(module => {
            const card = create('article', 'module-card');
            const button = create('button', 'module-image-button');
            button.type = 'button';
            button.dataset.preview = module.img;
            button.dataset.caption = module.title;
            button.setAttribute('aria-label', `Ampliar certificado del módulo: ${module.title}`);
            const image = create('img', 'module-image');
            image.loading = 'lazy';
            image.alt = module.title;
            image.addEventListener('error', () => {
                image.src = 'assets/docs/png/placeholder-cert.svg';
                image.alt = `Imagen no disponible: ${module.title}`;
                button.disabled = true;
                delete button.dataset.preview;
            }, { once: true });
            image.src = module.img;
            button.append(image);
            const body = create('div', 'module-info');
            body.append(create('h3', '', module.title), create('p', '', module.desc), create('div', 'module-duration', module.duration));
            card.append(button, body);
            moduleContainer.append(card);
        });

        const projects = data.projects || [];
        document.getElementById('projects-section-container').hidden = !projects.length;
        projects.forEach(project => {
            const card = create('article', 'application-card');
            const symbol = create('i', project.icon || 'fas fa-code');
            symbol.setAttribute('aria-hidden', 'true');
            const list = create('ul', 'tag-list');
            addTags(list, project.badges || []);
            card.append(symbol, create('h3', '', project.title), create('p', '', project.desc), list);
            document.getElementById('page-projects').append(card);
        });
        document.getElementById('page-verify-text').textContent = data.verifyText || `Credencial emitida por ${data.provider}. Consulta su autenticidad y los criterios de obtención en la fuente oficial.`;
        if (/^https?:\/\//.test(data.verifyLink || '')) {
            ['page-hero-verify', 'page-verify-link'].forEach(id => {
                const link = document.getElementById(id);
                link.href = data.verifyLink;
                link.hidden = false;
            });
        }
    }

    document.addEventListener('DOMContentLoaded', initializeCertificate);
})();
