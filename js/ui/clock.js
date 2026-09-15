/* Reloj LED del navbar. */

export function initClock() {
    const clockElement = document.getElementById('sys-clock');
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        /* El parpadeo de los dos puntos lo resuelve CSS, no el texto. */
        const colon = '<span class="blink-colon">:</span>';
        clockElement.innerHTML = `${hours}${colon}${minutes}${colon}${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock();
}
