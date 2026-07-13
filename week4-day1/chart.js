const container = document.querySelector("#container");
const boxes = document.querySelectorAll(".box");

const dataPercentages = [0.4, 0.8, 0.6];

const observer = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const containerWidth = entry.contentRect.width;
    const containerHeight = entry.contentRect.height;

    boxes.forEach((box, index) => {
      const targetHeight = containerHeight * dataPercentages[index];
      box.style.height = `${targetHeight}px`;

      const targetWidth = containerWidth * 0.15;
      box.style.width = `${targetWidth}px`;
    });
  }
});

observer.observe(container);

// === matchMedia ==
const pixel768 = window.matchMedia("(max-width: 768px)");
const pixel1024 = window.matchMedia("(max-width: 1024px)");

function handle768(e) {
  if (e.matches) {
    console.log("Viewport crossed 768px: Now in Mobile/Tablet mode (≤ 768px)");
  } else {
    console.log("Viewport crossed 768px: Now in Desktop mode (> 768px)");
  }
}

function handle1024(e) {
  if (e.matches) {
    console.log(
      "Viewport crossed 1024px: Now in Tablet/Small Screen mode (≤ 1024px)",
    );
  } else {
    console.log(
      "Viewport crossed 1024px: Now in Large Desktop mode (> 1024px)",
    );
  }
}

// 4. Attach the listeners to watch for changes
pixel768.addEventListener("change", handle768);
pixel1024.addEventListener("change", handle1024);
