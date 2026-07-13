const handleIntersection = (entries, guard) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      guard.unobserve(entry.target);
    }
  });
};

const observerOptions = {
  root: null, // Use the main screen viewport
  threshold: 0.1, // Trigger when 10% of the element is visible
};
const animatorObserver = new IntersectionObserver(
  handleIntersection,
  observerOptions,
);

const headings = document.querySelectorAll("main h2");
const articles = document.querySelectorAll(".fade-in-element");

headings.forEach((heading) => animatorObserver.observe(heading));
articles.forEach((article) => animatorObserver.observe(article));

// -----Progress bar------
const progressBar = document.getElementById("progress-bar");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const totalHeight = document.documentElement.scrollHeight;
  const screenHeight = window.innerHeight;
  const scrollableDistance = totalHeight - screenHeight;
  if (scrollableDistance <= 0) return;

  const scrollPercentage = (currentScroll / scrollableDistance) * 100;

  progressBar.style.width = `${scrollPercentage}%`;
});

// ----- Back to Top Button  -----
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
// ============= comment section =========
let commentsArray = [];
const allMainForms = document.querySelectorAll(".main-comment-form");

window.addEventListener("DOMContentLoaded", () => {
  commentsArray = JSON.parse(localStorage.getItem("persistedComments")) || [];
  renderAllSections();
});

allMainForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const currentForm = e.target;
    const articleEl = currentForm.closest("article");
    const articleId = articleEl
      ? articleEl.getAttribute("data-article-id")
      : "global";

    const userName = currentForm
      .querySelector('[name="username"]')
      .value.trim();
    const commentToPost = currentForm
      .querySelector('[name="comment-text"]')
      .value.trim();

    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

    let commentObj = {
      id: uniqueId,
      articleId: articleId,
      name: userName,
      text: commentToPost,
      upvotes: 0,
      replies: [],
    };

    commentsArray.push(commentObj);
    currentForm.reset();
    renderAllSections();
  });
});

function renderAllSections() {
  localStorage.setItem("persistedComments", JSON.stringify(commentsArray));

  const articles = document.querySelectorAll("article[data-article-id]");

  articles.forEach((article) => {
    const articleId = article.getAttribute("data-article-id");
    const articleCommentsList = article.querySelector(
      ".comments-container, .comments-list",
    );

    if (!articleCommentsList) return;

    articleCommentsList.innerHTML = "";

    const filteredComments = commentsArray.filter(
      (c) => c.articleId === articleId,
    );

    const sortedComments = [...filteredComments].sort((a, b) => b.id - a.id);

    sortedComments.forEach((comment) => {
      const li = createCommentNode(comment);
      articleCommentsList.appendChild(li);
    });
  });
}

function findCommentById(array, id) {
  for (let item of array) {
    if (item.id === id) return item;
    if (item.replies && item.replies.length > 0) {
      const found = findCommentById(item.replies, id);
      if (found) return found;
    }
  }
  return null;
}

function createCommentNode(comment) {
  const li = document.createElement("li");
  li.style.margin = "10px 0";

  const nameSpan = document.createElement("strong");
  nameSpan.textContent = comment.name + ": ";

  const textDiv = document.createElement("span");
  textDiv.textContent = comment.text;

  const actionsDiv = document.createElement("div");
  actionsDiv.style.marginTop = "5px";

  const replyButton = document.createElement("button");
  replyButton.textContent = "Reply";
  replyButton.style.marginRight = "10px";

  const upvoteButton = document.createElement("button");
  upvoteButton.textContent = `👍 Upvote (${comment.upvotes})`;

  const formElement = document.createElement("form");
  formElement.style.display = "none";
  formElement.style.marginTop = "10px";

  formElement.innerHTML = `
    <input type="text" placeholder="Your Name" required style="display:block; margin-bottom:5px;">
    <textarea placeholder="Write a reply..." required style="display:block; margin-bottom:5px;"></textarea>
    <button type="submit">Submit Reply</button>
  `;

  replyButton.addEventListener("click", () => {
    formElement.style.display =
      formElement.style.display === "none" ? "block" : "none";
  });

  upvoteButton.addEventListener("click", () => {
    const upvoteList = JSON.parse(localStorage.getItem("upvotedList")) || [];
    if (upvoteList.includes(comment.id)) {
      alert("You have already upvoted this comment");
    } else {
      upvoteList.push(comment.id);
      localStorage.setItem("upvotedList", JSON.stringify(upvoteList));
      const targetComment = findCommentById(commentsArray, comment.id);
      if (targetComment) {
        targetComment.upvotes++;
      }
      renderAllSections();
    }
  });

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = formElement.querySelector("input").value.trim();
    const commentToPost = formElement.querySelector("textarea").value.trim();
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

    let commentObjNested = {
      id: uniqueId,
      name: userName,
      text: commentToPost,
      upvotes: 0,
      replies: [],
    };

    const parentComment = findCommentById(commentsArray, comment.id);
    if (parentComment) {
      parentComment.replies.push(commentObjNested);
    }
    renderAllSections();
  });

  li.appendChild(nameSpan);
  li.appendChild(textDiv);

  actionsDiv.appendChild(replyButton);
  actionsDiv.appendChild(upvoteButton);
  li.appendChild(actionsDiv);
  li.appendChild(formElement);

  if (comment.replies && comment.replies.length > 0) {
    const subList = document.createElement("ul");
    subList.style.paddingLeft = "20px";
    subList.style.borderLeft = "1px dotted #ccc";

    const sortedReplies = [...comment.replies].sort((a, b) => b.id - a.id);

    sortedReplies.forEach((reply) => {
      const replyNode = createCommentNode(reply);
      subList.appendChild(replyNode);
    });
    li.appendChild(subList);
  }
  return li;
}

// ================== Mutation Observer ====================

const targetNode = document.getElementById("blog");
const config = { childList: true, subtree: false };
const mutationCallback = (mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          console.log("MutationObserver active! New node added to blog:", node);

          if (node.classList.contains("fade-in-element")) {
            animatorObserver.observe(node);
            console.log("Linked article directly to IntersectionObserver!");
          }
        }
      });
    }
  });
};

const muObserver = new MutationObserver(mutationCallback);

if (targetNode) {
  muObserver.observe(targetNode, config);
}

// ====== Dummy Data ======
const addArticleBtn = document.getElementById("add-article-btn");

const dummyArticles = [
  {
    title: "Mastering CSS Grid Layouts",
    author: "Sarah Connor",
    category: "design",
    text: "CSS Grid is one of the most powerful layout systems available in modern web development. It allows you to align items into columns and rows effortlessly.",
  },
];

if (addArticleBtn) {
  addArticleBtn.addEventListener("click", () => {
    const randomData = dummyArticles[0];
    const uniqueId = Date.now();

    const newArticle = document.createElement("article");
    newArticle.className = "fade-in-element";
    newArticle.setAttribute("data-article-id", uniqueId);

    newArticle.innerHTML = `
      <h2>${randomData.title} (New Dynamic Entry)</h2>
      <small><time datetime="2026-07-10">July 10, 2026</time></small>
      <section>
        <p>${randomData.text}</p>
      </section>
      <footer>
        Author: <span>${randomData.author} | </span>Category: <a href="#">${randomData.category}</a>
      </footer>
      <section class="comments">
        <details>
          <summary>Comments</summary>
          <form class="main-comment-form">
            <input type="text" name="username" placeholder="Username" required />
            <textarea name="comment-text" placeholder="type your comment here.." required></textarea>
            <button type="submit">Post</button>
          </form>
          <ul class="comments-container"></ul>
        </details>
      </section>
    `;

    targetNode.appendChild(newArticle);
  });
}

// ===log every change in floating overlay panel===
const uiLogBox = document.getElementById("ui-log-box");

function DOMchangeMObserver(mutationList) {
  mutationList.forEach((mutation) => {
    if (mutation.target.closest("#ui-log-box")) return;
    let textLog = "";
    if (mutation.type === "childList") {
      if (mutation.addedNodes.length > 0) {
        textLog = "DOM change: element added";
      }
      if (mutation.removedNodes.length > 0) {
        textLog = "DOM change: element deleted";
      }
    } else if (mutation.type === "attributes") {
      textLog = `DOM change: attribute (${mutation.attributeName}) changed`;
    }

    if (textLog && uiLogBox) {
      uiLogBox.innerHTML += `<div> ${textLog}</div>`;
      uiLogBox.scrollTop = uiLogBox.scrollHeight;
    }
  });
}

const DOMMutationObserver = new MutationObserver(DOMchangeMObserver);

DOMMutationObserver.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
});
