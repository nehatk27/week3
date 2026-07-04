const userNameInput = document.getElementById("username-input");
const searchBtn = document.getElementById("search-btn");
const githubContainer = document.getElementById("github-container");
const reposContainer = document.getElementById("repos");

let controller;
searchBtn.addEventListener("click", getGithubProfile);

async function getGithubProfile() {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();
  signal = controller.signal;

  if (reposContainer) reposContainer.innerHTML = "";

  try {
    const githubUrl = `https://api.github.com/users/${userNameInput.value}`;

    const githubResponse = await fetch(githubUrl, { signal });

    if (!githubResponse.ok) {
      if (githubResponse.status === 404) {
        throw new Error("User not found! (404 Error)");
      } else if (
        githubResponse.status === 403 ||
        githubResponse.status === 429
      ) {
        throw new Error(
          "API rate limited. Cannot access data now! (403 / 429 Error)",
        );
      } else {
        throw new Error(`Http Error! Status: ${githubResponse.status}`);
      }
    }

    const githubData = await githubResponse.json();

    const avatarUrl = githubData.avatar_url;
    const githubName = githubData.name;
    const githubBio = githubData.bio;
    const followers = githubData.followers;
    const following = githubData.following;
    const location = githubData.location;

    document.getElementById("profile-avatar").setAttribute("src", avatarUrl);
    document.getElementById("profile-name").textContent = githubName;
    document.getElementById("profile-bio").textContent = githubBio;
    document.getElementById("profile-followers").textContent = followers;
    document.getElementById("profile-following").textContent = following;
    document.getElementById("profile-location").textContent = location;

    // === repos ===

    const githubReposUrl = `https://api.github.com/users/${userNameInput.value}/repos`;
    const githubReposResponse = await fetch(githubReposUrl);

    if (!githubReposResponse.ok) {
      if (githubReposResponse.status === 404) {
        throw new Error("User not found! (404 Error)");
      } else if (
        githubReposResponse.status === 403 ||
        githubReposResponse.status === 429
      ) {
        throw new Error(
          "API rate limited. Cannot access data now! (403 / 429 Error)",
        );
      } else {
        throw new Error(`Http Error! Status: ${githubReposResponse.status}`);
      }
    }

    const githubReposData = await githubReposResponse.json();

    const fetchedrepoName = githubReposData[0].name;
    const fetchedrepoStars = githubReposData[0].stargazers_count;
    const fetchedrepoDescription = githubReposData[0].description;
    const fetchedrepoLanguage = githubReposData[0].language;

    let topSixRepoData = githubReposData
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    topSixRepoData.forEach((repo) => {
      const repoDiv = document.createElement("div");
      const repoName = document.createElement("h4");
      const repoDescr = document.createElement("p");
      const repoLang = document.createElement("p");
      const repoStars = document.createElement("p");
      const starIcon = document.createElement("span");

      repoDiv.className = "repo";
      repoName.className = "repo-name";
      repoDescr.className = "repo-descr";
      repoLang.className = "repo-lang";
      repoStars.className = "repo-stars";

      reposContainer.appendChild(repoDiv);
      repoDiv.appendChild(repoName);
      repoDiv.appendChild(repoDescr);
      repoDiv.appendChild(repoLang);
      repoDiv.appendChild(repoStars);
      repoStars.appendChild(starIcon);

      repoName.textContent = repo.name;
      repoDescr.textContent = repo.description || "No description provided.";
      repoLang.textContent = repo.language || "N/A";
      repoStars.textContent = repo.stargazers_count;
      starIcon.textContent = "☆";
    });
  } catch (error) {
    console.error("Fetch error: ", error.message);
    alert(`error: ${error.message}`);
  }
}
