//THALASSA SLIDER BOLLE//
document.addEventListener("DOMContentLoaded", function () {
  (function() {
    const track = document.querySelector(".bubble-slider-track");
    const slides = document.querySelectorAll(".bubble-slide");
    const nextBtn = document.getElementById("bubbleNext");
    const prevBtn = document.getElementById("bubblePrev");
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    function getSlidesPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    }

    function updateSliderPosition() {
      const slidesPerView = getSlidesPerView();
      const maxIndex = slides.length - slidesPerView;
      
      // Controllo dei confini
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      // Calcola la larghezza di una singola slide compreso il gap
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 30; // Corrisponde al gap impostato nel CSS
      
      const moveDistance = currentIndex * (slideWidth + gap);
      track.style.transform = `translateX(-${moveDistance}px)`;
    }

    nextBtn.addEventListener("click", function () {
      const slidesPerView = getSlidesPerView();
      if (currentIndex < slides.length - slidesPerView) {
        currentIndex++;
        updateSliderPosition();
      }
    });

    prevBtn.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex--;
        updateSliderPosition();
      }
    });

    // Aggiorna la posizione in caso di ridimensionamento della finestra (es. passaggio a mobile)
    window.addEventListener("resize", updateSliderPosition);
  })();
});