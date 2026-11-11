// Aplicar la preferencia antes de mostrar cualquier página.
(() => {
    try {
        if (localStorage.getItem('portfolio-theme') === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
    } catch (_) { /* Tema oscuro predeterminado sin almacenamiento. */ }
})();
