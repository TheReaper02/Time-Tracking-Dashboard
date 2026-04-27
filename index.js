const dashboard = document.querySelector(".dashboard");
const timeframeButtons = document.querySelectorAll("[data-time]");

const previousLabelMap = {
  daily: "Yesterday",
  weekly: "Last Week",
  monthly: "Last Month",
};

let currentTimeframe = "weekly";
let dashboardData = [];

function cardClassFromTitle(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

function renderCards(timeframe) {
  dashboard.innerHTML = "";

  dashboardData.forEach((item) => {
    const card = document.createElement("article");
    card.className = `card ${cardClassFromTitle(item.title)}`;

    const currentHours = item.timeframes[timeframe].current;
    const previousHours = item.timeframes[timeframe].previous;
    const previousLabel = previousLabelMap[timeframe];

    card.innerHTML = `
      <div class="card-content">
        <header class="card-header">
          <h2>${item.title}</h2>
          <button class="menu-btn" aria-label="More options for ${item.title}">
            <img src="./images/icon-ellipsis.svg" alt="">
          </button>
        </header>
        <div class="card-body">
          <p class="hours">${currentHours}hrs</p>
          <p class="previous">${previousLabel} - ${previousHours}hrs</p>
        </div>
      </div>
    `;

    dashboard.appendChild(card);
  });
}

function setActiveTimeframe(nextTimeframe) {
  currentTimeframe = nextTimeframe;
  timeframeButtons.forEach((button) => {
    const isActive = button.dataset.time === nextTimeframe;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderCards(nextTimeframe);

  // Add a subtle transition on value updates for smoother switching.
  requestAnimationFrame(() => {
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("is-animating");
      void card.offsetWidth;
      card.classList.add("is-animating");
    });
  });
}

timeframeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTimeframe = button.dataset.time;
    if (!selectedTimeframe || selectedTimeframe === currentTimeframe) return;
    setActiveTimeframe(selectedTimeframe);
  });
});

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    dashboardData = data;
    setActiveTimeframe(currentTimeframe);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });