let startvalue = 0;
let loading = false;

const contentDiv = document.getElementById("content");
const loadingDiv = document.getElementById("loading");

const getPosts = async (n) => {
  try {
    let response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=${n}&_limit=10`,
    );

    if (!response.ok) {
      throw new Error("HTTP Error! Status:", response.status);
    }
    return await response.json();
  } catch (e) {
    throw new Error("Failed to fetch services: ", e.message);
  }
};

function appendData(data) {
  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p>`;
    contentDiv.appendChild(div);
  });
}

const observer = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting && !loading) {
      loading = true;
      startvalue += 10;
      try {
        const data = await getPosts(startvalue);
        appendData(data);

        if (contentDiv.childNodes.length >= 100) {
          loadingDiv.innerHTML = "End of feed";
        }
      } catch (e) {
        console.log(e.message);

        const retryBtn = document.createElement("button");
        retryBtn.textContent = "Retry";
        loadingDiv.appendChild(retryBtn);

        retryBtn.addEventListener("click", () => {
          let retriedData = getPosts(startvalue);
          appendData(retriedData);
        });
      }
      loading = false;
    }
  },
  { threshold: 1.0 },
);

observer.observe(loadingDiv);

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const posts = await getPosts(startvalue);
    if (posts) {
      appendData(posts);
    } else {
      console.log("posts not found or undefined");
    }
  } catch (e) {
    console.log(e.message);
  }
});
