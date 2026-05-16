/**
* Template Name: MyResume
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();





/**
   * Sky
   */
// Get the canvas element and set its size to match its display size
const canvas = document.getElementById("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d");

// Direction constants for cloud movement
const LEFT = "LEFT";
const RIGHT = "RIGHT";

// Randomly decide the direction of cloud movement
const getDir = () => {
  const dec = Math.floor(Math.random() * 30);
  if (dec < 16) return LEFT;
  // ~50% chance to go left
  else return RIGHT; // ~50% chance to go right
};

class Cloud {
  constructor(x, y) {
    this.x = x; // X position
    this.y = y; // Y position (top of canvas)
    this.size = Math.floor(Math.random() * 30); // Random radius for cloud
    this.clr = "silver"; // Cloud color
    this.dir = getDir(); // Initial movement direction
    this.speed = Math.floor(Math.random() * 2) + 1; // Speed (1–2 px per frame)
  }

  // Movement helpers
  moveLeft() {
    this.x -= this.speed;
  }
  moveRight() {
    this.x += this.speed;
  }

  // Update cloud position and change direction at canvas edges
  update() {
    if (this.x <= 0) {
      this.dir = RIGHT; // Bounce back if at left edge
    } else if (this.x >= canvas.width) {
      this.dir = LEFT; // Bounce back if at right edge
    }

    if (this.dir === LEFT) this.moveLeft();
    else this.moveRight();
  }

  // Draw smaller branches ("roots") coming off lightning
  drawRoot(x, y, col) {
    let sx = x,
      sy = y,
      ex = sx + Math.floor(Math.random() * 50) - 15,
      ey = sy + Math.floor(Math.random() * 30);

    let i = 0,
      limit = Math.floor(Math.random() * 20); // number of segments

    while (i < limit) {
      ctx.beginPath();
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Update start and end points for next segment
      sx = ex;
      sy = ey;
      ex = sx + Math.floor(Math.random() * 50) - 15;
      ey = sy + Math.floor(Math.random() * 30);
      i++;
    }
  }

  // Draw a lightning strike from the cloud
  drawLightning(color) {
    // Create a flash effect on the whole canvas
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let sx = this.x,
      sy = this.y, // start at cloud position
      ex = sx + Math.floor(Math.random() * 30) - 15,
      ey = sy + Math.floor(Math.random() * 30);

    let i = 0,
      limit = Math.floor(Math.random() * canvas.height); // segment count

    while (i < limit) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Update start and end points
      sx = ex;
      sy = ey;
      ex = sx + Math.floor(Math.random() * 30) - 15;
      ey = sy + Math.floor(Math.random() * 30);

      // Occasionally branch lightning into roots
      let root = Math.floor(Math.random() * 1000);
      if (root < 50) {
        this.drawRoot(sx, sy, color);
      }
      i++;
    }
  }

  // Draw the cloud itself and maybe trigger lightning
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.clr;
    ctx.arc(this.x, this.y - 1, this.size, 0, 2 * Math.PI); // cloud shape
    ctx.fill();

    // Random chance for lightning
    const chance = 0.0003; // 0.03% chance
    if (Math.random() < chance) {
      this.drawLightning("silver");
    }
  }
}

// Store all clouds
const clouds = [];
let i = 0;

// Fill the canvas top with clouds spaced randomly
while (i < canvas.width) {
  clouds.push(new Cloud(i, 0));
  i += Math.floor(Math.random() * 10) + 1;
}

// Main animation loop
const animate = () => {
  // Fill background black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add a glow effect
  ctx.shadowColor = "aliceblue";
  ctx.shadowBlur = 10;

  // Update and draw each cloud
  for (let c of clouds) {
    c.draw();
    c.update();
  }

  requestAnimationFrame(animate); // keep looping
};

animate();

// Handle window resize (keep canvas full screen)
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});




//Tartarus
const config = {
	colors: [
		// spark possible colors
		"#eddc01",
		"#f2b125",
		"#fd9407",
		"#ff7308",
		"#eb5508",
		"#fe1a17",
		"#e93702"
	],
	sizes: [4, 6, 8], // diameter in px
	minimalDistance: 20, // minimal distance between spawned
	gravitation: 0.2,
	airResistance: 0.98,
	shrink: 0.1
};

//? store coordinates of the prev and last generated spark
var prev = { x: 0, y: 0 },
	last = { x: 0, y: 0 };

//? cash frequantly used elements
const $body = $("body");
const $document = $(document);

const appendElement = (el) => $body.append(el),
	removeElement = (el) => setTimeout(() => $(el).remove());

//? pick random element in defined range from array
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
	pickRandom = (arr) => arr[rand(0, arr.length - 1)];

const calcDistance = (a, b) =>
	Math.floor(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2));

const calcAngleRadians = (startPoint, endPoint) =>
	Math.atan2(startPoint.y - endPoint.y, endPoint.x - startPoint.x);

const updateCoords = (position) => {
	//? update position of prev generated spark
	prev.x = last.x;
	prev.y = last.y;
	//? and the last spark
	last.x = position.x;
	last.y = position.y;
};

const generateSpeed = () => {
	var angle = (Math.random() * 360 * Math.PI) / 180; //? random angle in radians
	var speed = Math.random() * 2 + 1; //? random speed

	//? additional speed that depends on the speed and direction of mouse movement
	var addSpeed = (calcDistance(prev, last) / config.minimalDistance) * 2;
	var addSpeedY = addSpeed * Math.sin(calcAngleRadians(prev, last));
	var addSpeedX = addSpeed * Math.cos(calcAngleRadians(prev, last));

	//? output X and Y axis speeds
	var speedY = speed * Math.sin(angle) + addSpeedY;
	var speedX = speed * Math.cos(angle) + addSpeedX;

	return { speedX, speedY };
};

const animateSpark = (spark) => {
	//? constants for physically realistic animation
	var { speedX, speedY } = generateSpeed();
	const gravitation = config.gravitation;
	const airResistance = config.airResistance;
	const shrink = config.shrink;

	function animate() {
		spark.css({
			top: "-=" + speedY,
			left: "+=" + speedX,
			width: "-=" + shrink,
			height: "-=" + shrink
		});
		//? gravitation imitation
		speedY -= gravitation;
		//? air resistance imitation
		speedX *= airResistance;

		//? if a spark is beyond the page or its size is smaller than 0
		if (
			$(spark).top > $(window).height ||
			$(spark).left < 0 ||
			$(spark).width() <= 0
		) {
			removeElement(spark);
		} else {
			requestAnimationFrame(animate);
		}
	}
	animate();
};

const createSpark = (position) => {
	const spark = $("<div></div>");
	const size = pickRandom(config.sizes);
	spark.addClass("spark");
	spark.append(`<div class="spark-glow"></div>`);
	$(spark).css({
		left: position.x,
		top: position.y,
		background: pickRandom(config.colors),
		width: size,
		height: size
	});

	animateSpark(spark);
	appendElement(spark);

	updateCoords(position);
};

$document.mousemove((e) => {
	const position = {
		x: e.clientX,
		y: e.clientY
	};
	if (calcDistance(last, position) > config.minimalDistance)
		createSpark(position);
});




// TARTARUS

(function() {
    const canvas = document.getElementById('canvas-tartarus-dark');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class TinyFlame {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            // Forma a fiammella: più alta che larga
            this.width = Math.random() * 8 + 4;
            this.height = this.width * 1.5; 
            
            this.speedY = Math.random() * 0.5 + 0.2;
            this.opacity = 0.5;
            this.angle = Math.random() * Math.PI * 2; // Per l'ondeggiamento
            
            // Colore Rosso Bordeaux / Sangue scuro
            this.color = "rgba(80, 10, 10, "; 
        }

        update() {
            this.y -= this.speedY;
            this.opacity -= 0.002;
            // Ondeggiamento laterale leggero
            this.angle += 0.02;
            this.x += Math.sin(this.angle) * 0.3;
            // La fiammella si restringe salendo
            this.width *= 0.995;
            this.height *= 0.995;
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            
            // Creiamo un gradiente ellittico per simulare la fiammella
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.height);
            grad.addColorStop(0, this.color + this.opacity + ")");
            grad.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = grad;
            
            // Disegniamo un'ellisse invece di un cerchio
            ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function animate() {
        // Puliamo rendendo tutto trasparente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (particles.length < 40) { // Numero ridotto per non "scoppiettare"
            particles.push(new TinyFlame());
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].opacity <= 0 || particles[i].y < 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
})();




//INFERIIII
(function() {
    "use strict";

    // --- 1. SHADER SOURCES (Riscritto per un fuoco denso e in basso) ---
    const TARTARUS_VS = `
        attribute vec3 position;
        void main() { gl_Position = vec4(position, 1.0); }
    `;

    const TARTARUS_FS = `
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        
        // Funzioni matematiche per il rumore del fuoco
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m; return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        float noiseStack(vec3 pos,int octaves,float falloff){
            float noise = snoise(vec3(pos));
            float off = 1.0;
            if (octaves>1) { pos *= 2.0; off *= falloff; noise = (1.0-off)*noise + off*snoise(vec3(pos)); }
            if (octaves>2) { pos *= 2.0; off *= falloff; noise = (1.0-off)*noise + off*snoise(vec3(pos)); }
            return (1.0+noise)/2.0;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            float yPos = uv.y;

            // --- MODIFICA PER ALZARE LE FIAMME ---
            // 1. Abbassiamo il moltiplicatore (da 1.5 a 1.05) per far salire il fuoco
            // 2. Aumentiamo leggermente la potenza (da 3.0 a 4.0) per sfumare più dolcemente in cima
            float fade = pow(clamp(1.0 - yPos * 0.50, 0.0, 1.0), 4.0);
            
            float realTime = time * 0.4; // Movimento leggermente più lento per fiamme lunghe
            
            // --- Resto del calcolo del rumore (mantieni come prima) ---
            vec3 flow = vec3(0.0, -1.8, 0.0); // Spinta verticale leggermente aumentata
            vec3 timing = realTime * vec3(0.0, -1.7, 1.1) + flow;
            vec3 noiseCoord = (vec3(2.5, 1.1, 1.0) * vec3(uv * 7.0, 0.0) + timing); // Meno nodi (7.0 invece di 8.0) per lingue più lunghe
            float noise = noiseStack(noiseCoord, 3, 0.4);
            
            // Intensità basata su rumore e altezza
            float flameIntensity = noise * fade;

            // --- TUA PALETTE COLORI (Manteniamo i tuoi Arancio -> Rosso -> Bordeaux) ---
            vec3 orange = flameIntensity * vec3(1.0, 0.4, 0.0);
            vec3 red = flameIntensity * vec3(0.8, 0.0, 0.0);
            vec3 bordeaux = flameIntensity * vec3(0.3, 0.0, 0.05);

            // Mix finale dei colori
            vec3 fireColor = (orange * 1.9) + (red * 1.3) + (bordeaux * 0.9);
            
            // --- 4. Alpha (Aumentiamo leggermente l'alpha finale per densità) ---
            float alpha = clamp(flameIntensity * 4.0 * fade, 0.0, 1.0);
            
            gl_FragColor = vec4(fireColor, alpha);
        }
    `;

    // --- 2. STATO LOCALE E INIZIALIZZAZIONE ---
    let gl, prg, startT, canvas;

    function initWebGL() {
        // Cerchiamo il canvas WebGL unico
        canvas = document.getElementById('canvass-webgl-tartarus');
        if (!canvas) return;

        // Inizializziamo il contesto con Alpha trasparente
        gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
        if (!gl) return;

        // Compilazione Shader VS
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, TARTARUS_VS); gl.compileShader(vs);
        
        // Compilazione Shader FS (Quello che disegna il fuoco)
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, TARTARUS_FS); gl.compileShader(fs);

        // Creazione e Link del Programma
        prg = gl.createProgram();
        gl.attachShader(prg, vs); gl.attachShader(prg, fs);
        gl.linkProgram(prg); gl.useProgram(prg);

        // Setup Geometria (piano 2D che copre lo schermo)
        const pos = new Float32Array([-1,1,1,1,-1,-1,1,-1]);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
        const al = gl.getAttribLocation(prg, 'position');
        gl.enableVertexAttribArray(al);
        gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);

        startT = Date.now();
        resize(); // Forziamo il primo resize
        render(); // Avviamo il loop di disegno
    }

    // --- 3. RENDERING LOOP ---
    function render() {
        if (!gl) return;
        gl.clearColor(0, 0, 0, 0); // Sfondo trasparente WebGL
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(gl.getUniformLocation(prg, 'resolution'), canvas.width, canvas.height);
        gl.uniform1f(gl.getUniformLocation(prg, 'time'), (Date.now() - startT) * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.flush();
        requestAnimationFrame(render);
    }

    // --- 4. UTILITY FUNCTIONS ---
    function resize() {
    if (!canvas) return;
    
    // window.innerWidth legge la larghezza totale, inclusa la zona navbar
    canvas.width = window.innerWidth;
    
    // L'altezza rimane quella della sezione
    const parent = canvas.parentElement;
    canvas.height = parent.clientHeight;
    
    // Aggiorna il viewport WebGL
    if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
}

    // --- 5. LOGICA CURSORE E GESTIONE AVVIO ---
    function startEverything() {
        initWebGL();
        
        const ptr = document.getElementById('fire-pointer-inferi');
        const sec = document.getElementById('inferi');
        
        if (sec && ptr) {
            sec.addEventListener('mousemove', (e) => {
                ptr.style.display = 'flex';
                ptr.style.left = e.clientX + 'px';
                ptr.style.top = e.clientY + 'px';
            });
            sec.addEventListener('mouseleave', () => {
                ptr.style.display = 'none';
            });
        }
    }

    // Listener di sistema
    window.addEventListener('resize', resize);
    
    // Assicuriamoci che il WebGL parta dopo che il DOM è pronto (Bootstrap e AOS)
    if (document.readyState === 'complete') {
        startEverything();
    } else {
        window.addEventListener('load', startEverything);
    }
    
    // Fail-safe per caricamenti AOS ritardati
    setTimeout(startEverything, 1000); 

})();










// pointer fulmine
(function() {
    const skySection = document.getElementById('home'); // Assicurati che l'ID corrisponda alla sezione Zeus
    const lightningPointer = document.getElementById('lightning-pointer-sky');

    if (!skySection || !lightningPointer) return;

    skySection.addEventListener('mousemove', (e) => {
        lightningPointer.style.display = 'flex';
        lightningPointer.style.left = e.clientX + 'px';
        lightningPointer.style.top = e.clientY + 'px';
    });

    skySection.addEventListener('mouseleave', () => {
        lightningPointer.style.display = 'none';
    });
})();



// pointer nuvola
(function() {
    const cloudSection = document.getElementById('cielo'); // Puntiamo alla sezione Aether/Cielo
    const cloudPointer = document.getElementById('cloud-pointer-sky');

    if (!cloudSection || !cloudPointer) return;

    cloudSection.addEventListener('mousemove', (e) => {
        cloudPointer.style.display = 'flex';
        // Usiamo pageX/pageY se la sezione è molto lunga (scroll) 
        // o clientX/clientY se vuoi che segua il mouse rispetto alla finestra
        cloudPointer.style.left = e.clientX + 'px';
        cloudPointer.style.top = e.clientY + 'px';
    });

    cloudSection.addEventListener('mouseleave', () => {
        cloudPointer.style.display = 'none';
    });
})();





//navbar colorata
document.addEventListener('DOMContentLoaded', function() {
  const navMenu = document.getElementById('navmenu');
  const sections = document.querySelectorAll('section[id]'); // Prende tutte le sezioni con un ID

  const options = {
    rootMargin: "-30% 0px -70% 0px" // Si attiva quando la sezione entra nella parte alta dello schermo
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        
        // Rimuove tutti i temi precedenti
        navMenu.classList.remove('nav-theme-home', 'nav-theme-cielo','nav-theme-terra', 'nav-theme-mare', 'nav-theme-inferno', 'nav-theme-interactive');

        // Aggiunge il tema specifico in base all'ID della sezione
        if (sectionId === 'home') navMenu.classList.add('nav-theme-home');
        if (sectionId === 'cielo') navMenu.classList.add('nav-theme-cielo');
        if (sectionId === 'terra') navMenu.classList.add('nav-theme-terra');
        if (sectionId === 'mare') navMenu.classList.add('nav-theme-mare');
        if (sectionId === 'inferi') navMenu.classList.add('nav-theme-inferno');
        if (sectionId === 'interactive') navMenu.classList.add('nav-theme-interactive');
        // 'cielo' non aggiunge nulla così usa i colori di default
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
});