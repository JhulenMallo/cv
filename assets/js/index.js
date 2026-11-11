'use strict';

const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
const tags = values => `<ul class="tag-list" aria-label="Tecnologías y competencias">${values.map(value => `<li>${escapeHTML(value)}</li>`).join('')}</ul>`;
const responsibilities = values => values.length ? `<ul class="career-bullets">${values.map(value => `<li><strong>${escapeHTML(value.label)}.</strong> ${escapeHTML(value.text)}</li>`).join('')}</ul>` : '';

function renderProfile() {
    const skills = document.getElementById('skills-container');
    if (skills) skills.innerHTML = (window.skillsData || []).map((category, index) => `
        <article class="competency">
            <div class="competency-top"><i class="${escapeHTML(category.icon)}" aria-hidden="true"></i><span>0${index + 1}</span></div>
            <h3>${escapeHTML(category.category)}</h3><p>${escapeHTML(category.description)}</p>${tags(category.skills)}
        </article>`).join('');

    const jobs = window.experienceData || [];
    const career = document.getElementById('experience-container');
    if (career) career.innerHTML = jobs.filter(job => job.company === 'Banco Bisa S.A.').map(job => `
        <article class="career-item">
            <div class="career-meta"><p>${escapeHTML(job.date)}</p>${job.current ? '<span class="current-badge"><span class="status-dot"></span>ACTUAL</span>' : ''}<span>${escapeHTML(job.mode)}</span></div>
            <div class="career-body"><h3>${escapeHTML(job.title)}</h3><p class="career-area">${escapeHTML(job.area)}</p><p>${escapeHTML(job.description)}</p>${responsibilities(job.responsibilities)}${tags(job.techStack)}</div>
        </article>`).join('');

    const other = document.getElementById('other-experience-container');
    if (other) other.innerHTML = jobs.filter(job => job.company !== 'Banco Bisa S.A.').map(job => `
        <details class="other-job"><summary><span>${escapeHTML(job.date)}</span><div><strong>${escapeHTML(job.title)} · ${escapeHTML(job.company)}</strong><small>${escapeHTML(job.mode)}</small></div></summary><div class="other-job-body"><p>${escapeHTML(job.description)}</p>${responsibilities(job.responsibilities)}${tags(job.techStack)}</div></details>`).join('');

    const education = document.getElementById('education-container');
    if (education) education.innerHTML = (window.educationData || []).map(course => `
        <article class="study-card"><p class="study-status"><span class="status-dot"></span>${escapeHTML(course.status)}</p><h3>${escapeHTML(course.title)}</h3><p class="study-subtitle">${escapeHTML(course.subtitle)}</p><p class="study-institution"><span>${escapeHTML(course.institution)}</span><span>${escapeHTML(course.date)}</span></p></article>`).join('');

    const teaching = document.getElementById('teaching-container');
    if (teaching) teaching.innerHTML = (window.teachingData || []).map(course => `
        <article class="teaching-item"><span class="mono">${escapeHTML(course.date)}</span><h4>${escapeHTML(course.title)}</h4><p>${escapeHTML(course.description)}</p>${course.link ? `<a href="${escapeHTML(course.link)}" target="_blank" rel="noopener noreferrer">Ver clases ${icon('external')}</a>` : ''}</article>`).join('');
}

function initCredentials() {
    const catalog = window.credentialsCatalog;
    const container = document.getElementById('certCardsContainer');
    if (!container || !catalog) return;
    const cards = new Map([...container.querySelectorAll('.certification-card')].map(card => [card.dataset.credentialId,card]));
    const filters = [...document.querySelectorAll('.cert-filter-btn')];
    const search = document.getElementById('certSearch');
    const sort = document.getElementById('certSort');
    const more = document.getElementById('showMoreBtn');
    const results = document.getElementById('certResults');
    const empty = document.getElementById('certEmpty');
    const limit = 6;
    const state = catalog.readState(location.search);
    const panel = document.getElementById('credentialCatalog');
    panel.open = state.open || state.type !== 'all' || !!state.query || state.sort !== 'category' || state.expanded;
    state.open = panel.open;
    document.getElementById('catalogCount').textContent = `${catalog.list.length} credenciales`;
    search.value = state.query;
    sort.value = state.sort;
    filters.forEach(button => {
        const count = button.dataset.filter === 'all' ? catalog.list.length : catalog.counts[button.dataset.filter];
        const marker = document.createElement('span');
        marker.className = 'filter-count';
        marker.textContent = count;
        marker.setAttribute('aria-hidden','true');
        button.setAttribute('aria-label', `${button.textContent} (${count})`);
        button.append(marker);
    });
    const refresh = (persist = true) => {
        const query = catalog.normalizeText(state.query);
        const matches = catalog.sort(catalog.list.filter(record => (state.type === 'all' || record.type === state.type) && record.searchText.includes(query)),state.sort);
        const shown = state.expanded ? matches : matches.slice(0,limit);
        cards.forEach(card => { card.hidden = true; });
        const context = catalog.stateQuery(state);
        matches.forEach(record => {
            const card = cards.get(record.id);
            container.append(card);
        });
        shown.forEach(record => { cards.get(record.id).hidden = false; });
        container.querySelectorAll('.credential-details-link').forEach(link => {
            link.href = catalog.detailHref(link.dataset.credentialId,catalog.stateQuery({ ...state, open:true }));
        });
        document.querySelectorAll('#selectedCredentials .credential-details-link').forEach(link => {
            link.href = catalog.detailHref(link.dataset.credentialId,context);
        });
        document.querySelectorAll('.featured-credential,.hero-credential').forEach(link => {
            const id = new URL(link.href,location.href).searchParams.get('id');
            link.href = catalog.detailHref(id,context);
        });
        results.textContent = `${shown.length} de ${matches.length} ${matches.length === 1 ? 'credencial' : 'credenciales'}${query ? (matches.length === 1 ? ' encontrada' : ' encontradas') : ''}`;
        empty.hidden = matches.length !== 0;
        more.hidden = matches.length <= limit;
        more.setAttribute('aria-expanded',String(state.expanded));
        more.innerHTML = state.expanded ? 'Mostrar menos ↑' : `Mostrar más credenciales (${Math.max(0,matches.length - limit)}) ${icon('arrow')}`;
        filters.forEach(button => {
            const active = button.dataset.filter === state.type;
            button.classList.toggle('active',active);
            button.setAttribute('aria-pressed',String(active));
        });
        if (persist) {
            const url = new URL(location.href);
            ['credentialType','credentialQuery','credentialSort','credentialExpanded','credentialCatalog'].forEach(key => url.searchParams.delete(key));
            new URLSearchParams(context).forEach((value,key) => url.searchParams.set(key,value));
            url.hash = 'certifications';
            history.replaceState(null,'',url);
        }
    };
    panel.addEventListener('toggle', () => {
        if (state.open === panel.open) return;
        state.open = panel.open;
        refresh();
    });
    filters.forEach(button => button.addEventListener('click', () => {
        state.type = button.dataset.filter;
        state.expanded = false;
        refresh();
    }));
    search.addEventListener('input', () => {
        state.query = search.value.trim().slice(0,200);
        state.expanded = false;
        refresh();
    });
    sort.addEventListener('change', () => {
        state.sort = sort.value;
        state.expanded = false;
        refresh();
    });
    more.addEventListener('click', () => {
        state.expanded = !state.expanded;
        refresh();
        if (!state.expanded) more.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });
    refresh(false);
}

function initPrint() {
    document.querySelectorAll('.print-cv').forEach(button => button.addEventListener('click', () => window.print()));
    let previousStates = [];
    window.addEventListener('beforeprint', () => {
        previousStates = [...document.querySelectorAll('.other-job')].map(detail => [detail, detail.open]);
        previousStates.forEach(([detail]) => { detail.open = true; });
    });
    window.addEventListener('afterprint', () => previousStates.forEach(([detail, open]) => { detail.open = open; }));
}

document.addEventListener('DOMContentLoaded', () => {
    renderProfile();
    initCredentials();
    initPrint();

});
