// ============================================
// FIX NAVEGACIÓN CON HASH - DEBE IR PRIMERO
// ============================================
(function() {
    'use strict';
    
    if (window.location.hash) {
        // Prevenir scroll restoration del navegador
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
            // Restaurar después de que se complete la navegación
            window.addEventListener('load', function() {
                setTimeout(function() {
                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'auto';
                    }
                }, 500);
            });
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
document.addEventListener("DOMContentLoaded", function () {
        // Theme Toggle Logic
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        // Retrieve saved theme or default to dark
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                
                if (isLight) {
                    document.documentElement.removeAttribute('data-theme');
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    localStorage.setItem('portfolio-theme', 'dark');
                } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    localStorage.setItem('portfolio-theme', 'light');
                }
            });
        }
        
        const navbar = document.querySelector(".navbar");
        const links = document.querySelectorAll(".nav-link");
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
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

// Modal functionality handled by Fancybox (Legacy code removed)

// NUEVAS FUNCIONES PARA LA SECCIÓN DE CERTIFICACIONES

// Certification Details Functionality (handled by separate pages or legacy removed)

// =============================================
// Show More / filtrado para certificaciones
// =============================================

const CERTS_LIMIT = 6;

/** Marca con .over-limit las tarjetas visibles que exceden el límite */
function applyOverLimit(container) {
    if (!container) return 0;
    const allCards = container.querySelectorAll('.certification-card');
    let visibleCount = 0;
    
    //console.log("Aplicando límite de certificaciones. Total encontradas:", allCards.length);
    
    allCards.forEach(card => {
        card.classList.remove('over-limit');
        if (!card.classList.contains('hidden')) {
            visibleCount++;
            if (visibleCount > CERTS_LIMIT) {
                card.classList.add('over-limit');
                // Si el contenedor está colapsado, forzamos ocultación por JS como backup
                if (container.classList.contains('collapsed')) {
                    card.style.setProperty('display', 'none', 'important');
                }
            } else {
                // Asegurar que las primeras 6 sean visibles si el contenedor está colapsado
                if (container.classList.contains('collapsed')) {
                    card.style.display = ''; // Usar CSS default
                }
            }
        }
    });
    return visibleCount;
}

// Sistema de "Mostrar más" para certificaciones
function initShowMoreCerts() {
    const container = document.getElementById('certCardsContainer');
    const showMoreBtn = document.getElementById('showMoreBtn');

    if (!container || !showMoreBtn) return;

    // Estado inicial: marcamos over-limit y colapsamos
    container.classList.add('collapsed');
    const visible = applyOverLimit(container);
    
    if (visible > CERTS_LIMIT) {
        showMoreBtn.style.display = 'inline-block';
        showMoreBtn.innerHTML = 'Mostrar más certificaciones <i class="fas fa-chevron-down"></i>';
    } else {
        showMoreBtn.style.display = 'none';
    }

    showMoreBtn.addEventListener('click', function () {
        const isCollapsed = container.classList.contains('collapsed');

        if (isCollapsed) {
            // Mostrar todas: remover collapsed y marcas over-limit (limpiar estilos inline)
            container.classList.remove('collapsed');
            const hiddenCards = container.querySelectorAll('.certification-card.over-limit');
            hiddenCards.forEach(card => {
                card.classList.add('fade-out');
                card.style.display = ''; // Limpiar fallback JS
            });

            showMoreBtn.innerHTML = 'Mostrar menos <i class="fas fa-chevron-up"></i>';
            showMoreBtn.classList.add('expanded');
            
            // Forzar reflow y quitar fade-out para iniciar transición
            setTimeout(() => {
                hiddenCards.forEach(card => card.classList.remove('fade-out'));
            }, 50);

            setTimeout(() => {
                showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        } else {
            // Animar salida al colapsar
            const hiddenCards = container.querySelectorAll('.certification-card.over-limit');
            hiddenCards.forEach(card => card.classList.add('fade-out'));

            setTimeout(() => {
                container.classList.add('collapsed');
                // Aplicar fallback JS
                hiddenCards.forEach(card => {
                    card.style.setProperty('display', 'none', 'important');
                    card.classList.remove('fade-out');
                });
                showMoreBtn.innerHTML = 'Mostrar más certificaciones <i class="fas fa-chevron-down"></i>';
                showMoreBtn.classList.remove('expanded');

                document.getElementById('certifications').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 400); 
        }
    });
}

// Sistema de filtros para certificaciones
function initCertificationsFilter() {
    const filterBtns = document.querySelectorAll('.cert-filter-btn');
    const cards = document.querySelectorAll('.certification-card');
    const container = document.getElementById('certCardsContainer');
    const showMoreBtn = document.getElementById('showMoreBtn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Fase 1: fade-out de todas las tarjetas actualmente visibles
            cards.forEach(card => { card.classList.add('fade-out'); });

            setTimeout(() => {
                // Fase 2: aplicar la visibilidad según el filtro
                cards.forEach(card => {
                    const cardType = card.getAttribute('data-type');
                    if (filterValue === 'all' || cardType === filterValue) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });

                // Fase 3: re-calcular over-limit y actualizar botón Show More
                // Resetear a estado colapsado al cambiar el filtro ANTES de calcular over-limit
                container.classList.add('collapsed');
                showMoreBtn.classList.remove('expanded');
                showMoreBtn.innerHTML = 'Mostrar más certificaciones <i class="fas fa-chevron-down"></i>';

                const visibleCount = applyOverLimit(container);

                if (showMoreBtn) {
                    showMoreBtn.style.display = visibleCount > CERTS_LIMIT ? 'inline-block' : 'none';
                }

                // Fase 4: remover fade-out un leve instante después de aplicarse el cambio de display
                // Esto fuerza el "reflow" en el browser, así CSS puede animar de opacity 0 a 1 correctamente.
                setTimeout(() => {
                    cards.forEach(card => {
                        card.classList.remove('fade-out');
                    });
                }, 50);

            }, 420);
        });
    });
}

// Certification Keyboard Controls (Legacy removed as Fancybox handles it)

// Animación de entrada inicial para certificaciones
function initCertAnimations() {
    window.addEventListener('load', function() {
        const cards = document.querySelectorAll('.certification-card');
        let animatedCount = 0;
        cards.forEach((card) => {
            // Solo animar si no está oculta por filtro ni por límite
            if (!card.classList.contains('hidden') && !card.classList.contains('over-limit')) {
                setTimeout(() => {
                    card.classList.add('cert-fade-in-up');
                }, animatedCount * 100);
                animatedCount++;
            }
        });
    });
}


// Función para guardar scroll pos antes de navegar
function initScrollMemory() {
    const detailButtons = document.querySelectorAll('.cert-details-btn');
    
    // Si estamos en index y hay un scroll guardado, restaurarlo (solo en carga sin hash)
    const savedScroll = sessionStorage.getItem('portfolio-scroll-pos');
    const isIndexPage = window.location.pathname.endsWith('index.html') ||
                        window.location.pathname.endsWith('/') ||
                        window.location.pathname.endsWith('/cv') ||
                        window.location.pathname.endsWith('/cv/');
    if (savedScroll && isIndexPage) {
        // Solo restaurar si no venimos con una ancla específica o después del hash-fix
        setTimeout(() => {
            if (!document.documentElement.classList.contains('loading-hash')) {
                window.scrollTo({
                    top: parseInt(savedScroll, 10),
                    behavior: 'instant'
                });
                // Limpiar después de usar
                sessionStorage.removeItem('portfolio-scroll-pos');
            }
        }, 100);
    }
    
    // Guardar posición al hacer clic en ver detalles
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // No prevenimos el default porque queremos que navegue por el href,
            // (algunos botones usan onclick, así que interceptamos de todas formas)
            sessionStorage.setItem('portfolio-scroll-pos', window.scrollY.toString());
        });
    });
}

// Render Skills Dinámico
function initSkillsRender() {
    const container = document.getElementById('skills-container');
    if (!container || !window.skillsData) return;
    
    let html = '';
    window.skillsData.forEach(category => {
        let skillsHtml = '';
        category.skills.forEach(skill => {
            skillsHtml += `
                <div class="skill-item">
                    <span>${skill.name}</span>
                    <div class="skill-bar"><div class="skill-progress" style="width: ${skill.progress}%"></div></div>
                </div>
            `;
        });
        
        html += `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="skill-card">
                    <div class="skill-icon">
                        <i class="${category.icon}"></i>
                    </div>
                    <h4>${category.category}</h4>
                    <div class="skill-list">
                        ${skillsHtml}
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Render Experiencia, Educación y Docencia Dinámico
function initExperienceRender() {
    const expContainer = document.getElementById('experience-container');
    if (expContainer && window.experienceData) {
        let expHtml = '';
        window.experienceData.forEach(job => {
            let reqHtml = '';
            if (job.keyResponsibilities) {
                 reqHtml += `<h5>${job.keyResponsibilitiesTitle}</h5><ul class="experience-highlights">`;
                 job.keyResponsibilities.forEach(req => reqHtml += `<li>${req}</li>`);
                 reqHtml += `</ul>`;
            }
            if (job.impact) {
                reqHtml += `<h5>${job.impactTitle}</h5><ul class="experience-highlights">`;
                job.impact.forEach(imp => reqHtml += `<li>${imp}</li>`);
                reqHtml += `</ul>`;
            }
            let techHtml = '<div class="tech-stack">';
            if (job.techStack) {
                job.techStack.forEach(t => techHtml += `<span class="tech-tag">${t}</span>`);
            }
            techHtml += '</div>';

            expHtml += `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${job.date}</div>
                        <h3>${job.title}</h3>
                        <h4>${job.company}</h4>
                        <p>${job.description}</p>
                        ${reqHtml ? '<div class="achievement-section">' + reqHtml + techHtml + '</div>' : techHtml}
                    </div>
                </div>
            `;
        });
        expContainer.innerHTML = expHtml;
    }

    const eduContainer = document.getElementById('education-container');
    if (eduContainer && window.educationData) {
        let eduHtml = '';
        window.educationData.forEach(edu => {
            eduHtml += `
                <div class="education-card ${edu.statusClass}">
                    <div class="education-icon">
                        <i class="${edu.icon}"></i>
                    </div>
                    <div class="education-content">
                        <div class="education-status">${edu.status}</div>
                        <h4>${edu.title}</h4>
                        <h5>${edu.subtitle}</h5>
                        <div class="education-period">${edu.date}</div>
                        <div class="education-institution">${edu.institution}</div>
                        <p>${edu.description}</p>
                    </div>
                </div>
            `;
        });
        eduContainer.innerHTML = eduHtml;
    }

    const teachContainer = document.getElementById('teaching-container');
    if (teachContainer && window.teachingData) {
        let teachHtml = '';
        window.teachingData.forEach(teach => {
            const titleLink = teach.link !== '#' ? `<a href="${teach.link}" target="_blank" class="teaching-link">${teach.title}</a>` : `<a href="#" class="teaching-link">${teach.title}</a>`;
            teachHtml += `
                <div class="col-lg-6 col-md-6">
                    <div class="teaching-card">
                        <div class="teaching-icon">
                            <i class="${teach.icon}"></i>
                        </div>
                        <div class="teaching-content">
                            <h4 class="teaching-title">
                                ${titleLink}
                            </h4>
                            <p class="teaching-description">${teach.description}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        teachContainer.innerHTML = teachHtml;
    }
}


// Nav Scroll Spy
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remover active de todos
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Agregar active al correspondiente
                const id = entry.target.getAttribute('id');
                if(id) {
                    const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            }
        });
    }, {
        rootMargin: '-30% 0px -70% 0px' 
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}


function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Inyectar Data Dinámica (Fase 2)
    initSkillsRender();
    initExperienceRender();

    // Inicializar red neuronal (D3 cargado con defer, disponible en DOMContentLoaded)
    if (typeof d3 !== 'undefined') {
        initNeuralNetwork();
    } else {
        window.addEventListener('load', initNeuralNetwork);
    }
    
    // Inicializar funciones originales
    initPortfolioFilter();

    // Inicializar nuevas funciones de certificaciones
    initCertificationsFilter();
    initCertAnimations();
    initShowMoreCerts(); // Nueva función para mostrar más
    initScrollMemory();
    initBackToTop();
    initScrollSpy(); // Sistema para recordar vista de certificaciones
});

// Handle window resize for neural network
window.addEventListener('resize', function() {
    const svg = d3.select("#neural-svg");
    if (window.innerWidth < 768) {
        svg.attr("width", 400).attr("height", 250);
    } else {
        svg.attr("width", 700).attr("height", 450);
    }
    // Redibujar la red con las nuevas dimensiones
    initNeuralNetwork();
});