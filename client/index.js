const quizForm = document.getElementById("quizForm");
const quizContainer = document.getElementById("quizContainer");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const errorMessage = document.getElementById("errorMessage");

const statusDiv = document.getElementById("status");
const timerDiv = document.getElementById("timer");
const submitButton = document.getElementById("submitButton");

let linkData = null, countdown = null, submitted = false;

function getLinkId() {
  const parts = window.location.pathname.split("/");
  const index = parts.indexOf("s");
  return index !== -1 && parts[index + 1] ? parts[index + 1] : null;
}

function showError(message) {
  loading.classList.add("d-none");
  quizForm.classList.add("d-none");
  errorMessage.textContent = message;
  error.classList.remove("d-none");
}

function renderQuiz(quiz) {
  quizContainer.innerHTML = "";
  quiz.forEach((q, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-4";
    wrapper.innerHTML = `<h5>${i + 1}. ${q.question}</h5>`;
    if (q.type === "mcq") {
      q.options.forEach((opt, idx) => {
        wrapper.innerHTML += `
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="${q.id}" value="${opt}" id="${q.id}-${idx}" required>
            <label class="form-check-label" for="${q.id}-${idx}">${opt}</label>
          </div>`;
      });
    } else if (q.type === "text") {
      wrapper.innerHTML += `<input type="text" class="form-control" name="${q.id}" placeholder="Enter your answer" required>`;
    }
    quizContainer.appendChild(wrapper);
  });
}

function startCountdown(seconds) {
  let remaining = seconds;
  timerDiv.textContent = remaining;
  countdown = setInterval(() => {
    remaining -= 0.1;
    if (remaining <= 0) {
      clearInterval(countdown);
      timerDiv.textContent = "0";
      redirectToDestination();
    } else {
      timerDiv.textContent = remaining.toFixed(1);
    }
  }, 100);
}

async function redirectToDestination() {
  if (!linkData) return;
  if (!submitted) {
    statusDiv.innerHTML = `<span class="text-warning">Time expired. Redirecting...</span>`;
  }
  window.location.href = linkData.targetUrl;
}

async function submitAnswers() {
  const answers = linkData.quiz.map(q => {
    const field = quizForm.elements[q.id];
    let answer = "";
    if (q.type === "mcq") {
      const selected = quizForm.querySelector(`input[name="${q.id}"]:checked`);
      answer = selected ? selected.value : "";
    } else {
      answer = field.value.trim();
    }
    return { questionId: q.id, answer };
  });
  const response = await fetch(`/api/link/${id}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Submission failed");
}

async function loadQuiz() {
  const id = getLinkId();
  if (!id) return showError("Invalid Phishy link.");
  try {
    const res = await fetch(`/s/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid or expired link");
    if (!Array.isArray(data.quiz) || data.quiz.length === 0)
      throw new Error("This link does not contain a valid quiz.");
    linkData = data;
    renderQuiz(data.quiz);
    loading.classList.add("d-none");
    quizForm.classList.remove("d-none");
    startCountdown(data.redirectTime);
  } catch (err) {
    showError(err.message);
  }
}

quizForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitted) return;
  submitButton.disabled = true;
  statusDiv.innerHTML = `<span class="text-primary">Submitting...</span>`;
  try {
    await submitAnswers();
    submitted = true;
    statusDiv.innerHTML = `<span class="text-success">Response submitted successfully.</span>`;
  } catch (err) {
    submitButton.disabled = false;
    statusDiv.innerHTML = `<span class="text-danger">${err.message}</span>`;
  }
});

loadQuiz();
