'use strict';

// Ampliación accesible e idéntica en el catálogo y en cualquier ficha de credencial.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const dialog = document.getElementById('imageLightbox');
        if (!dialog) return;
        const image = document.getElementById('lightboxImage');
        const caption = document.getElementById('lightboxCaption');
        let previousFocus;
        let previousOverflow;
        document.addEventListener('click', event => {
            const trigger = event.target.closest('[data-preview]');
            if (!trigger || trigger.disabled) return;
            previousFocus = trigger;
            previousOverflow = document.body.style.overflow;
            image.src = trigger.dataset.preview;
            image.alt = trigger.dataset.caption || '';
            caption.textContent = trigger.dataset.caption || '';
            dialog.showModal();
            document.body.style.overflow = 'hidden';
        });
        document.getElementById('lightboxClose').addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
        dialog.addEventListener('close', () => {
            document.body.style.overflow = previousOverflow || '';
            previousFocus?.focus();
        });
    });
})();
