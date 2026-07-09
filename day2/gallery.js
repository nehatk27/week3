const overlay = document.getElementById("overlay-id");
const overlayImage = document.getElementById("overlay-img");
const closeBtn = document.querySelector(".close-btn");
const images = document.querySelectorAll(".gallery-img");
const leftArrow = document.querySelector(".prev-btn");
const rightArrow = document.querySelector(".next-btn");

let touchStartX = 0;
let touchEndX = 0;

let currentIndex = 0;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("gallery-img")) {
    currentIndex = Array.from(images).indexOf(e.target);
    const srcLink = images[currentIndex].src;
    overlayImage.setAttribute("src", srcLink);
    overlay.classList.add("open");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  }
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay || e.target === closeBtn) {
    console.log(e.target);
    overlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
});

function nextImage() {
  currentIndex++;
  if (currentIndex >= images.length) currentIndex = 0;
  overlayImage.setAttribute("src", images[currentIndex].src);
}

function prevImage() {
  currentIndex--;
  if (currentIndex < 0) currentIndex = images.length - 1;
  overlayImage.setAttribute("src", images[currentIndex].src);
}

leftArrow.addEventListener("click", () => {
  prevImage();
});

rightArrow.addEventListener("click", () => {
  nextImage();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    overlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  if (overlay.classList.contains("open")) {
    const focusableElements = [closeBtn, leftArrow, rightArrow];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === "ArrowRight") nextImage();
    else if (e.key === "ArrowLeft") prevImage();

    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  }
});

overlay.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

overlay.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;

  const swipeDistance = touchStartX - touchEndX;

  if (Math.abs(swipeDistance) > 40) {
    if (swipeDistance > 0) {
      nextImage();
    } else {
      prevImage();
    }
  }
});
