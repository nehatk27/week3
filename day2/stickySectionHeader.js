const stickyHeader = document.getElementById("sticky-header");
const sections = document.querySelectorAll(".gallery-section");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    console.log(entries);

    entries.forEach((entry) => {
      console.log("i am gonna intersect", entry.target);

      const title = entry.target.querySelector("h2").textContent;
      if (entry.isIntersecting) {
        console.log("interescted");
        console.log(entry);

        stickyHeader.textContent = title;
        stickyHeader.style.display = "block";
        console.log("Stickyheader:: ", stickyHeader);
      }
    });
  },
  {
    root: null,
    rootMargin: "-70px 0px -780px 0px",
  },
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});
