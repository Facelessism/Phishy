const adminForm = document.getElementById("adminForm");
const adminStatus = document.getElementById("adminStatus");

adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const redirectUrl =
    document.getElementById("redirectUrl").value;

  const redirectTime =
    Number(document.getElementById("redirectTime").value);

  try {

    const response = await fetch(
      "http://localhost:3000/admin/config",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-admin-token": "secret123"
        },

        body: JSON.stringify({
          redirectUrl,
          redirectTime
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      adminStatus.innerHTML =
        `<span class='text-danger'>
          ${data.error}
        </span>`;

      return;
    }

    adminStatus.innerHTML =
      "<span class='text-success'>Configuration saved</span>";

  } catch (error) {

    adminStatus.innerHTML =
      "<span class='text-danger'>Request failed</span>";
  }
});
