document.addEventListener('DOMContentLoaded', () => {
    // 1. Alternancia de Modo Día / Noche
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const moonIcon = document.querySelector('.dark-icon');
    const sunIcon = document.querySelector('.light-icon');

    themeBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
        }
    });

    // 2. Lógica del Acordeón para Servicios
    const serviceHeaders = document.querySelectorAll('.service-header');

    serviceHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('active');

            // Cierra todos los servicios previamente abiertos
            document.querySelectorAll('.service-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('i.fa-chevron-down').style.transform = 'rotate(0deg)';
            });

            // Si no estaba activo, se despliega
            if (!isActive) {
                currentItem.classList.add('active');
                header.querySelector('i.fa-chevron-down').style.transform = 'rotate(180deg)';
                header.querySelector('i.fa-chevron-down').style.transition = 'transform 0.3s ease';
            }
        });
    });

    // 3. (Opcional) Efecto de escritura progresiva para la terminal
    // Se puede implementar un Typewriter effect aquí si se requiere mayor dinamismo.
});

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    const heroIcon = document.getElementById('hero-icon');
    const navIconContainer = document.getElementById('nav-icon-container');

    // Configuración del observador
    const observerOptions = {
        threshold: 0.2 // Se activa cuando el 20% del hero deja de ser visible
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // El usuario ha pasado el Hero: Mostrar en Navbar, ocultar en Hero
                navIconContainer.classList.add('nav-icon-visible');
                heroIcon.classList.add('hero-icon-faded');
            } else {
                // El usuario está en el Hero: Ocultar en Navbar, mostrar en Hero
                navIconContainer.classList.remove('nav-icon-visible');
                heroIcon.classList.remove('hero-icon-faded');
            }
        });
    }, observerOptions);

    scrollObserver.observe(heroSection);
});