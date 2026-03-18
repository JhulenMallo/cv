// ─────────────────────────────────────────────────────────────────────────────
//  render-certs.js  —  Genera dinámicamente las tarjetas de certificaciones
//  Fuentes de datos (deben cargarse antes que este script):
//    · window.certData      → certificates-data_v2.js  (24 certs detalladas)
//    · window.gcpBadges     → certificates-data_v2.js  (55 GCP Skill Boost)
//    · window.credlyBadges  → credlyBadges.js          (28 Credly badges)
// ─────────────────────────────────────────────────────────────────────────────

(function () {

    // ── Gradientes por key de certData ────────────────────────────────────────
    const GRADIENTS = {
        'powerbi-data-analyst':                    '135deg, #0078d4, #004578',
        'tensorflow':                               '135deg, #ff6f00, #e65100',
        'associate-cloud-engineer':                '135deg, #4285f4, #34a853',
        'gcp-cloud-computing-foundations':         '135deg, #4285f4, #0f9d58',
        'gcp-cloud-engineer-cert':                 '135deg, #4285f4, #34a853',
        'gcp-architecting-compute-engine':         '135deg, #4285f4, #1e293b',
        'deep-learning':                            '135deg, #22c55e, #16a34a',
        'gcp-cloud-data-engineer-cert':            '135deg, #4285f4, #0f9d58',
        'aws-practical-data-science':              '135deg, #ff9900, #232f3e',
        'math-ml':                                 '135deg, #ff6b35, #ff9e7d',
        'linux-open-source':                       '135deg, #1a6b2f, #0a3318',
        'mlops':                                   '135deg, #0f172a, #1e293b',
        'nlp':                                     '135deg, #001d6c, #005fb8',
        'gcp-data-engineering':                    '135deg, #4285f4, #fbbc05',
        'gans':                                    '135deg, #8b5cf6, #6d28d9',
        'mathematics-engineers':                   '135deg, #5b21b6, #7c3aed',
        'aws-fundamentals':                        '135deg, #ff9900, #232f3e',
        'gcp-database-engineer':                   '135deg, #1565c0, #0d47a1',
        'ds-fundamentals-python-sql':              '135deg, #1f70c1, #0f172a',
        'data-analysis-visualization-foundations': '135deg, #0f62fe, #1e293b',
        'applied-data-science':                    '135deg, #0f62fe, #1f70c1',
        'intro-data-science':                      '135deg, #0f172a, #1f70c1',
        'data-science':                            '135deg, #0f62fe, #001d6c',
        'ibm-data-analyst':                        '135deg, #1f70c1, #001d6c',
        'web-design':                              '135deg, #00274c, #0058a3',
        'web-applications':                        '135deg, #00274c, #ffcb05',
    };

    // ── Keys que son certificaciones (resto = especializaciones) ──────────────
    const CERT_KEYS = new Set([
        'associate-cloud-engineer',
        'gcp-cloud-computing-foundations',
        'data-science',
        'ibm-data-analyst',
    ]);

    // ── Logo a partir del campo provider ─────────────────────────────────────
    function providerLogo(provider) {
        if (!provider) return null;
        const p = provider.toLowerCase();
        if (p.includes('microsoft'))                         return ['assets/docs/png/logo-microsoft.png',          'Microsoft'];
        if (p.includes('deeplearning'))                      return ['assets/docs/png/logo-deeplearning.png',       'DeepLearning.AI'];
        if (p.includes('google cloud'))                      return ['assets/docs/png/logo-googlecloud.png',        'Google Cloud'];
        if (p.includes('amazon') || p.includes('aws'))       return ['assets/docs/png/logo-aws.png',                'AWS'];
        if (p.includes('linux foundation'))                  return ['assets/docs/png/logo-linuxfoundations.png',   'Linux Foundation'];
        if (p.includes('ibm'))                               return ['assets/docs/png/logo-ibm.png',                'IBM'];
        if (p.includes('michigan'))                          return ['assets/docs/png/logo-universitymichigan.png', 'Univ. Michigan'];
        if (p.includes('hkust') || p.includes('hong kong')) return ['assets/docs/png/logo-hongkong.png',           'HKUST'];
        return null;
    }

    function logoHTML(src, alt, fallback) {
        if (src) return `<img src="${src}" alt="${alt}">`;
        // Texto abreviado para proveedores sin logo
        const text = (fallback || alt || '').split(/[\s-]+/).slice(0, 2).join(' ');
        return `<span style="font-size:10px;font-weight:700;color:#93c5fd;letter-spacing:.5px;line-height:1.3">${text}</span>`;
    }

    function esc(s) {
        return (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ── Tarjeta: certData ─────────────────────────────────────────────────────
    function certCard(key, cert) {
        const isCert  = CERT_KEYS.has(key);
        const type    = isCert ? 'certification' : 'specialization';
        const tag     = isCert ? 'Certificación' : 'Especialización';
        const grad    = GRADIENTS[key] || '135deg, #334155, #1e293b';
        const logo    = providerLogo(cert.provider);
        const [lsrc, lalt] = logo || [null, null];
        const img     = esc(cert.mainImage || '');
        const title   = esc(cert.title || key);
        const prov    = esc(cert.provider || '');

        const btnHref  = cert.directLink || `portfolio_details.html?id=${key}`;
        const btnAttrs = cert.directLink ? ' target="_blank" rel="noopener noreferrer"' : '';
        const btnLabel = cert.directLink ? 'Ver Credencial' : 'Ver Detalles';

        return `
            <div class="col-lg-4 col-md-6 certification-card" data-type="${type}">
                <div class="prop-g-card">
                    <div class="prop-g-img-container" style="background:linear-gradient(${grad});">
                        <span class="prop-g-tag">${tag}</span>
                        <a href="${img}" data-fancybox="gallery" data-caption="${title}">
                            <img src="${img}" alt="${title}" class="prop-g-img" loading="lazy">
                        </a>
                    </div>
                    <div class="prop-g-body">
                        <div class="prop-g-logo-wrapper">${logoHTML(lsrc, lalt, cert.provider)}</div>
                        <h3 class="prop-g-title">${title}</h3>
                        <div class="prop-g-provider">${prov}</div>
                        <a href="${btnHref}"${btnAttrs} class="prop-g-btn d-inline-block">${btnLabel}</a>
                    </div>
                </div>
            </div>`;
    }

    // ── Tarjeta: gcpBadges ────────────────────────────────────────────────────
    function gcpBadgeCard(badge) {
        const title = esc(badge.title || '');
        const date  = esc(badge.date  || '');
        return `
            <div class="col-lg-4 col-md-6 certification-card" data-type="skill-badge">
                <div class="prop-g-card">
                    <div class="prop-g-img-container" style="background:linear-gradient(135deg, #4285f4, #34a853);">
                        <span class="prop-g-tag">Skill Badge</span>
                        <a href="${badge.img}" data-fancybox="gallery" data-caption="${title}">
                            <img src="${badge.img}" alt="${title}" class="prop-g-img" loading="lazy">
                        </a>
                    </div>
                    <div class="prop-g-body">
                        <div class="prop-g-logo-wrapper"><img src="assets/docs/png/logo-googlecloud.png" alt="Google Cloud"></div>
                        <h3 class="prop-g-title">${title}</h3>
                        <div class="prop-g-provider">GCP Skills Boost • ${date}</div>
                        <a href="${badge.url}" target="_blank" rel="noopener noreferrer" class="prop-g-btn d-inline-block">Ver Badge</a>
                    </div>
                </div>
            </div>`;
    }

    // ── Meta visual para credlyBadges ─────────────────────────────────────────
    function credlyMeta(badge) {
        if (badge.issuer === 'Google Cloud')
            return ['assets/docs/png/logo-googlecloud.png', 'Google Cloud',    '135deg, #4285f4, #34a853'];
        if (badge.issuer === 'Cisco')
            return [null,                              'Cisco',            '135deg, #1b4f72, #0d2137'];
        // Coursera — distinguir por título
        const t = badge.title || '';
        if (t.includes('Deep Learning') || t.includes('Applied Data Science Spec'))
            return ['assets/docs/png/logo-deeplearning.png',     'DeepLearning.AI',  '135deg, #22c55e, #16a34a'];
        if (t.includes('Open Source') || t.includes('Linux'))
            return ['assets/docs/png/logo-linuxfoundations.png', 'Linux Foundation', '135deg, #1a6b2f, #0a3318'];
        // Default Coursera → IBM
        return ['assets/docs/png/logo-ibm.png', 'IBM / Coursera', '135deg, #0f62fe, #001d6c'];
    }

    // ── Tarjeta: credlyBadges ─────────────────────────────────────────────────
    function credlyBadgeCard(badge) {
        const title = esc(badge.title || '');
        const [lsrc, lalt, grad] = credlyMeta(badge);
        const dateLabel = badge.dateType === 'expiry'
            ? `Expira: ${badge.date}`
            : (badge.date || '');
        return `
            <div class="col-lg-4 col-md-6 certification-card" data-type="badge">
                <div class="prop-g-card">
                    <div class="prop-g-img-container" style="background:linear-gradient(${grad});">
                        <span class="prop-g-tag">Badge</span>
                        <a href="${badge.img}" data-fancybox="gallery" data-caption="${title}">
                            <img src="${badge.img}" alt="${title}" class="prop-g-img" loading="lazy">
                        </a>
                    </div>
                    <div class="prop-g-body">
                        <div class="prop-g-logo-wrapper">${logoHTML(lsrc, lalt, badge.issuer)}</div>
                        <h3 class="prop-g-title">${title}</h3>
                        <div class="prop-g-provider">${esc(badge.issuer)} • ${esc(dateLabel)}</div>
                        <a href="${badge.url}" target="_blank" rel="noopener noreferrer" class="prop-g-btn d-inline-block">Ver Badge</a>
                    </div>
                </div>
            </div>`;
    }

    // ── Renderizado principal ─────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        const container = document.getElementById('certCardsContainer');
        if (!container) return;

        const html = [];

        if (window.certData) {
            Object.entries(window.certData).forEach(([key, cert]) => {
                html.push(certCard(key, cert));
            });
        }

        if (window.gcpBadges) {
            window.gcpBadges.forEach(b => html.push(gcpBadgeCard(b)));
        }

        if (window.credlyBadges) {
            window.credlyBadges.forEach(b => html.push(credlyBadgeCard(b)));
        }

        container.innerHTML = html.join('');
    });

})();
