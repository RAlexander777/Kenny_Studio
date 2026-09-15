/* Acordeón de especificaciones en las tarjetas de servicio.
   Al abrir una tarjeta se cierran las demás. */

export function initServicesAccordion() {
    const buttons = document.querySelectorAll('.toggle-desc-btn');
    if (!buttons.length) return;

    const collapseAll = () => {
        document.querySelectorAll('.service-card').forEach((card) => {
            card.classList.remove('expanded');
            card.querySelector('.toggle-desc-btn')?.setAttribute('aria-expanded', 'false');
        });
    };

    buttons.forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', () => {
            const card = btn.closest('.service-card');
            const wasExpanded = card.classList.contains('expanded');

            collapseAll();

            if (!wasExpanded) {
                card.classList.add('expanded');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}
