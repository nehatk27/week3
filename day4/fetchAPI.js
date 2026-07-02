fetch("https://jsonplaceholder.typicode.com/posts")
  .then((response) => {
    console.log(`Response status: ${response.status}`);
    console.log(response.headers);
  })
  .catch((error) => {
    console.log(error);
  });

class HTTPError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

async function fetchJSON(url, options) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      ...options,
    });
    if (!response.ok) {
      throw new HTTPError(
        response.status,
        `HTTP Error occurred with status ${response.status}`,
      );
    }
    return await response.json();
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortEror") {
      throw new Error("Server took too  long. Please try again! :)");
    }
    throw error;
  }
}

function createNewPost() {
  const url = "https://jsonplaceholder.typicode.com/posts";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "User 1",
    }),
  };

  fetchJSON(url, options)
    .then((data) => console.log("Success! Created resource:", data))
    .catch((error) => console.log("Failed to create post:", error));
}

createNewPost();
