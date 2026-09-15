/* Fondo animado en canvas: lluvia Matrix en tema oscuro y
   bloques de servidores tipo masonry en tema claro. */

const MATRIX_CHARS = '010101010101KS_SYS_Xﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
const FONT_SIZE = 16;
const GRID_SIZE = 40;

export function initBackground() {
    const canvas = document.getElementById('cyber-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width;
    let height;

    /* Bloques masonry (tema claro) */
    let cols;
    let rows;
    let serverBlocks = [];

    /* Lluvia Matrix (tema oscuro) */
    let matrixCols;
    let matrixDrops = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        cols = Math.ceil(width / GRID_SIZE);
        rows = Math.ceil(height / GRID_SIZE);
        serverBlocks = [];

        const gridMap = Array.from({ length: cols }, () => Array(rows).fill(false));

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (gridMap[x][y]) continue;

                let blockW = Math.min(Math.floor(Math.random() * 4) + 1, cols - x);
                let blockH = Math.min(Math.floor(Math.random() * 2) + 1, rows - y);

                let canFit = true;
                for (let i = 0; i < blockW && canFit; i++) {
                    for (let j = 0; j < blockH; j++) {
                        if (gridMap[x + i][y + j]) {
                            canFit = false;
                            break;
                        }
                    }
                }

                if (!canFit) {
                    blockW = 1;
                    blockH = 1;
                }

                for (let i = 0; i < blockW; i++) {
                    for (let j = 0; j < blockH; j++) {
                        gridMap[x + i][y + j] = true;
                    }
                }

                serverBlocks.push({
                    px: x * GRID_SIZE,
                    py: y * GRID_SIZE,
                    pw: blockW * GRID_SIZE,
                    ph: blockH * GRID_SIZE,
                    ledOpacity: 0,
                    ledTargetOpacity: 0,
                    blinkSpeed: Math.random() * 0.08 + 0.02,
                });
            }
        }

        matrixCols = Math.ceil(width / FONT_SIZE);
        matrixDrops = [];
        for (let i = 0; i < matrixCols; i++) {
            matrixDrops.push({
                y: Math.random() * -100,
                speed: Math.random() * 0.25 + 0.1,
            });
        }
    }

    function drawMatrix() {
        /* destination-out borra el frame anterior hacia transparencia real,
           así el video de fondo se ve sin pintar un rectángulo negro. */
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';

        ctx.font = `${FONT_SIZE}px "Rajdhani", monospace`;
        ctx.textAlign = 'center';

        for (let i = 0; i < matrixDrops.length; i++) {
            const drop = matrixDrops[i];

            if (drop.y > 0) {
                const text = MATRIX_CHARS.charAt(
                    Math.floor(Math.random() * MATRIX_CHARS.length),
                );

                if (Math.random() > 0.95) {
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#00ffcc';
                } else if (Math.random() > 0.85) {
                    ctx.fillStyle = 'rgba(255, 0, 127, 0.7)';
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = 'rgba(0, 255, 204, 0.5)';
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(text, i * FONT_SIZE, drop.y * FONT_SIZE);
            }

            if (drop.y * FONT_SIZE > height && Math.random() > 0.98) {
                drop.y = 0;
                drop.speed = Math.random() * 0.25 + 0.1;
            }

            drop.y += drop.speed;
        }
    }

    function drawServers() {
        ctx.clearRect(0, 0, width, height);

        const serverBg = 'rgba(255, 255, 255, 0.12)';
        const borderColor = 'rgba(160, 175, 195, 0.15)';
        const detailColor = 'rgba(160, 175, 195, 0.08)';
        const ledGreen = '40, 200, 80';

        /* Enciende el LED de un servidor al azar */
        if (Math.random() < 0.2 && serverBlocks.length) {
            const block = serverBlocks[Math.floor(Math.random() * serverBlocks.length)];
            if (block.ledTargetOpacity === 0) block.ledTargetOpacity = 1;
        }

        serverBlocks.forEach((block) => {
            if (block.ledOpacity < block.ledTargetOpacity) {
                block.ledOpacity += block.blinkSpeed;
                if (block.ledOpacity >= block.ledTargetOpacity) block.ledTargetOpacity = 0;
            } else if (block.ledOpacity > 0) {
                block.ledOpacity -= block.blinkSpeed * 0.4;
                if (block.ledOpacity < 0) block.ledOpacity = 0;
            }

            const gap = 2;

            ctx.fillStyle = serverBg;
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(block.px + gap, block.py + gap, block.pw - gap * 2, block.ph - gap * 2);
            ctx.fill();
            ctx.stroke();

            if (block.pw > GRID_SIZE * 1.5) {
                ctx.beginPath();
                ctx.moveTo(block.px + gap + 10, block.py + block.ph / 2);
                ctx.lineTo(block.px + block.pw - gap - 25, block.py + block.ph / 2);
                ctx.strokeStyle = detailColor;
                ctx.stroke();
            }

            const ledRadius = 2.5;
            const ledX = block.px + block.pw - gap - 12;
            const ledY = block.py + block.ph / 2;

            ctx.beginPath();
            ctx.arc(ledX, ledY, ledRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(180, 190, 200, 0.4)';
            ctx.fill();

            if (block.ledOpacity > 0) {
                ctx.beginPath();
                ctx.arc(ledX, ledY, ledRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${ledGreen}, ${block.ledOpacity})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(ledX, ledY, ledRadius * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${ledGreen}, ${block.ledOpacity * 0.3})`;
                ctx.fill();
            }
        });
    }

    function draw() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) drawMatrix();
        else drawServers();
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();

    if (reduceMotion) {
        draw();
        window.addEventListener('resize', draw);
    } else {
        animate();
    }
}
