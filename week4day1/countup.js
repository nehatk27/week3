const counterDivs = document.querySelectorAll(".counter-div");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector(".counter");
        const start = Number(counter.textContent);
        if (counter) {
          if (!counter.dataset.startValue) {
            counter.dataset.startValue = counter.textContent; // to start from whichever value is given inside h3
          }
          animateCounter(counter);
        }
      }
    });
  },
  {
    threshold: 0.5,
  },
);

function animateCounter(counter) {
  const start = Number(counter.dataset.startValue);
  const target = Number(counter.dataset.target);
  const duration = 2000;
  let startTime = null;

  function updateCount(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); // progress from 0 to 1

    const easeOutQuad = progress * (2 - progress);
    const current = Math.floor(start + (target - start) * easeOutQuad);
    counter.textContent = Math.floor(current);

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(updateCount);
}

counterDivs.forEach((div) => observer.observe(div));

// ==== progress-bar
const progressBar = document.getElementById("progress-bar");
let start;

function step(timestamp) {
  if (start === undefined) start = timestamp;
  const elapsed = timestamp - start;
  const shift = Math.min(0.5 * elapsed, 1000); // 1000/0.5 = 2000ms = 2s
  progressBar.style.width = `${shift}px`;
  if (shift < 1000) {
    requestAnimationFrame(step);
  }
}

requestAnimationFrame(step);
