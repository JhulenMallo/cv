'use strict';

// Comportamiento compartido por la portada y todas sus páginas derivadas.
(() => {
function initNavigation() {
    const menu = document.getElementById('navbarNav');
    const toggle = document.getElementById('menuToggle');
    if (!menu || !toggle) return;
    const setMenu = open => {
        menu.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            toggle.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('.nav-shell') && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
    });
    const mobile = window.matchMedia('(max-width: 800px)');
    mobile.addEventListener('change', () => setMenu(false));

    const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    const active = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active', active);
                    if (active) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-15% 0px -65% 0px' });
        document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    }
}

function initTheme() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const update = light => {
        document.documentElement.toggleAttribute('data-theme', light);
        if (light) document.documentElement.setAttribute('data-theme', 'light');
        toggle.setAttribute('aria-pressed', String(light));
        toggle.setAttribute('aria-label', light ? 'Activar tema oscuro' : 'Activar tema claro');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
    };
    update(document.documentElement.getAttribute('data-theme') === 'light');
    toggle.addEventListener('click', () => {
        const light = document.documentElement.getAttribute('data-theme') !== 'light';
        update(light);
        try { localStorage.setItem('portfolio-theme', light ? 'light' : 'dark'); } catch (_) { /* Preferencia solo durante esta visita. */ }
    });
}


function initializeSite() {
    initNavigation();
    initTheme();
    const year = document.getElementById('footerYear');
    if (year) year.textContent = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'America/La_Paz' }).format(new Date());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeSite);
else initializeSite();
})();
