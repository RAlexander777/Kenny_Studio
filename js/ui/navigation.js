/* Navegación: transición glitch al saltar entre secciones, scrollspy,
   logo flotante del navbar y menú móvil. */

export function initNavigation() {
    initAnchorTransitions();
    initScrollSpy();
    initFloatingLogo();
    initMobileMenu();
}

/* --- Transición glitch y salto a la sección --- */
function initAnchorTransitions() {
    const glitchOverlay = document.getElementById('global-glitch');
    if (!glitchOverlay) return;

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            event.preventDefault();

            glitchOverlay.classList.remove('active');
            void glitchOverlay.offsetWidth; /* Reinicia la animación */
            glitchOverlay.classList.add('active');

            setTimeout(() => targetEl.scrollIntoView({ behavior: 'auto' }), 150);
        });
    });
}

/* --- Scrollspy: marca el enlace de la sección visible --- */
function initScrollSpy() {
    const sections = document.querySelectorAll(
        'header.hero, section.cyber-container, footer.cyber-footer',
    );
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    const spyObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const currentId = entry.target.getAttribute('id');

                navLinks.forEach((link) => {
                    const isCurrent = link.getAttribute('href') === `#${currentId}`;
                    link.classList.toggle('active', isCurrent);
                    if (isCurrent) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        },
        {
            threshold: 0.3,
            rootMargin: '-10% 0px -50% 0px',
        },
    );

    sections.forEach((section) => spyObserver.observe(section));
}

/* --- El logo del hero se convierte en logo del navbar al scrollear --- */
function initFloatingLogo() {
    const heroSection = document.querySelector('.hero');
    const heroIcon = document.getElementById('hero-icon');
    const navIconContainer = document.getElementById('nav-icon-container');

    if (!heroSection || !heroIcon || !navIconContainer) return;

    const scrollObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const leaving = !entry.isIntersecting;
                navIconContainer.classList.toggle('nav-icon-visible', leaving);
                heroIcon.classList.toggle('hero-icon-faded', leaving);
            });
        },
        { threshold: 0.2 },
    );

    scrollObserver.observe(heroSection);
}

/* --- Menú móvil --- */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!menuBtn || !menuOverlay) return;

    const setMenuState = (isOpen) => {
        menuBtn.classList.toggle('open', isOpen);
        menuOverlay.classList.toggle('active', isOpen);

        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuOverlay.setAttribute('aria-hidden', String(!isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    };

    menuBtn.addEventListener('click', () => {
        setMenuState(!menuOverlay.classList.contains('active'));
    });

    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuOverlay.classList.contains('active')) {
            setMenuState(false);
            menuBtn.focus();
        }
    });
}
