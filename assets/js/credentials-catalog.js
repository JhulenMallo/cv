'use strict';

// Normaliza las fuentes una sola vez. La misma categoría gobierna tarjetas y fichas.
(() => {
    const types = Object.freeze({
        certification: Object.freeze({ label: 'Certificación', plural: 'Certificaciones', document: 'certificado', overview: 'Sobre esta certificación.', modules: 'Contenidos de la certificación.', format: 'Certificación', order: 0 }),
        specialization: Object.freeze({ label: 'Especialización', plural: 'Especializaciones', document: 'certificado', overview: 'Sobre esta especialización.', modules: 'Cursos de la especialización.', format: 'Especialización', order: 1 }),
        course: Object.freeze({ label: 'Curso', plural: 'Cursos', document: 'certificado', overview: 'Sobre este curso.', modules: 'Contenidos del curso.', format: 'Curso', order: 2 }),
        'skill-badge': Object.freeze({ label: 'Skill Badge', plural: 'Skill Badges', document: 'insignia', overview: 'Sobre este Skill Badge.', modules: 'Actividades y contenidos.', format: 'Skill Badge', order: 3 }),
        badge: Object.freeze({ label: 'Badge', plural: 'Badges', document: 'insignia', overview: 'Sobre esta insignia.', modules: 'Actividades y contenidos.', format: 'Insignia digital', order: 4 })
    });
    const normalizeText = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const months = [['enero','ene','january','jan'],['febrero','february','feb'],['marzo','march','mar'],['abril','abr','april','apr'],['mayo','may'],['junio','june','jun'],['julio','july','jul'],['agosto','ago','august','aug'],['septiembre','setiembre','september','sept','sep'],['octubre','october','oct'],['noviembre','november','nov'],['diciembre','dic','december','dec']];

    function parseDate(value) {
        const raw = String(value || '').trim();
        if (!raw) return { display: '', iso: '', sortValue: 0 };
        const text = normalizeText(raw);
        const isoMatch = text.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
        const year = Number(isoMatch?.[1] || text.match(/\b(?:19|20)\d{2}\b/)?.[0]);
        if (!year) return { display: raw, iso: '', sortValue: 0 };
        const words = text.match(/[a-z]+/g) || [];
        const month = isoMatch ? Number(isoMatch[2]) : months.findIndex(variants => variants.some(word => words.includes(word))) + 1;
        const day = isoMatch ? Number(isoMatch[3] || 0) : Number(text.match(/\b\d{1,2}\b/)?.[0] || 0);
        if (month > 12 || (day && (!month || new Date(Date.UTC(year, month - 1, day)).getUTCMonth() !== month - 1))) {
            return { display: raw, iso: '', sortValue: 0 };
        }
        const display = day ? `${day} de ${monthNames[month - 1]} de ${year}` : month ? `${monthNames[month - 1]} de ${year}` : String(year);
        const iso = day ? `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}` : '';
        return { display, iso, sortValue: year * 10000 + month * 100 + day };
    }

    function verificationKey(value) {
        if (!/^https?:\/\//i.test(value || '')) return '';
        const url = new URL(value);
        if (url.hostname.endsWith('credly.com')) return `credly:${url.pathname.match(/\/badges\/([^/]+)/)?.[1] || url.pathname}`;
        if (url.hostname.endsWith('coursera.org') && url.pathname.includes('/accomplishments/')) return `coursera:${url.pathname.split('/').filter(Boolean).pop()}`;
        return `${url.hostname.replace(/^www\./,'')}${url.pathname.replace(/\/$/,'')}`;
    }
    function providerLogo(provider) {
        const name = normalizeText(provider);
        if (name.includes('deeplearning')) return 'assets/docs/png/logo-deeplearning.png';
        if (name.includes('google')) return 'assets/docs/png/logo-googlecloud.png';
        if (name.includes('microsoft')) return 'assets/docs/png/logo-microsoft.png';
        if (name.includes('amazon') || name.includes('aws')) return 'assets/docs/png/logo-aws.png';
        if (name.includes('ibm')) return 'assets/docs/png/logo-ibm.png';
        if (name.includes('linux')) return 'assets/docs/png/logo-linuxfoundations.png';
        if (name.includes('michigan')) return 'assets/docs/png/logo-universitymichigan.png';
        if (name.includes('hong kong') || name.includes('hkust')) return 'assets/docs/png/logo-hongkong.png';
        if (name.includes('coursera')) return 'assets/img/coursera.png';
        return '';
    }
    function stableId(prefix, item) {
        const badgeId = item.url?.match(/\/badges\/([^/?#]+)/)?.[1];
        if (badgeId) return `${prefix}-${badgeId}`;
        let hash = 2166136261;
        for (const character of `${item.title}|${item.date}|${item.url}`) hash = Math.imul(hash ^ character.charCodeAt(0),16777619);
        return `${prefix}-${(hash >>> 0).toString(16)}`;
    }

    const records = [];
    const byVerification = new Map();
    const aliases = new Map();
    function add(input) {
        if (!Object.hasOwn(types, input.type)) throw new Error(`Categoría de credencial no definida: ${input.id}`);
        const issued = parseDate(input.issuedOn || (input.dateType === 'expiry' ? '' : input.date));
        const expires = parseDate(input.expiresOn || (input.dateType === 'expiry' ? input.date : ''));
        const verifyLink = /^https?:\/\//i.test(input.verifyLink || input.url || '') ? input.verifyLink || input.url : '';
        const record = {
            ...input,
            provider: input.provider || input.issuer || '',
            mainImage: input.mainImage || input.img || '',
            verifyLink,
            issuedDisplay: issued.display,
            issuedOn: issued.iso,
            expiresDisplay: expires.display,
            expiresOn: expires.iso,
            sortDate: issued.sortValue,
            format: input.coursesCount || types[input.type].format,
            skills: input.skills || [],
            modules: input.modules || [],
            projects: input.projects || []
        };
        record.providerLogo = providerLogo(record.provider);
        record.searchText = normalizeText([record.title,record.provider,record.issuedDisplay,record.expiresDisplay,...record.skills].join(' '));
        const key = verificationKey(verifyLink);
        if (key && byVerification.has(key)) {
            const existing = byVerification.get(key);
            // Conservar la ficha principal y resolver también el identificador de la insignia duplicada.
            aliases.set(record.id, existing.id);
            return;
        }
        records.push(Object.freeze(record));
        if (key) byVerification.set(key, record);
    }
    Object.entries(window.certData || {}).forEach(([id, value]) => add({ ...value, id }));
    (window.gcpBadges || []).forEach(value => add({ ...value, id: stableId('skill-badge', value), type: 'skill-badge' }));
    (window.credlyBadges || []).forEach(value => add({ ...value, id: stableId('badge', value), type: 'badge' }));
    const byId = new Map(records.map(record => [record.id, record]));
    const compareTitle = (a,b) => a.title.localeCompare(b.title,'es') || a.id.localeCompare(b.id);
    const compareRecent = (a,b) => b.sortDate - a.sortDate || compareTitle(a,b);
    const compareCategory = (a,b) => types[a.type].order - types[b.type].order || compareRecent(a,b);
    const list = Object.freeze([...records].sort(compareCategory));
    const counts = Object.freeze(Object.fromEntries(Object.keys(types).map(type => [type,list.filter(record => record.type === type).length])));
    const get = id => byId.get(aliases.get(id) || id);
    const detailHref = (id, catalogState = '') => `portfolio_details.html?id=${encodeURIComponent(id)}${catalogState ? `&catalog=${encodeURIComponent(catalogState)}` : ''}`;
    const sort = (values, mode = 'category') => [...values].sort(mode === 'recent' ? compareRecent : mode === 'title' ? compareTitle : compareCategory);
    function readState(source = '') {
        const params = source instanceof URLSearchParams ? source : new URLSearchParams(source);
        const type = params.get('credentialType');
        const order = params.get('credentialSort');
        return {
            type: Object.hasOwn(types,type) ? type : 'all',
            query: (params.get('credentialQuery') || '').trim().slice(0,200),
            sort: ['category','recent','title'].includes(order) ? order : 'category',
            expanded: params.get('credentialExpanded') === '1',
            open: params.get('credentialCatalog') === '1'
        };
    }
    function stateQuery(state) {
        const params = new URLSearchParams();
        if (state.type !== 'all' && Object.hasOwn(types,state.type)) params.set('credentialType',state.type);
        if (state.query) params.set('credentialQuery',state.query.trim().slice(0,200));
        if (['recent','title'].includes(state.sort)) params.set('credentialSort',state.sort);
        if (state.expanded) params.set('credentialExpanded','1');
        if (state.open) params.set('credentialCatalog','1');
        return params.toString();
    }
    const returnHref = state => `index.html${stateQuery(state) ? `?${stateQuery(state)}` : ''}#certifications`;
    const highlights = Object.freeze({
        learning: Object.freeze(['gcp-data-engineering','mlops','math-ml'].map(get))
    });
    window.credentialsCatalog = Object.freeze({ types, list, counts, highlights, get, detailHref, sort, normalizeText, parseDate, readState, stateQuery, returnHref });
})();
