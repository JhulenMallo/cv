// ============================================
// FIX NAVEGACIÓN CON HASH - DEBE IR PRIMERO
// ============================================
(function() {
    'use strict';
    
    if (window.location.hash) {
        // Prevenir scroll restoration del navegador
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        // Agregar clase al HTML para desactivar scroll suave
        document.documentElement.classList.add('loading-hash');
        
        // Forzar posición en top inmediatamente
        window.scrollTo(0, 0);
        
        // Guardar el hash
        const targetHash = window.location.hash;
        
        // Función para navegar a la sección
        function navigateToHash() {
            const target = document.querySelector(targetHash);
            if (target) {
                // Calcular posición y hacer scroll instantáneo
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo(0, targetPosition);
                
                // Remover clase después de posicionar
                setTimeout(() => {
                    document.documentElement.classList.remove('loading-hash');
                }, 150);
            }
        }
        
        // Ejecutar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', navigateToHash);
        } else {
            navigateToHash();
        }
        
        // Backup por si acaso
        window.addEventListener('load', navigateToHash);
    }
})();

// ============================================
// RED NEURONAL - TU CÓDIGO EXACTO INTEGRADO
// ============================================
function initNeuralNetwork() {
    const svg = d3.select("#neural-svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const numNodes = 40;   // cantidad de puntos
    const probLink = 0.10; // probabilidad de conexión
    let nodes, links;

    function generateNetwork() {
        // borrar todo lo anterior
        svg.selectAll("*").remove();

        // crear nodos
        nodes = d3.range(numNodes).map(i => ({
            id: i,
            x: Math.random() * width,
            y: Math.random() * height
        }));

        // crear conexiones aleatorias
        links = [];
        nodes.forEach(source => {
            nodes.forEach(target => {
                if (source !== target && Math.random() < probLink) {
                    links.push({source, target});
                }
            });
        });

        // dibujar nodos
        svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 8)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    function animateLinks() {
        let i = 0;
        function step() {
            if (i < links.length) {
                const link = links[i];
                svg.append("line")
                    .attr("x1", link.source.x)
                    .attr("y1", link.source.y)
                    .attr("x2", link.source.x)
                    .attr("y2", link.source.y)
                    .transition()
                    .duration(6000) // velocidad de crecimiento
                    .attr("x2", link.target.x)
                    .attr("y2", link.target.y);
                i++;
                setTimeout(step, 500); // intervalo entre conexiones
            } else {
                // cuando termine, reiniciar después de una pausa
                setTimeout(() => {
                    generateNetwork();
                    animateLinks();
                }, 1000);
            }
        }
        step();
    }

    // primera ejecución
    generateNetwork();
    animateLinks();
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu close
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

// Portfolio Filter (original)
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Show/hide items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Modal functionality (original)
function initModal() {
    const modal = new bootstrap.Modal(document.getElementById('certModal'));
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');

    document.querySelectorAll('.view-cert-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const img = this.getAttribute('data-img');

            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalImage.src = img;
            modalImage.alt = title;

            modal.show();
        });
    });
}

// NUEVAS FUNCIONES PARA LA SECCIÓN DE CERTIFICACIONES

// Función para abrir modal de imagen de certificación
function openCertModal(imageSrc) {
    const modal = document.getElementById('certImageModal');
    const modalImg = document.getElementById('certModalImage');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

// Función para cerrar modal de certificación
function closeCertModal() {
    const modal = document.getElementById('certImageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Función para mostrar detalles de certificación
function showCertDetails(certName, platform) {
    const platformNames = {
        'microsoft': 'Microsoft',
        'google': 'Google',
        'google-cloud': 'Google Cloud',
        'deeplearning': 'DeepLearning.AI',
        'coursera': 'Coursera',
        'ibm': 'IBM',
        'aws': 'Amazon Web Services',
        'linux': 'Linux Foundation',
        'michigan': 'University of Michigan'
    };
    
    alert(`Detalles de: ${certName}\nPlataforma: ${platformNames[platform]}\n\nAquí puedes agregar más información detallada sobre la certificación.`);
}

// Sistema de "Mostrar más" para certificaciones
function initShowMoreCerts() {
    const container = document.getElementById('certCardsContainer');
    const showMoreBtn = document.getElementById('showMoreBtn');
    
    if (!container || !showMoreBtn) return;
    
    // Inicialmente colapsar el contenedor
    container.classList.add('collapsed');
    
    showMoreBtn.addEventListener('click', function() {
        const isCollapsed = container.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expandir
            container.classList.remove('collapsed');
            showMoreBtn.innerHTML = 'Mostrar menos <i class="fas fa-chevron-up"></i>';
            showMoreBtn.classList.add('expanded');
            
            // Scroll suave hacia el botón después de expandir
            setTimeout(() => {
                showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        } else {
            // Colapsar
            container.classList.add('collapsed');
            showMoreBtn.innerHTML = 'Mostrar más certificaciones <i class="fas fa-chevron-down"></i>';
            showMoreBtn.classList.remove('expanded');
            
            // Scroll hacia la sección de certificaciones
            setTimeout(() => {
                document.getElementById('certifications').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    });
}

// Sistema de filtros para certificaciones con animación SIEMPRE consistente
function initCertificationsFilter() {
    const filterBtns = document.querySelectorAll('.cert-filter-btn');
    const cards = document.querySelectorAll('.certification-card');
    const container = document.getElementById('certCardsContainer');
    const showMoreBtn = document.getElementById('showMoreBtn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // SIEMPRE desvanecer todas las tarjetas sin excepciones
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-out');
                }, index * 30);
            });
            
            // Después del desvanecimiento, reorganizar
            setTimeout(() => {
                let visibleCount = 0;
                
                cards.forEach(card => {
                    const cardType = card.getAttribute('data-type');
                    
                    // Remover fade-out de todas las tarjetas
                    card.classList.remove('fade-out');
                    
                    if (filterValue === 'all' || cardType === filterValue) {
                        // Mostrar la tarjeta
                        card.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        // Ocultar la tarjeta
                        card.classList.add('hidden');
                    }
                });
                
                // Mostrar/ocultar botón "Mostrar más" según la cantidad de tarjetas visibles
                if (showMoreBtn) {
                    if (visibleCount > 6) {
                        showMoreBtn.style.display = 'inline-block';
                        // Si estaba expandido, colapsarlo al cambiar filtro
                        if (!container.classList.contains('collapsed')) {
                            container.classList.add('collapsed');
                            showMoreBtn.innerHTML = 'Mostrar más certificaciones <i class="fas fa-chevron-down"></i>';
                            showMoreBtn.classList.remove('expanded');
                        }
                    } else {
                        showMoreBtn.style.display = 'none';
                        container.classList.remove('collapsed');
                    }
                }
            }, 500);
        });
    });
}

// Cerrar modal de certificaciones con ESC
function initCertKeyboardControls() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCertModal();
        }
    });
    
    // Prevenir que el clic en la imagen cierre el modal
    const modalImage = document.getElementById('certModalImage');
    if (modalImage) {
        modalImage.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
}

// Animación de entrada inicial para certificaciones
function initCertAnimations() {
    window.addEventListener('load', function() {
        const cards = document.querySelectorAll('.certification-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('cert-fade-in-up');
            }, index * 100);
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Wait for D3 to load
    setTimeout(() => {
        initNeuralNetwork();
    }, 300);
    
    // Inicializar funciones originales
    initPortfolioFilter();
    initModal();
    
    // Inicializar nuevas funciones de certificaciones
    initCertificationsFilter();
    initCertKeyboardControls();
    initCertAnimations();
    initShowMoreCerts(); // Nueva función para mostrar más
});

// Handle window resize for neural network
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        d3.select("#neural-svg").attr("width", 400).attr("height", 250);
    } else {
        d3.select("#neural-svg").attr("width", 700).attr("height", 450);
    }
});