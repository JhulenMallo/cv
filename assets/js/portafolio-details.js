// Image Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    // Add click listeners to all clickable images
    function bindLightbox() {
        document.querySelectorAll('.clickable-img').forEach(img => {
            // Eliminar listener previo si existe para evitar duplicados
            img.removeEventListener('click', clickHandler);
            img.addEventListener('click', clickHandler);
        });
    }

    function clickHandler(e) {
        const caption = this.getAttribute('data-caption') || this.alt;
        lightboxImage.src = this.src;
        lightboxImage.alt = this.alt;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    bindLightbox();
    document.addEventListener('content-loaded', bindLightbox);


    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Asegurarnos de que todavía sea un ancla en el momento del click 
            // (el script principal podría haber cambiado el href dinámicamente)
            if (!href.startsWith('#') || href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});