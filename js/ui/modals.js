/* Modales de proyectos por servicio. */

export function initModals() {
    const triggers = document.querySelectorAll('.modal-trigger');
    const closeButtons = document.querySelectorAll('.close-modal');
    const overlays = document.querySelectorAll('.cyber-modal-overlay');

    if (!overlays.length) return;

    let lastFocused = null;

    const openModal = (modal) => {
        lastFocused = document.activeElement;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) closeBtn.focus();
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        /* Restaura el scroll solo si no queda otro modal abierto. */
        if (!document.querySelector('.cyber-modal-overlay.active')) {
            document.body.style.overflow = 'auto';
        }

        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    };

    const activeModal = () => document.querySelector('.cyber-modal-overlay.active');

    triggers.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.getElementById(btn.getAttribute('data-modal'));
            if (target) openModal(target);
        });
    });

    closeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.cyber-modal-overlay');
            if (modal) closeModal(modal);
        });
    });

    overlays.forEach((overlay) => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) closeModal(overlay);
        });
    });

    /* Cierre con Escape. */
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        const modal = activeModal();
        if (modal) closeModal(modal);
    });
}
