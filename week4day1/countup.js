const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector(".counter");
        if (counter) {
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
  const target = Number(counter.dataset.target);
  const duration = 2000;
  let startTime = null;

  function updateCount(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); // progress from 0 to 1

    counter.textContent = Math.floor(progress * target);

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(updateCount);
}

const statDivs = document.querySelectorAll("#stats > div");
statDivs.forEach((div) => observer.observe(div));
