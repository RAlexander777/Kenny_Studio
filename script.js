document.addEventListener("DOMContentLoaded", () => {

    // === A. Secuencia de Arranque (Boot OS) ===
    const bootScreen = document.getElementById("boot-sequence");
    const bootLines = document.querySelectorAll(".boot-line");
    const bootBar = document.getElementById("boot-bar");
    
    if (bootScreen) {
        // Mostrar líneas de terminal progresivamente
        setTimeout(() => bootLines[0].style.opacity = 1, 100);
        setTimeout(() => bootLines[1].style.opacity = 1, 400);
        setTimeout(() => bootLines[2].style.opacity = 1, 700);

        // Simular carga de barra
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                bootBar.innerHTML = `[||||||||||] 100% - ACCESO CONCEDIDO`;
                
                // Ocultar pantalla de arranque
                setTimeout(() => {
                    bootScreen.classList.add("hidden");
                }, 500);
            } else {
                const bars = "|".repeat(Math.floor(progress / 10)).padEnd(10, ".");
                bootBar.innerHTML = `[${bars}] ${progress}%`;
            }
        }, 100);
        
        // Cierre de seguridad: Si la página carga muy lento, quitar el preloader máximo a los 3 segundos
        window.addEventListener('load', () => {
            setTimeout(() => { if (!bootScreen.classList.contains("hidden")) bootScreen.classList.add("hidden"); }, 2000);
        });
    }

    // === B. Transición Glitch en Enlaces ===
    const glitchOverlay = document.getElementById("global-glitch");
    const navAnchors = document.querySelectorAll('a[href^="#"]');

    navAnchors.forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return; // Ignorar enlaces vacíos
            
            const targetEl = document.querySelector(targetId);
            if (targetEl && glitchOverlay) {
                // Prevenimos el scroll inmediato
                e.preventDefault();
                
                // Disparamos el pantallazo glitch
                glitchOverlay.classList.remove("active");
                void glitchOverlay.offsetWidth; // Truco para reiniciar la animación
                glitchOverlay.classList.add("active");
                
                // Esperamos un instante (mientras la pantalla falla) y hacemos el scroll
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'auto' }); 
                }, 150); // Justo en medio del parpadeo
            }
        });
    });

    // === C. ScrollSpy (Radar de Navegación) ===
    const sections = document.querySelectorAll("header.hero, section.cyber-container, footer.cyber-footer");
    const navLinksObj = document.querySelectorAll(".nav-links a");

    const spyOptions = {
        threshold: 0.3, // Se activa cuando el 30% de la sección es visible
        rootMargin: "-10% 0px -50% 0px" // Ajuste para que se marque a la mitad de la pantalla
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");
                
                navLinksObj.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${currentId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => spyObserver.observe(section));

    // 1. Alternancia de Modo Día / Noche (Con Video Dinámico)
    const themeBtn = document.getElementById("theme-toggle");
    const htmlEl = document.documentElement;
    const thumbIcon = themeBtn.querySelector(".switch-thumb i");
    const heroVideoBg = document.getElementById("hero-video-bg"); // Detectar el video

    themeBtn.addEventListener("click", () => {
        if (htmlEl.getAttribute("data-theme") === "dark") {
            // === CAMBIAR A MODO CLARO ===
            htmlEl.setAttribute("data-theme", "light");
            thumbIcon.classList.remove("fa-moon");
            thumbIcon.classList.add("fa-sun");

            // Cambiar al video del tema claro
            if (heroVideoBg) {
                heroVideoBg.src = "hero_video_light.mp4";
            }
        } else {
            // === CAMBIAR A MODO OSCURO ===
            htmlEl.setAttribute("data-theme", "dark");
            thumbIcon.classList.remove("fa-sun");
            thumbIcon.classList.add("fa-moon");

            // Restaurar al video del tema oscuro
            if (heroVideoBg) {
                heroVideoBg.src = "hero_video.mp4";
            }
        }
    });

    // 2. Lógica del Acordeón para Tarjetas de Servicios
    const toggleDescBtns = document.querySelectorAll(".toggle-desc-btn");
    toggleDescBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".service-card");
            const isExpanded = card.classList.contains("expanded");

            // Opcional: Cerrar las demás tarjetas al abrir una nueva
            document.querySelectorAll(".service-card").forEach((otherCard) => {
                otherCard.classList.remove("expanded");
            });

            // Si no estaba expandida previamente, la abrimos
            if (!isExpanded) {
                card.classList.add("expanded");
            }
        });
    });

    // 3. Observador para el ícono del Hero al Navbar
    const heroSection = document.querySelector(".hero");
    const heroIcon = document.getElementById("hero-icon");
    const navIconContainer = document.getElementById("nav-icon-container");

    if (heroSection && heroIcon && navIconContainer) {
        const scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        navIconContainer.classList.add("nav-icon-visible");
                        heroIcon.classList.add("hero-icon-faded");
                    } else {
                        navIconContainer.classList.remove("nav-icon-visible");
                        heroIcon.classList.remove("hero-icon-faded");
                    }
                });
            },
            { threshold: 0.2 },
        );
        scrollObserver.observe(heroSection);
    }

    // 4. Animación de Fondo Dual (Matrix para Oscuro / Grid para Claro)
    const canvas = document.getElementById("cyber-bg");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
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
        const gridMap = Array.from({ length: cols }, () =>
            Array(rows).fill(false),
        );

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (!gridMap[x][y]) {
                    // Generar un ancho (1 a 4 unidades) y alto (1 a 2 unidades) aleatorio
                    let maxW = Math.min(
                        Math.floor(Math.random() * 4) + 1,
                        cols - x,
                    );
                    let maxH = Math.min(
                        Math.floor(Math.random() * 2) + 1,
                        rows - y,
                    );

                    // Verificar si el bloque cabe sin pisar a otros
                    let canFit = true;
                    for (let i = 0; i < maxW; i++) {
                        for (let j = 0; j < maxH; j++) {
                            if (gridMap[x + i][y + j]) {
                                canFit = false;
                                break;
                            }
                        }
                        if (!canFit) break;
                    }

                    // Si no cabe, lo forzamos a ser de 1x1
                    if (!canFit) {
                        maxW = 1;
                        maxH = 1;
                    }

                    // Marcar el espacio como ocupado
                    for (let i = 0; i < maxW; i++) {
                        for (let j = 0; j < maxH; j++) {
                            gridMap[x + i][y + j] = true;
                        }
                    }

                    // Guardar los datos del servidor
                    serverBlocks.push({
                        px: x * gridSize,
                        py: y * gridSize,
                        pw: maxW * gridSize,
                        ph: maxH * gridSize,
                        ledOpacity: 0,
                        ledTargetOpacity: 0,
                        blinkSpeed: Math.random() * 0.08 + 0.02,
                    });
                }
            }
        }

        // Setup Matrix
        matrixCols = Math.ceil(width / fontSize);
        matrixDrops = [];
        for (let i = 0; i < matrixCols; i++) {
            matrixDrops.push({
                y: Math.random() * -100, // Empezar fuera de la pantalla (arriba)
                speed: Math.random() * 0.25 + 0.1, // Velocidades variadas y más lentas
            });
        }
    }

    window.addEventListener("resize", resize);
    resize();

    function animate() {
        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

        if (isDark) {
            // ==========================================
            // EFECTO MATRIX ENRIQUECIDO (MODO OSCURO)
            // ==========================================

            // TRUCO: En lugar de pintar negro, usamos destination-out para
            // borrar sutilmente el frame anterior hacia la transparencia real.
            // Esto permite que el video de fondo se vea perfectamente.
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, width, height);

            // Volver al modo de dibujo normal
            ctx.globalCompositeOperation = "source-over";

            ctx.font = fontSize + 'px "Rajdhani", monospace';
            ctx.textAlign = "center";

            for (let i = 0; i < matrixDrops.length; i++) {
                const drop = matrixDrops[i];

                if (drop.y > 0) {
                    const text = matrixChars.charAt(
                        Math.floor(Math.random() * matrixChars.length),
                    );

                    // Enriquecimiento de colores
                    if (Math.random() > 0.95) {
                        ctx.fillStyle = "#ffffff"; // Destellos blancos (cabeza de la lluvia)
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = "#00ffcc";
                    } else if (Math.random() > 0.85) {
                        ctx.fillStyle = "rgba(255, 0, 127, 0.7)"; // Rosado cyberpunk
                        ctx.shadowBlur = 0;
                    } else {
                        ctx.fillStyle = "rgba(0, 255, 204, 0.5)"; // Cian base opaco
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
            const serverBg = "rgba(255, 255, 255, 0.12)"; // Opacidad reducida al 12% para máxima transparencia
            const borderColor = "rgba(160, 175, 195, 0.15)"; // Bordes más finos
            const detailColor = "rgba(160, 175, 195, 0.08)"; // Líneas internas casi invisibles
            const ledGreen = "40, 200, 80"; // Verde LED de actividad

            // Disparar parpadeo aleatorio en algunos servidores
            if (Math.random() < 0.2) {
                const block =
                    serverBlocks[
                        Math.floor(Math.random() * serverBlocks.length)
                    ];
                if (block.ledTargetOpacity === 0) {
                    block.ledTargetOpacity = 1; // Encender LED a tope
                }
            }

            serverBlocks.forEach((block) => {
                // Lógica de desvanecimiento suave del LED
                if (block.ledOpacity < block.ledTargetOpacity) {
                    block.ledOpacity += block.blinkSpeed;
                    if (block.ledOpacity >= block.ledTargetOpacity)
                        block.ledTargetOpacity = 0;
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
                ctx.rect(
                    block.px + gap,
                    block.py + gap,
                    block.pw - gap * 2,
                    block.ph - gap * 2,
                );
                ctx.fill();
                ctx.stroke();

                // 2. Detalles estructurales (Línea central si el bloque es ancho)
                if (block.pw > gridSize * 1.5) {
                    ctx.beginPath();
                    ctx.moveTo(block.px + gap + 10, block.py + block.ph / 2);
                    ctx.lineTo(
                        block.px + block.pw - gap - 25,
                        block.py + block.ph / 2,
                    );
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
                ctx.fillStyle = "rgba(180, 190, 200, 0.4)";
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
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    const closeButtons = document.querySelectorAll(".close-modal");
    const overlays = document.querySelectorAll(".cyber-modal-overlay");

    // Abrir Modal
    modalTriggers.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute("data-modal");
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add("active");
                // Bloquear el scroll del fondo cuando el modal está abierto
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Función para cerrar modales
    const closeModal = (modal) => {
        modal.classList.remove("active");
        document.body.style.overflow = "auto"; // Restaurar scroll
    };

    // Cerrar con el botón 'X'
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".cyber-modal-overlay");
            closeModal(modal);
        });
    });

    // Cerrar haciendo clic fuera de la caja del modal
    overlays.forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // 6. Lógica del Reloj Dinámico (Navbar) - Efecto LED
    const clockElement = document.getElementById("sys-clock");
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            let hours = String(now.getHours()).padStart(2, "0");
            let minutes = String(now.getMinutes()).padStart(2, "0");
            let seconds = String(now.getSeconds()).padStart(2, "0");

            // Usamos CSS para el parpadeo en lugar de borrar el texto
            const colon = '<span class="blink-colon">:</span>';

            clockElement.innerHTML = `${hours}${colon}${minutes}${colon}${seconds}`;
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    // 7. Lógica de Widgets Flotantes y Reproductor SUPERHOT
    const audio = document.getElementById("bgm-audio");
    const player = document.getElementById("sh-player"); // <-- Aquí definimos player de nuevo
    const floatingWidgets = document.getElementById("floating-widgets");
    const playBtn = document.getElementById("sh-play-btn");
    const playIcon = playBtn ? playBtn.querySelector("i") : null;
    const progressBar = document.getElementById("sh-fill");
    const timeDisplay = document.getElementById("sh-time");
    const toggleBtn = document.getElementById("sh-toggle");
    const shHeader = document.querySelector(".sh-header");
    const volumeSlider = document.getElementById("sh-volume");

    // === Lógica de Scroll Inteligente (Oculta todo el bloque flotante) ===
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (floatingWidgets) {
            // Si scrolleamos hacia ABAJO (y no estamos arriba del todo)
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                floatingWidgets.classList.add("scroll-hidden");
            }
            // Si scrolleamos hacia ARRIBA
            else if (currentScrollY < lastScrollY) {
                floatingWidgets.classList.remove("scroll-hidden");
            }
        }
        lastScrollY = currentScrollY;
    });

    if (player && toggleBtn) {
        // Contraer / Expandir
        shHeader.addEventListener("click", () => {
            player.classList.toggle("collapsed");
        });

        // Control de Volumen
        if (volumeSlider) {
            volumeSlider.addEventListener("input", (e) => {
                audio.volume = e.target.value;
            });
            // Asegurar volumen inicial
            audio.volume = volumeSlider.value;
        }
    }

    if (audio && playBtn) {
        // Play / Pause
        playBtn.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                playIcon.classList.remove("fa-play");
                playIcon.classList.add("fa-pause");
            } else {
                audio.pause();
                playIcon.classList.remove("fa-pause");
                playIcon.classList.add("fa-play");
            }
        });

        // Actualización de la barra y el tiempo
        audio.addEventListener("timeupdate", () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = percent + "%";

            let mins = Math.floor(audio.currentTime / 60);
            let secs = Math.floor(audio.currentTime % 60);
            if (secs < 10) secs = "0" + secs;
            if (timeDisplay) timeDisplay.textContent = `${mins}:${secs}`;
        });

        // Reiniciar cuando termine si no tiene loop (aunque le pusimos loop en el html)
        audio.addEventListener("ended", () => {
            playIcon.classList.remove("fa-pause");
            playIcon.classList.add("fa-play");
            if (progressBar) progressBar.style.width = "0%";
            if (timeDisplay) timeDisplay.textContent = "00:00";
        });
    }

    // === 8. Globo Terráqueo 3D (Cybermap) ===
    const globeCanvas = document.getElementById("cyber-globe");
    if (globeCanvas) {
        const glCtx = globeCanvas.getContext("2d");
        const globeWidth = globeCanvas.width;
        const globeHeight = globeCanvas.height;
        const centerX = globeWidth / 2;
        const centerY = globeHeight / 2;
        const radius = 105; // Tamaño de la malla dentro del canvas

        let nodes = [];
        let connections = [];
        const numNodes = 120; // Cantidad de puntos en la red

        // Generar puntos uniformes usando una esfera de Fibonacci
        const phi = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < numNodes; i++) {
            const y = 1 - (i / (numNodes - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;

            // Guardamos las coordenadas originales para rotarlas después
            nodes.push({ x, y, z, originalX: x, originalZ: z });
        }

        // Crear conexiones (líneas) entre nodos que están cerca
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dz = nodes[i].z - nodes[j].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // Si la distancia es menor a este umbral, se conectan
                if (dist < 0.45) {
                    connections.push({ a: nodes[i], b: nodes[j] });
                }
            }
        }

        let rotationY = 0;

        function drawGlobe() {
            glCtx.clearRect(0, 0, globeWidth, globeHeight);

            // Detectar tema actual para colores dinámicos
            const isDark =
                document.documentElement.getAttribute("data-theme") === "dark";
            const lineColor = isDark
                ? "rgba(0, 255, 204, 0.25)"
                : "rgba(0, 85, 255, 0.25)";
            const threatColor = isDark ? "#ff007f" : "#d9005c"; // Puntos de "Ataque"

            rotationY += 0.003; // Velocidad de rotación

            const cosY = Math.cos(rotationY);
            const sinY = Math.sin(rotationY);

            // Proyección 3D -> 2D
            const projectedNodes = nodes.map((node, index) => {
                // Rotar en el eje Y
                const rx = node.originalX * cosY - node.originalZ * sinY;
                const rz = node.originalX * sinY + node.originalZ * cosY;
                node.x = rx;
                node.z = rz; // Z negativo es el frente, Z positivo es la parte trasera

                // Calcular escala por perspectiva
                const scale = 250 / (250 + node.z * radius);
                const px = centerX + node.x * radius * scale;
                const py = centerY + node.y * radius * scale;

                // CORRECCIÓN: El frente (z negativa) debe ser opaco, la parte trasera transparente
                const alpha = Math.max(0.05, 1 - (node.z + 1) / 2);

                return {
                    px,
                    py,
                    scale,
                    alpha,
                    z: node.z,
                    isThreat: index % 15 === 0,
                };
            });

            // Dibujar las líneas de la red
            glCtx.lineWidth = 1;
            connections.forEach((conn) => {
                const a = projectedNodes[nodes.indexOf(conn.a)];
                const b = projectedNodes[nodes.indexOf(conn.b)];

                // CORRECCIÓN: Solo dibujar líneas en la cara frontal (z < 0.2 da un pequeño margen en los bordes)
                if (a.z < 0.2 && b.z < 0.2) {
                    glCtx.beginPath();
                    glCtx.moveTo(a.px, a.py);
                    glCtx.lineTo(b.px, b.py);
                    glCtx.strokeStyle = lineColor;
                    glCtx.stroke();
                }
            });

            // Dibujar los puntos (nodos)
            projectedNodes.forEach((node) => {
                // CORRECCIÓN: Ocultar los puntos de la parte trasera para que el globo se vea sólido
                if (node.z < 0.2) {
                    glCtx.beginPath();
                    glCtx.arc(
                        node.px,
                        node.py,
                        1.5 * node.scale,
                        0,
                        Math.PI * 2,
                    );

                    if (node.isThreat) {
                        glCtx.fillStyle = threatColor;
                        glCtx.shadowColor = threatColor;
                        glCtx.shadowBlur = 10 * node.scale;
                        // Pulso aleatorio agresivo en las amenazas
                        if (Math.random() > 0.96) {
                            glCtx.arc(
                                node.px,
                                node.py,
                                3.5 * node.scale,
                                0,
                                Math.PI * 2,
                            );
                        }
                    } else {
                        glCtx.fillStyle = `rgba(${isDark ? "0,255,204" : "0,85,255"}, ${node.alpha})`;
                        glCtx.shadowBlur = 0;
                    }

                    glCtx.fill();
                }
            });

            requestAnimationFrame(drawGlobe);
        }

        drawGlobe();
    }

    // === 9. Lógica del Menú Móvil Futurista ===
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenuOverlay = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (mobileMenuBtn && mobileMenuOverlay) {
        // Abrir/Cerrar menú al tocar la hamburguesa
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenuBtn.classList.toggle("open");
            mobileMenuOverlay.classList.toggle("active");

            // Bloquear/Desbloquear scroll del cuerpo de la web
            if (mobileMenuOverlay.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        });

        // Cerrar menú automáticamente al hacer clic en un enlace
        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenuBtn.classList.remove("open");
                mobileMenuOverlay.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        });
    }

    async function loadVault() {
        const vaultContainer = document.getElementById("vault-list");
        const paginationContainer = document.getElementById("vault-pagination");
        
        // URL DE SHEETDB
        const API_URL = "https://sheetdb.io/api/v1/ue9trerg3z72z"; 
        
        let vaultData = [];
        let currentPage = 1;
        const itemsPerPage = 8;

        // Función inteligente para autogenerar permisos según el tipo de archivo
        function generatePerms(tipo) {
            const t = (tipo || "").toUpperCase();
            if (t.includes("PYTHON") || t.includes("SH") || t.includes("EXE") || t.includes("SCRIPT")) {
                return "-rwxr-xr-x"; // Archivo ejecutable
            } else if (t.includes("DIR") || t.includes("FOLDER")) {
                return "drwxr-xr-x"; // Directorio
            } else if (t.includes("CONF") || t.includes("ENV")) {
                return "-r--------"; // Archivo clasificado / Solo lectura para root
            } else {
                return "-rw-r--r--"; // Archivo estándar (ZIP, TXT, PDF)
            }
        }

        // Función para renderizar las filas de la tabla según la página
        function renderTable() {
            vaultContainer.innerHTML = ""; 
            
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedItems = vaultData.slice(start, end);

            paginatedItems.forEach((item) => {
                const row = document.createElement("div");
                row.classList.add("ls-row");
                
                // Autogenerar el permiso
                const autoPerms = generatePerms(item.tipo); 
                
                // === FIX: SANITIZACIÓN DEL ENLACE ===
                let safeLink = (item.link || "").trim(); // Quitamos espacios accidentales
                // Si el link existe pero NO empieza con http:// ni https://, se lo agregamos a la fuerza
                if (safeLink !== "" && !safeLink.startsWith('http://') && !safeLink.startsWith('https://')) {
                    safeLink = 'https://' + safeLink;
                }
                // Si la celda está vacía, evitamos que rompa la página poniendo un #
                if (safeLink === "") safeLink = "#";
                
                row.innerHTML = `
                    <div class="ls-perms">${autoPerms}</div>
                    <div class="ls-type">${item.tipo}</div>
                    <div class="ls-size">${item.size}</div>
                    <div class="ls-name">${item.nombre}</div>
                    <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="ls-download" title="Descargar"><i class="fas fa-download"></i></a>
                `;
                vaultContainer.appendChild(row);
            });
            
            renderPagination();
        }

        // Función para renderizar los botones de paginación
        function renderPagination() {
            if (!paginationContainer) return;
            paginationContainer.innerHTML = "";
            
            const totalPages = Math.ceil(vaultData.length / itemsPerPage);

            if (totalPages <= 1) return; 

            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement("button");
                btn.classList.add("ls-page-btn");
                if (i === currentPage) btn.classList.add("active");
                
                btn.textContent = i;
                
                btn.addEventListener("click", () => {
                    currentPage = i;
                    renderTable();
                    // Efecto Glitch al cambiar de página en la terminal
                    const glitch = document.getElementById("global-glitch");
                    if(glitch) {
                        glitch.classList.add("active");
                        setTimeout(() => glitch.classList.remove("active"), 300);
                    }
                });
                
                paginationContainer.appendChild(btn);
            }
        }

        try {
            const response = await fetch(API_URL);
            vaultData = await response.json();

            if (vaultData.length > 0) {
                renderTable();
            } else {
                vaultContainer.innerHTML = '<div class="ls-error">> DIRECTORIO VACÍO</div>';
            }
        } catch (error) {
            vaultContainer.innerHTML =
                '<div class="ls-error" style="color: var(--neon-pink);">> ERROR: FALLO EN LA CONEXIÓN CON EL SATÉLITE</div>';
        }
    }

    // Ejecutar al cargar la página
    loadVault();
});
