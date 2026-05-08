/**
 * WebGL Background Engine - Mythos in ArCo
 */

let gl, program;
let canvasElement;
let startTime;
let uniLocation = {};
let mouseX = 0.5, mouseY = 0.5;

// --- 1. Inizializzazione ---
const initWebGL = () => {
    // Cerchiamo il canvas 'canvass'
    canvasElement = document.getElementById('canvass');
    
    // Se non esiste nel DOM, lo creiamo dinamicamente
    if (!canvasElement) {
        canvasElement = document.createElement('canvas');
        canvasElement.id = 'canvass';
        document.body.appendChild(canvasElement);
    }

    // Stile obbligatorio per renderlo sfondo
    canvasElement.style.position = 'fixed';
    canvasElement.style.top = '0';
    canvasElement.style.left = '0';
    canvasElement.style.zIndex = '-1';
    canvasElement.style.display = 'block';

    gl = canvasElement.getContext('webgl') || canvasElement.getContext('experimental-webgl');

    if (!gl) {
        console.error('WebGL non supportato dal browser');
        return;
    }

    // Compilazione Shader
    const vs = createShader('vs');
    const fs = createShader('fs');
    program = createProgram(vs, fs);

    // Setup Geometria (Un piano che copre tutto lo schermo)
    const vertices = [
        -1.0,  1.0,  0.0,
         1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
    
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    const positionAddr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAddr);
    gl.vertexAttribPointer(positionAddr, 3, gl.FLOAT, false, 0, 0);

    // Recupero locazioni Uniforms
    uniLocation.time = gl.getUniformLocation(program, 'time');
    uniLocation.mouse = gl.getUniformLocation(program, 'mouse');
    uniLocation.resolution = gl.getUniformLocation(program, 'resolution');

    // Start
    resizeCanvas();
    startTime = Date.now();
    render();
};

// --- 2. Rendering Loop ---
const render = () => {
    const currentTime = (Date.now() - startTime) * 0.001;

    // Cambia l'ultimo valore (alfa) da 1.0 a 0.0
    gl.clearColor(0.0, 0.0, 0.0, 0.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Invio dati agli shader
    gl.uniform1f(uniLocation.time, currentTime);
    gl.uniform2f(uniLocation.mouse, mouseX, mouseY);
    gl.uniform2f(uniLocation.resolution, canvasElement.width, canvasElement.height);

    // Disegno
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();

    requestAnimationFrame(render);
};

// --- 3. Utility Functions ---
const createShader = (id) => {
    const script = document.getElementById(id);
    if (!script) return null;

    const shader = gl.createShader(script.type === 'x-shader/x-vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, script.textContent);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        console.error('Errore Shader ' + id + ':', gl.getShaderInfoLog(shader));
        return null;
    }
};

const createProgram = (vs, fs) => {
    const prg = gl.createProgram();
    gl.attachShader(prg, vs);
    gl.attachShader(prg, fs);
    gl.linkProgram(prg);

    if (gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        gl.useProgram(prg);
        return prg;
    } else {
        console.error('Errore Link Program:', gl.getProgramInfoLog(prg));
        return null;
    }
};

const resizeCanvas = () => {
    if (canvasElement) {
        // Prende le dimensioni della sezione genitore invece che della finestra
        const parent = canvasElement.parentElement;
        canvasElement.width = parent.clientWidth;
        canvasElement.height = parent.clientHeight;
        gl.viewport(0, 0, canvasElement.width, canvasElement.height);
    }
};

// --- 4. Event Listeners ---
window.addEventListener('load', initWebGL);
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = 1.0 - (e.clientY / window.innerHeight); // Invertiamo Y per WebGL
});








// fire cursor

const firePointer = document.getElementById('fire-pointer');
const tartarusSection = document.getElementById('inferi');

tartarusSection.addEventListener('mousemove', (e) => {
    firePointer.style.display = 'flex'; // Usiamo flex per centrare l'emoji
    // Sottraiamo metà della larghezza/altezza (15px) per centrare perfettamente
    firePointer.style.left = (e.clientX - 15) + 'px';
    firePointer.style.top = (e.clientY - 15) + 'px';
});

tartarusSection.addEventListener('mouseleave', () => {
    firePointer.style.display = 'none';
});




