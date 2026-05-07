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
    this.clr = "whiter"; // Cloud color
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
    ctx.fillStyle = "rgba(255, 255, 255, 0.86)"; // Riduci l'opacità da 0.85 a 0.15
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
  // Opzione A: Grigio standard (Silver)
  // FORZATURA: Commenta queste due righe se esistono
  // ctx.fillStyle = "black"; 
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  // AGGIUNGI QUESTA: rende il canvas un vetro trasparente
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Opzione B: Grigio scuro (Antracite)
  // ctx.fillStyle = "#333333"; 
  
  // Opzione C: Grigio medio bilanciato
  // ctx.fillStyle = "gray"; 


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

