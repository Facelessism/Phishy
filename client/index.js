const form = document.getElementById("quizForm");
const statusDiv = document.getElementById("status");

let config = null;

async function loadConfig() {
  try {
    const response = await fetch("http://localhost:3000/config");

    config = await response.json();
  } catch (error) {
    statusDiv.innerHTML =
      "<span class='text-danger'>Failed to load config</span>";
  }
}

loadConfig();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.q1.value || !form.q2.value) {
    statusDiv.innerHTML =
      "<span class='text-danger'>Answer all questions</span>";

    return;
  }

  const answers = [
    form.q1.value,
    form.q2.value
  ];

  try {

    statusDiv.innerHTML =
      "<span class='text-primary'>Submitting...</span>";

    await fetch("http://localhost:3000/submit", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({ answers })
    });

    statusDiv.innerHTML =
      `<span class='text-success'>
        Submitted successfully.
        Redirecting in ${config.redirectTime}s...
      </span>`;

    setTimeout(() => {
      window.location.href = config.redirectUrl;
    }, config.redirectTime * 1000);

  } catch (error) {

    statusDiv.innerHTML =
      "<span class='text-danger'>Submission failed</span>";
  }
});
