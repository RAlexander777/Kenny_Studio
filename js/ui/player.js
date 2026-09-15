/* Reproductor de música de fondo y ocultado de los widgets flotantes. */

export function initPlayer() {
    const audio = document.getElementById('bgm-audio');
    const player = document.getElementById('sh-player');
    const floatingWidgets = document.getElementById('floating-widgets');
    const playBtn = document.getElementById('sh-play-btn');
    const playIcon = playBtn ? playBtn.querySelector('i') : null;
    const progressBar = document.getElementById('sh-fill');
    const timeDisplay = document.getElementById('sh-time');
    const toggleBtn = document.getElementById('sh-toggle');
    const shHeader = document.querySelector('.sh-header');
    const volumeSlider = document.getElementById('sh-volume');

    initFloatingWidgetsScroll(floatingWidgets);

    if (player && toggleBtn && shHeader) {
        shHeader.addEventListener('click', () => player.classList.toggle('collapsed'));
    }

    if (audio && volumeSlider) {
        volumeSlider.addEventListener('input', (event) => {
            audio.volume = event.target.value;
        });

        audio.volume = volumeSlider.value;
    }

    if (!audio || !playBtn) return;

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon?.classList.replace('fa-play', 'fa-pause');
        } else {
            audio.pause();
            playIcon?.classList.replace('fa-pause', 'fa-play');
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = `${percent}%`;
        }

        const mins = Math.floor(audio.currentTime / 60);
        const secs = String(Math.floor(audio.currentTime % 60)).padStart(2, '0');
        if (timeDisplay) timeDisplay.textContent = `${mins}:${secs}`;
    });

    audio.addEventListener('ended', () => {
        playIcon?.classList.replace('fa-pause', 'fa-play');
        if (progressBar) progressBar.style.width = '0%';
        if (timeDisplay) timeDisplay.textContent = '00:00';
    });
}

/* --- Oculta el bloque flotante al bajar y lo muestra al subir --- */
function initFloatingWidgetsScroll(floatingWidgets) {
    if (!floatingWidgets) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            floatingWidgets.classList.add('scroll-hidden');
        } else if (currentScrollY < lastScrollY) {
            floatingWidgets.classList.remove('scroll-hidden');
        }

        lastScrollY = currentScrollY;
    });
}
