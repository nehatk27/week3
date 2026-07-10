const galleryImages = document.querySelectorAll(".gallery-img");

let options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

let callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.onload = () => {
        img.removeAttribute("data-src");
      };
      observer.unobserve(img);
    }
  });
};

let observer = new IntersectionObserver(callback, options);

galleryImages.forEach((image) => {
  observer.observe(image);
});
