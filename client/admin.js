const adminForm = document.getElementById("adminForm");
const adminStatus = document.getElementById("adminStatus");

const questionsContainer = document.getElementById("questionsContainer");
const emptyQuizMessage = document.getElementById("emptyQuizMessage");
const addMcqButton = document.getElementById("addMcq");
const addTextButton = document.getElementById("addText");
const generatedLink = document.getElementById("generatedLink");
const shortUrl = document.getElementById("shortUrl");
const copyLink = document.getElementById("copyLink");

let questionCounter = 0;

function updateEmptyMessage() {
  emptyQuizMessage.classList.toggle(
    "d-none",
    questionsContainer.children.length > 0
  );
}

function createQuestionCard(type) {
  questionCounter += 1;

  const questionId = `q${questionCounter}`;
  const card = document.createElement("div");
  card.className = "card mb-3 border";

  card.dataset.questionId = questionId;
  card.dataset.type = type;

  card.innerHTML = `
    <div class="card-body">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="card-title mb-0">
          Question ${questionCounter}
        </h5>

        <button
          type="button"
          class="btn btn-sm btn-outline-danger delete-question"
        >
          Delete
        </button>
      </div>

      <div class="mb-3">
        <label class="form-label">Question</label>

        <input
          type="text"
          class="form-control question-text"
          placeholder="Enter your question"
          required
        >
      </div>

      ${
        type === "mcq"
          ? `
            <div class="options-container">

              <label class="form-label">
                Options
              </label>

              <div class="option-row input-group mb-2">
                <input
                  type="text"
                  class="form-control option-input"
                  placeholder="Option 1"
                  required
                >

                <button
                  type="button"
                  class="btn btn-outline-danger remove-option"
                >
                  ×
                </button>
              </div>

              <div class="option-row input-group mb-2">
                <input
                  type="text"
                  class="form-control option-input"
                  placeholder="Option 2"
                  required
                >

                <button
                  type="button"
                  class="btn btn-outline-danger remove-option"
                >
                  ×
                </button>
              </div>

            </div>

            <button
              type="button"
              class="btn btn-sm btn-outline-primary add-option"
            >
              + Add Option
            </button>
          `
          : `
            <div class="mb-2">
              <label class="form-label">
                Answer
              </label>

              <input
                type="text"
                class="form-control"
                value="Receiver will enter an answer"
                disabled
              >
            </div>
          `
      }

    </div>
  `;

  questionsContainer.appendChild(card);

  updateEmptyMessage();
}

addMcqButton.addEventListener("click", () => {
  createQuestionCard("mcq");
});

addTextButton.addEventListener("click", () => {
  createQuestionCard("text");
});

questionsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-question")) {
    event.target.closest(".card").remove();
    updateEmptyMessage();
  }

  if (event.target.classList.contains("add-option")) {
    const card = event.target.closest(".card");
    const optionsContainer =
      card.querySelector(".options-container");

    const optionCount =
      optionsContainer.querySelectorAll(".option-row").length;

    const optionRow = document.createElement("div");

    optionRow.className =
      "option-row input-group mb-2";

    optionRow.innerHTML = `
      <input
        type="text"
        class="form-control option-input"
        placeholder="Option ${optionCount + 1}"
        required
      >

      <button
        type="button"
        class="btn btn-outline-danger remove-option"
      >
        ×
      </button>
    `;

    optionsContainer.appendChild(optionRow);
  }

  if (event.target.classList.contains("remove-option")) {
    const card = event.target.closest(".card");

    const options =
      card.querySelectorAll(".option-row");

    if (options.length <= 2) {
      return;
    }

    event.target.closest(".option-row").remove();
  }
});

function collectQuiz() {
  const cards =
    questionsContainer.querySelectorAll(".card");

  const quiz = [];

  cards.forEach((card) => {
    const id = card.dataset.questionId;
    const type = card.dataset.type;

    const question =
      card.querySelector(".question-text").value.trim();

    if (!question) {
      throw new Error("Every question must have text.");
    }

    if (type === "text") {
      quiz.push({
        id,
        type: "text",
        question
      });

      return;
    }

    const optionInputs =
      card.querySelectorAll(".option-input");

    const options = [];

    optionInputs.forEach((input) => {
      const value = input.value.trim();

      if (!value) {
        throw new Error(
          "Every MCQ option must have text."
        );
      }

      options.push(value);
    });

    if (options.length < 2) {
      throw new Error(
        "Every MCQ must have at least two options."
      );
    }

    quiz.push({
      id,
      type: "mcq",
      question,
      options
    });
  });

  return quiz;
}

adminForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  adminStatus.innerHTML = "";
  generatedLink.classList.add("d-none");

  const adminToken =
    document.getElementById("adminToken").value.trim();

  const targetUrl =
    document.getElementById("redirectUrl").value.trim();

  const redirectTime =
    Number(document.getElementById("redirectTime").value);

  if (!adminToken) {
    adminStatus.innerHTML = `
      <div class="alert alert-danger">
        Admin token is required.
      </div>
    `;

    return;
  }

  if (
    !Number.isFinite(redirectTime) ||
    redirectTime < 0 ||
    redirectTime > 1000
  ) {
    adminStatus.innerHTML = `
      <div class="alert alert-danger">
        Redirect time must be between 0 and 1000 seconds.
      </div>
    `;

    return;
  }

  let quiz;

  try {
    quiz = collectQuiz();
  } catch (error) {
    adminStatus.innerHTML = `
      <div class="alert alert-danger">
        ${error.message}
      </div>
    `;

    return;
  }

  if (quiz.length === 0) {
    adminStatus.innerHTML = `
      <div class="alert alert-danger">
        Add at least one question.
      </div>
    `;

    return;
  }

  try {
    const response = await fetch("/admin/create", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken
      },

      body: JSON.stringify({
        targetUrl,
        redirectTime,
        quiz
      })
    });

    const data = await response.json();

    if (!response.ok) {
      adminStatus.innerHTML = `
        <div class="alert alert-danger">
          ${data.message || "Failed to create link."}
        </div>
      `;

      return;
    }

    const fullUrl =
      new URL(data.shortUrl, window.location.origin).href;

    shortUrl.value = fullUrl;

    generatedLink.classList.remove("d-none");

    adminStatus.innerHTML = `
      <div class="alert alert-success">
        Phishy link created successfully.
      </div>
    `;

  } catch (error) {
    adminStatus.innerHTML = `
      <div class="alert alert-danger">
        Unable to connect to the server.
      </div>
    `;
  }
});

copyLink.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shortUrl.value);

    copyLink.textContent = "Copied";

    setTimeout(() => {
      copyLink.textContent = "Copy";
    }, 1500);

  } catch {
    shortUrl.select();
    document.execCommand("copy");

    copyLink.textContent = "Copied";

    setTimeout(() => {
      copyLink.textContent = "Copy";
    }, 1500);
  }
});

updateEmptyMessage();
