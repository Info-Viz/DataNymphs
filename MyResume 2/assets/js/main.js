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
    // --- COSTANTI E STATO LOCALE ---
    const section = document.getElementById('inferi');
    const canvasWebGL = document.getElementById('canvass-webgl-inferi');
    const canvas2D = document.getElementById('canvas-tartarus-dark-particles');
    const firePointer = document.getElementById('fire-pointer-inferi');
    
    if (!section || !canvasWebGL || !canvas2D) return;

    const ctx2d = canvas2D.getContext('2d');
    let gl;
    let particles = [];
    let startTime = Date.now();

    // --- 1. GESTIONE DIMENSIONI ---
    function resize() {
        const w = window.innerWidth;
        const h = section.offsetHeight;
        
        canvasWebGL.width = w;
        canvasWebGL.height = h;
        canvas2D.width = w;
        canvas2D.height = h;
        
        if (gl) gl.viewport(0, 0, w, h);
    }

    // --- 2. LOGICA FIAMMELLE 2D ---
    class TinyFlame {
        constructor() {
            this.x = Math.random() * canvas2D.width;
            this.y = canvas2D.height + 20;
            this.width = Math.random() * 6 + 3;
            this.height = this.width * 1.8;
            this.speedY = Math.random() * 0.6 + 0.2;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.angle = Math.random() * Math.PI * 2;
        }
        update() {
            this.y -= this.speedY;
            this.opacity -= 0.0015;
            this.angle += 0.02;
            this.x += Math.sin(this.angle) * 0.3;
        }
        draw() {
            ctx2d.save();
            let grad = ctx2d.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.height);
            grad.addColorStop(0, `rgba(100, 20, 10, ${this.opacity})`);
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx2d.fillStyle = grad;
            ctx2d.beginPath();
            ctx2d.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2);
            ctx2d.fill();
            ctx2d.restore();
        }
    }

    // --- 3. LOGICA CURSORE ---
    section.addEventListener('mousemove', (e) => {
        firePointer.style.display = 'flex';
        firePointer.style.left = e.clientX + 'px';
        firePointer.style.top = e.clientY + 'px';
    });

    section.addEventListener('mouseleave', () => {
        firePointer.style.display = 'none';
    });

    // --- 4. ANIMAZIONE LOOP ---
    function animate() {
        // Pulizia Canvas 2D
        ctx2d.clearRect(0, 0, canvas2D.width, canvas2D.height);

        // Update Particelle
        if (particles.length < 50) particles.push(new TinyFlame());
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            if (p.opacity <= 0) particles.splice(i, 1);
        });

        // Qui andrebbe la logica gl.drawArrays se attiva lo shader
        // (Assicurati di aver incluso gli shader VS/FS nell'HTML)

        requestAnimationFrame(animate);
    }

    // --- START ---
    window.addEventListener('resize', resize);
    resize();
    animate();

})(); // Fine isolamento



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
    const skySection = document.getElementById('sky-section'); // Sostituisci con l'ID della tua sezione cielo
    const cloudPointer = document.getElementById('cloud-pointer-sky');

    if (!skySection || !cloudPointer) return;

    skySection.addEventListener('mousemove', (e) => {
        cloudPointer.style.display = 'flex';
        // Movimento fluido
        requestAnimationFrame(() => {
            cloudPointer.style.left = e.clientX + 'px';
            cloudPointer.style.top = e.clientY + 'px';
        });
    });

    skySection.addEventListener('mouseleave', () => {
        cloudPointer.style.display = 'none';
    });
})();


//pointer nuvola
document.addEventListener('DOMContentLoaded', function() {
    (function() {
        const skySection = document.getElementById('sky-section-unique');
        const cloudPointer = document.getElementById('cloud-pointer-sky');

        if (!skySection || !cloudPointer) {
            console.error("Errore: ID sky-section-unique o cloud-pointer-sky non trovati!");
            return;
        }

        // 1. Mostra e muovi
        skySection.addEventListener('mousemove', (e) => {
            cloudPointer.style.display = 'flex';
            
            // Usiamo le coordinate client per il fixed position
            const x = e.clientX;
            const y = e.clientY;
            
            cloudPointer.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        });

        // 2. Nascondi quando esci
        skySection.addEventListener('mouseleave', () => {
            cloudPointer.style.display = 'none';
        });

        // 3. Fix per il touch (opzionale)
        skySection.addEventListener('touchstart', () => {
            cloudPointer.style.display = 'none';
        }, {passive: true});

    })();
});