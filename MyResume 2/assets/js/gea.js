window.addEventListener('load', function() {
    const sCanvas = document.getElementById('spiderCanvas');
    const sCtx = sCanvas.getContext('2d');
    const treeImg = document.getElementById('mainTree');
    
    // Riferimenti per il ruscello (se presente nel tuo HTML)
    const wCanvas = document.getElementById('waterCanvas');
    const wCtx = wCanvas ? wCanvas.getContext('2d') : null;

    let isExpanded = false;
    let sWidth, sHeight, spiderY;
    const sSpeed = 0.3;
    let sGoingDown = true;
    let wIncrement = 0; // Per l'animazione acqua

    const characters = ["Zeus", "Hera", "Poseidon", "Demeter", "Athena", "Apollo", "Artemis", "Ares", "Aphrodite", "Hephaestus", "Hermes", "Dionysus"];

    function initAll() {
        if (isExpanded) {
            sCanvas.width = window.innerWidth;
            sCanvas.height = window.innerHeight;
        } else {
            // Se l'immagine dell'albero non è ancora pronta, usa valori di fallback
            sCanvas.width = treeImg.clientWidth || 600; 
            sCanvas.height = treeImg.clientHeight || 1100;
        }
        sWidth = sCanvas.width;
        sHeight = sCanvas.height;
        
        // Posizione iniziale del ragno
        if(!isExpanded) spiderY = sHeight * 0.35;

        // Inizializza ruscello se esiste
        if (wCanvas) {
            wCanvas.width = wCanvas.offsetWidth;
            wCanvas.height = wCanvas.offsetHeight;
        }
    }

    sCanvas.addEventListener('click', function(e) {
        e.stopPropagation();
        isExpanded = !isExpanded;
        sCanvas.classList.toggle('expanded');
        document.body.classList.toggle('no-scroll');
        initAll();
    });

    function drawBigWeb(x, y, radius, sides) {
        sCtx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        sCtx.lineWidth = isExpanded ? 2 : 1.2;

        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i;
            const endX = x + Math.cos(angle) * radius;
            const endY = y + Math.sin(angle) * radius;

            sCtx.beginPath();
            sCtx.moveTo(x, y);
            sCtx.lineTo(endX, endY);
            sCtx.stroke();

            if (isExpanded) {
                sCtx.save();
                sCtx.fillStyle = "#ffffff";
                sCtx.font = "bold 20px Marcellus, serif";
                sCtx.textAlign = "center";
                sCtx.textBaseline = "middle";
                const textX = x + Math.cos(angle) * (radius + 60);
                const textY = y + Math.sin(angle) * (radius + 60);
                sCtx.fillText(characters[i] || "", textX, textY);
                sCtx.restore();
            }
        }

        for (let j = 1; j < 8; j++) {
            const r = (radius / 8) * j;
            sCtx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const angle = (Math.PI * 2 / sides) * i;
                const currX = x + Math.cos(angle) * r;
                const currY = y + Math.sin(angle) * r;
                if (i === 0) sCtx.moveTo(currX, currY);
                else sCtx.lineTo(currX, currY);
            }
            sCtx.stroke();
        }
    }

    function drawSpider(centerX) {
        // Filo del ragno
        sCtx.beginPath();
        sCtx.moveTo(centerX, sHeight * 0.35); // Attaccato al ramo
        sCtx.lineTo(centerX, spiderY);
        sCtx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        sCtx.lineWidth = 1.5;
        sCtx.stroke();

        const spiderSize = 10;
        sCtx.fillStyle = "#000000";
        
        // Addome
        sCtx.beginPath();
        sCtx.ellipse(centerX, spiderY, spiderSize, spiderSize, 0, 0, Math.PI * 2);
        sCtx.fill();
        
        // Testa
        sCtx.beginPath();
        sCtx.arc(centerX, spiderY - spiderSize, spiderSize * 0.8, 0, Math.PI * 2);
        sCtx.fill();

        // Zampe
        sCtx.strokeStyle = "#000000";
        sCtx.lineWidth = 1.5;
        for(let i=0; i<4; i++) {
            const offset = i * 7;
            // Zampe sinistra
            sCtx.beginPath();
            sCtx.moveTo(centerX, spiderY);
            sCtx.bezierCurveTo(centerX - 30, spiderY - 20 + offset, centerX - 35, spiderY + 10, centerX - 25, spiderY + 20);
            sCtx.stroke();
            // Zampe destra
            sCtx.beginPath();
            sCtx.moveTo(centerX, spiderY);
            sCtx.bezierCurveTo(centerX + 30, spiderY - 20 + offset, centerX + 35, spiderY + 10, centerX + 25, spiderY + 20);
            sCtx.stroke();
        }

        // Movimento su e giù
        if (sGoingDown) {
            spiderY += sSpeed;
            if (spiderY > sHeight * 0.55) sGoingDown = false;
        } else {
            spiderY -= sSpeed;
            if (spiderY < sHeight * 0.38) sGoingDown = true;
        }
    }

    // --- LOGICA ACQUA (Se presente waterCanvas) ---
    function drawWater() {
        if (!wCtx) return;
        wIncrement += 0.015;
        wCtx.clearRect(0, 0, wCanvas.width, wCanvas.height);
        
        const drawWave = (heightFactor, color, speedMult) => {
            wCtx.beginPath();
            wCtx.moveTo(0, wCanvas.height);
            const baseHeight = wCanvas.height * heightFactor;
            for (let i = 0; i <= wCanvas.width; i += 5) {
                const wave = Math.sin(i * 0.008 + wIncrement * speedMult) * 12;
                wCtx.lineTo(i, baseHeight + wave);
            }
            wCtx.lineTo(wCanvas.width, wCanvas.height);
            wCtx.fillStyle = color;
            wCtx.fill();
        };

        drawWave(0.6, "rgba(19, 62, 109, 0.3)", 0.8);
        drawWave(0.8, "hsla(211, 86.00%, 11.20%, 0.40)", 1.2);
    }

    function animate() {
        sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
        
        const centerX = sCanvas.width / 2;
        const centerY = isExpanded ? sCanvas.height / 2 : sHeight * 0.4;
        const currentRadius = isExpanded ? Math.min(sCanvas.width, sCanvas.height) * 0.35 : 130;

        drawBigWeb(centerX, centerY, currentRadius, 12);

        if (!isExpanded) {
            drawSpider(centerX);
        }

        drawWater();
        requestAnimationFrame(animate);
    }

    initAll();
    animate();
    window.addEventListener('resize', initAll);
});





