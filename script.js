document.addEventListener('DOMContentLoaded', () => {
    // 1. Alternancia de Modo Día / Noche (Con Video Dinámico)
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const thumbIcon = themeBtn.querySelector('.switch-thumb i');
    const heroVideoBg = document.getElementById('hero-video-bg'); // Detectar el video

    themeBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            // === CAMBIAR A MODO CLARO ===
            htmlEl.setAttribute('data-theme', 'light');
            thumbIcon.classList.remove('fa-moon');
            thumbIcon.classList.add('fa-sun');
            
            // Cambiar al video del tema claro
            if (heroVideoBg) {
                heroVideoBg.src = 'hero_video_light.mp4';
            }
        } else {
            // === CAMBIAR A MODO OSCURO ===
            htmlEl.setAttribute('data-theme', 'dark');
            thumbIcon.classList.remove('fa-sun');
            thumbIcon.classList.add('fa-moon');
            
            // Restaurar al video del tema oscuro
            if (heroVideoBg) {
                heroVideoBg.src = 'hero_video.mp4';
            }
        }
    });

    // 2. Lógica del Acordeón para Servicios
    const serviceHeaders = document.querySelectorAll('.service-header');
    serviceHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('active');
            document.querySelectorAll('.service-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('i.fa-chevron-down').style.transform = 'rotate(0deg)';
            });
            if (!isActive) {
                currentItem.classList.add('active');
                header.querySelector('i.fa-chevron-down').style.transform = 'rotate(180deg)';
                header.querySelector('i.fa-chevron-down').style.transition = 'transform 0.3s ease';
            }
        });
    });

    // 3. Observador para el ícono del Hero al Navbar
    const heroSection = document.querySelector('.hero');
    const heroIcon = document.getElementById('hero-icon');
    const navIconContainer = document.getElementById('nav-icon-container');

    if(heroSection && heroIcon && navIconContainer) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    navIconContainer.classList.add('nav-icon-visible');
                    heroIcon.classList.add('hero-icon-faded');
                } else {
                    navIconContainer.classList.remove('nav-icon-visible');
                    heroIcon.classList.remove('hero-icon-faded');
                }
            });
        }, { threshold: 0.2 });
        scrollObserver.observe(heroSection);
    }

    // 4. Animación de Fondo Dual (Matrix para Oscuro / Grid para Claro)
    const canvas = document.getElementById('cyber-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Variables Servidores Masonry (Claro)
    let cols, rows;
    const gridSize = 40; // Unidad base de medida para los servidores
    let serverBlocks = [];

    // Variables Matrix (Oscuro)
    let matrixCols;
    const fontSize = 16;
    let matrixDrops = [];
    // Mezcla de Binario, texto técnico y Katakana (Matrix clásico)
    const matrixChars = "010101010101KS_SYS_Xﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Setup Servidores Masonry
        cols = Math.ceil(width / gridSize);
        rows = Math.ceil(height / gridSize);
        serverBlocks = [];

        // Matriz temporal para saber qué espacios están ocupados
        const gridMap = Array.from({ length: cols }, () => Array(rows).fill(false));

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (!gridMap[x][y]) {
                    // Generar un ancho (1 a 4 unidades) y alto (1 a 2 unidades) aleatorio
                    let maxW = Math.min(Math.floor(Math.random() * 4) + 1, cols - x);
                    let maxH = Math.min(Math.floor(Math.random() * 2) + 1, rows - y);

                    // Verificar si el bloque cabe sin pisar a otros
                    let canFit = true;
                    for (let i = 0; i < maxW; i++) {
                        for (let j = 0; j < maxH; j++) {
                            if (gridMap[x + i][y + j]) { canFit = false; break; }
                        }
                        if (!canFit) break;
                    }

                    // Si no cabe, lo forzamos a ser de 1x1
                    if (!canFit) { maxW = 1; maxH = 1; }

                    // Marcar el espacio como ocupado
                    for (let i = 0; i < maxW; i++) {
                        for (let j = 0; j < maxH; j++) { gridMap[x + i][y + j] = true; }
                    }

                    // Guardar los datos del servidor
                    serverBlocks.push({
                        px: x * gridSize,
                        py: y * gridSize,
                        pw: maxW * gridSize,
                        ph: maxH * gridSize,
                        ledOpacity: 0,
                        ledTargetOpacity: 0,
                        blinkSpeed: Math.random() * 0.08 + 0.02
                    });
                }
            }
        }

        // Setup Matrix
        matrixCols = Math.ceil(width / fontSize);
        matrixDrops = [];
        for(let i = 0; i < matrixCols; i++) {
            matrixDrops.push({
                y: Math.random() * -100, // Empezar fuera de la pantalla (arriba)
                speed: Math.random() * 0.25 + 0.1 // Velocidades variadas y más lentas
            });
        }
    }

    window.addEventListener('resize', resize);
    resize();

    function animate() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            // ==========================================
            // EFECTO MATRIX ENRIQUECIDO (MODO OSCURO)
            // ==========================================
            
            // TRUCO: En lugar de pintar negro, usamos destination-out para 
            // borrar sutilmente el frame anterior hacia la transparencia real.
            // Esto permite que el video de fondo se vea perfectamente.
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            
            // Volver al modo de dibujo normal
            ctx.globalCompositeOperation = 'source-over';

            ctx.font = fontSize + 'px "Rajdhani", monospace';
            ctx.textAlign = 'center';

            for (let i = 0; i < matrixDrops.length; i++) {
                const drop = matrixDrops[i];
                
                if (drop.y > 0) {
                    const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));

                    // Enriquecimiento de colores
                    if (Math.random() > 0.95) {
                        ctx.fillStyle = '#ffffff'; // Destellos blancos (cabeza de la lluvia)
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = '#00ffcc';
                    } else if (Math.random() > 0.85) {
                        ctx.fillStyle = 'rgba(255, 0, 127, 0.7)'; // Rosado cyberpunk
                        ctx.shadowBlur = 0;
                    } else {
                        ctx.fillStyle = 'rgba(0, 255, 204, 0.5)'; // Cian base opaco
                        ctx.shadowBlur = 0;
                    }

                    ctx.fillText(text, i * fontSize, drop.y * fontSize);
                }

                // Reiniciar la gota cuando sale de la pantalla
                if (drop.y * fontSize > height && Math.random() > 0.98) {
                    drop.y = 0;
                    drop.speed = Math.random() * 0.25 + 0.1; // Asignar nueva velocidad aleatoria
                }
                
                drop.y += drop.speed;
            }

        } else {
            // ==========================================
            // EFECTO SERVIDORES MASONRY (MODO CLARO)
            // ==========================================
            ctx.clearRect(0, 0, width, height);

            // Colores Minimalistas
            const serverBg = 'rgba(255, 255, 255, 0.12)'; // Opacidad reducida al 12% para máxima transparencia
            const borderColor = 'rgba(160, 175, 195, 0.15)'; // Bordes más finos
            const detailColor = 'rgba(160, 175, 195, 0.08)'; // Líneas internas casi invisibles
            const ledGreen = '40, 200, 80'; // Verde LED de actividad

            // Disparar parpadeo aleatorio en algunos servidores
            if (Math.random() < 0.2) {
                const block = serverBlocks[Math.floor(Math.random() * serverBlocks.length)];
                if (block.ledTargetOpacity === 0) {
                    block.ledTargetOpacity = 1; // Encender LED a tope
                }
            }

            serverBlocks.forEach(block => {
                // Lógica de desvanecimiento suave del LED
                if (block.ledOpacity < block.ledTargetOpacity) {
                    block.ledOpacity += block.blinkSpeed;
                    if (block.ledOpacity >= block.ledTargetOpacity) block.ledTargetOpacity = 0;
                } else if (block.ledOpacity > 0) {
                    block.ledOpacity -= block.blinkSpeed * 0.4; // Se apaga más lento de lo que enciende
                    if (block.ledOpacity < 0) block.ledOpacity = 0;
                }

                const gap = 2; // Espacio entre servidores (mampostería)
                
                // 1. Dibujar el chasis del servidor
                ctx.fillStyle = serverBg;
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.rect(block.px + gap, block.py + gap, block.pw - gap * 2, block.ph - gap * 2);
                ctx.fill();
                ctx.stroke();

                // 2. Detalles estructurales (Línea central si el bloque es ancho)
                if (block.pw > gridSize * 1.5) {
                    ctx.beginPath();
                    ctx.moveTo(block.px + gap + 10, block.py + block.ph / 2);
                    ctx.lineTo(block.px + block.pw - gap - 25, block.py + block.ph / 2);
                    ctx.strokeStyle = detailColor;
                    ctx.stroke();
                }

                // 3. Dibujar el Indicador LED
                const ledRadius = 2.5;
                const ledX = block.px + block.pw - gap - 12;
                const ledY = block.py + block.ph / 2;

                // LED Apagado (Gris/Plata base)
                ctx.beginPath();
                ctx.arc(ledX, ledY, ledRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(180, 190, 200, 0.4)';
                ctx.fill();

                // LED Encendido (Brillo Verde Activo)
                if (block.ledOpacity > 0) {
                    ctx.beginPath();
                    ctx.arc(ledX, ledY, ledRadius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${ledGreen}, ${block.ledOpacity})`;
                    ctx.fill();

                    // Resplandor del LED (Halo)
                    ctx.beginPath();
                    ctx.arc(ledX, ledY, ledRadius * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${ledGreen}, ${block.ledOpacity * 0.3})`;
                    ctx.fill();
                }
            });
        }

        requestAnimationFrame(animate);
    }
    
    animate();

    // 5. Lógica de los Modales de Proyectos
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeButtons = document.querySelectorAll('.close-modal');
    const overlays = document.querySelectorAll('.cyber-modal-overlay');

    // Abrir Modal
    modalTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('active');
                // Bloquear el scroll del fondo cuando el modal está abierto
                document.body.style.overflow = 'hidden'; 
            }
        });
    });

    // Función para cerrar modales
    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll
    };

    // Cerrar con el botón 'X'
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.cyber-modal-overlay');
            closeModal(modal);
        });
    });

    // Cerrar haciendo clic fuera de la caja del modal
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // 6. Lógica del Reloj Dinámico (Navbar) - Efecto LED
    const clockElement = document.getElementById('sys-clock');
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            let hours = String(now.getHours()).padStart(2, '0');
            let minutes = String(now.getMinutes()).padStart(2, '0');
            let seconds = String(now.getSeconds()).padStart(2, '0');
            
            // Usamos CSS para el parpadeo en lugar de borrar el texto
            const colon = '<span class="blink-colon">:</span>';
            
            clockElement.innerHTML = `${hours}${colon}${minutes}${colon}${seconds}`;
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    // 7. Lógica de Widgets Flotantes y Reproductor SUPERHOT
    const audio = document.getElementById('bgm-audio');
    const player = document.getElementById('sh-player'); // <-- Aquí definimos player de nuevo
    const floatingWidgets = document.getElementById('floating-widgets');
    const playBtn = document.getElementById('sh-play-btn');
    const playIcon = playBtn ? playBtn.querySelector('i') : null;
    const progressBar = document.getElementById('sh-fill');
    const timeDisplay = document.getElementById('sh-time');
    const toggleBtn = document.getElementById('sh-toggle');
    const shHeader = document.querySelector('.sh-header');
    const volumeSlider = document.getElementById('sh-volume');

    // === Lógica de Scroll Inteligente (Oculta todo el bloque flotante) ===
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (floatingWidgets) {
            // Si scrolleamos hacia ABAJO (y no estamos arriba del todo)
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                floatingWidgets.classList.add('scroll-hidden');
            } 
            // Si scrolleamos hacia ARRIBA
            else if (currentScrollY < lastScrollY) {
                floatingWidgets.classList.remove('scroll-hidden');
            }
        }
        lastScrollY = currentScrollY;
    });

    if (player && toggleBtn) {
        // Contraer / Expandir
        shHeader.addEventListener('click', () => {
            player.classList.toggle('collapsed');
        });

        // Control de Volumen
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                audio.volume = e.target.value;
            });
            // Asegurar volumen inicial
            audio.volume = volumeSlider.value;
        }
    }

    if (audio && playBtn) {
        // Play / Pause
        playBtn.addEventListener('click', () => {
            if(audio.paused) {
                audio.play();
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
            } else {
                audio.pause();
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
            }
        });

        // Actualización de la barra y el tiempo
        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = percent + '%';
            
            let mins = Math.floor(audio.currentTime / 60);
            let secs = Math.floor(audio.currentTime % 60);
            if(secs < 10) secs = '0' + secs;
            if (timeDisplay) timeDisplay.textContent = `${mins}:${secs}`;
        });

        // Reiniciar cuando termine si no tiene loop (aunque le pusimos loop en el html)
        audio.addEventListener('ended', () => {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            if (progressBar) progressBar.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '00:00';
        });
    }
});