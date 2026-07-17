const stopPropCheck = document.querySelector("#enable-stop-prop");
const stopImmediateCheck = document.querySelector("#enable-stop-immediate");

// 1: Log Capturing & Bubbling
for (let elem of document.querySelectorAll("body *")) {
    // Skip control inputs so they don't clutter logs
    if (elem.closest(".controls")) continue;

  elem.addEventListener(
    "click",
    (e) => console.log("Capturing phase: ", elem),
    true,
  );
  elem.addEventListener("click", (e) => console.log("Bubbling phase: ", elem));
}

//  2 & 3: Child Listeners: stopPropagation and stopImmediatePropagation
const child = document.querySelector(".inner-div");

child.addEventListener("click", (e) => {
  if (stopPropCheck.checked) {
    console.log("🛑 stopPropagation() activated! Outer listeners blocked.");
    e.stopPropagation();
  }

  if (stopImmediateCheck.checked) {
    console.log(
      "🛑 stopImmediatePropagation() activated! Next listener blocked.",
    );
    e.stopImmediatePropagation();
  }
});

// Second custom listener on the SAME child element (For Task 3)
child.addEventListener("click", (e) => {
  console.log("👉 2nd listener on inner-div successfully executed!");
});

//  4: preventDefault()
document.querySelector("#my-link").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Link clicked! preventDefault() blocked opening Google.");
});

document.querySelector("#form-id").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Form submitted! preventDefault() blocked page reload.");
});
