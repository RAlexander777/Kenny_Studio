/* Secuencia de arranque tipo BIOS. */

export function initBootSequence() {
    const bootScreen = document.getElementById('boot-sequence');
    const bootLines = document.querySelectorAll('.boot-line');
    const bootBar = document.getElementById('boot-bar');

    if (!bootScreen) return;

    setTimeout(() => { if (bootLines[0]) bootLines[0].style.opacity = 1; }, 100);
    setTimeout(() => { if (bootLines[1]) bootLines[1].style.opacity = 1; }, 400);
    setTimeout(() => { if (bootLines[2]) bootLines[2].style.opacity = 1; }, 700);

    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 10;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            bootBar.innerHTML = '[||||||||||] 100% - ACCESO CONCEDIDO';

            setTimeout(() => bootScreen.classList.add('hidden'), 500);
            return;
        }

        const bars = '|'.repeat(Math.floor(progress / 10)).padEnd(10, '.');
        bootBar.innerHTML = `[${bars}] ${progress}%`;
    }, 100);

    /* Cierre de seguridad: si la carga se demora, no encerrar al visitante. */
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!bootScreen.classList.contains('hidden')) {
                bootScreen.classList.add('hidden');
            }
        }, 2000);
    });
}
