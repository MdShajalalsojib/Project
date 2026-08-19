let allDestinations = [];
let favorites = [];
let currentModalDestination = null;
let activeCategory = "All";
let activeBudget = "Any";
let activeSeason = "All";
let searchQuery = "";

/* ---------- AJAX: Load destinations.json ---------- */
function loadDestinations() {
  fetch("data/destinations.json")
    .then((res) => res.json())
    .then((data) => {
      allDestinations = data;
      updateHeroStats();
      populatePlannerSelect();
      populateHeroDestination(); // নতুন লাইন
      applyFilters();
      renderSpecialSpots();
    })
    .catch((err) => console.error("Failed to load destinations:", err));
}

/* ---------- Hero search: populate + wire up ---------- */
function populateHeroDestination() {
  const select = document.getElementById("heroDestination");
  allDestinations.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name;
    select.appendChild(opt);
  });
}

document.getElementById("heroSearchBtn").addEventListener("click", () => {
  const destId = document.getElementById("heroDestination").value;
  activeCategory = document.getElementById("heroCategory").value;
  activeSeason = document.getElementById("heroSeason").value;
  activeBudget = document.getElementById("heroBudget").value;

  // sync the chip rows below so UI stays consistent
  syncChip("categoryChips", "category", activeCategory);
  syncChip("seasonChips", "season", activeSeason);
  syncChip("budgetChips", "budget", activeBudget);

  if (destId) {
    searchQuery =
      allDestinations.find((d) => d.id == destId)?.name.toLowerCase() || "";
    document.getElementById("searchInput").value =
      allDestinations.find((d) => d.id == destId)?.name || "";
  } else {
    searchQuery = "";
  }

  applyFilters();
  document
    .getElementById("destinations")
    .scrollIntoView({ behavior: "smooth" });
});

function syncChip(containerId, dataAttr, value) {
  const container = document.getElementById(containerId);
  const btn = container.querySelector(`[data-${dataAttr}="${value}"]`);
  if (btn) setActiveChip(container, btn);
}
/* ---------- Beyond the Famous Spots ---------- */
function renderSpecialSpots() {
  const grid = document.getElementById("specialGrid");
  grid.innerHTML = "";
  const specialList = allDestinations.filter((d) => d.special === true);
  specialList.forEach((dest) => grid.appendChild(buildCard(dest)));
}

function updateHeroStats() {
  document.getElementById("statDest").innerText = allDestinations.length;
  const cats = new Set(allDestinations.map((d) => d.category));
  document.getElementById("statCat").innerText = cats.size;
  const avg = (
    allDestinations.reduce((s, d) => s + d.rating, 0) / allDestinations.length
  ).toFixed(1);
  document.getElementById("statRating").innerText = avg;
}

/* ---------- Filtering ---------- */
function applyFilters() {
  let list = allDestinations.filter((d) => {
    const matchesCategory =
      activeCategory === "All" || d.category === activeCategory;
    const matchesSeason = activeSeason === "All" || d.season === activeSeason;
    const matchesSearch =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery) ||
      d.location.toLowerCase().includes(searchQuery) ||
      d.category.toLowerCase().includes(searchQuery);

    let matchesBudget = true;
    if (activeBudget !== "Any") {
      const [min, max] = activeBudget.split("-").map(Number);
      matchesBudget = d.cost >= min && d.cost <= max;
    }
    return matchesCategory && matchesSeason && matchesSearch && matchesBudget;
  });

  document.getElementById("placesFound").innerText =
    `${list.length} places found`;
  renderCards(list);
}

/* ---------- Render Cards ---------- */
function renderCards(list) {
  const grid = document.getElementById("cardGrid");
  const noResult = document.getElementById("noResultMsg");
  grid.innerHTML = "";

  if (list.length === 0) {
    noResult.classList.remove("hidden");
    return;
  }
  noResult.classList.add("hidden");

  list.forEach((dest) => grid.appendChild(buildCard(dest)));
}

function buildCard(dest) {
  const isFav = favorites.some((f) => f.id === dest.id);
  const card = document.createElement("div");
  card.className = "dest-card";
  card.innerHTML = `
    <div class="img-wrap">
      <img src="${dest.image}" alt="${dest.name}">
      <span class="tag">${dest.category}</span>
      <button class="heart-btn ${isFav ? "active" : ""}" data-id="${dest.id}">${isFav ? "♥" : "♡"}</button>
    </div>
    <div class="dest-card-body">
      <h3>${dest.name}</h3>
      <p>📍 ${dest.location}</p>
      <p><span>${dest.bestSeason}</span><span>⭐ ${dest.rating}</span></p>
      <p><span>Est. cost</span><span>৳${dest.cost}</span></p>
      <button class="view-btn">View Details</button>
    </div>
  `;
  card
    .querySelector(".view-btn")
    .addEventListener("click", () => openDetailsModal(dest));
  card.querySelector(".heart-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(dest);
  });
  return card;
}

/* ---------- Search ---------- */
document.getElementById("searchBtn").addEventListener("click", () => {
  searchQuery = document.getElementById("searchInput").value.toLowerCase();
  applyFilters();
});
document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") document.getElementById("searchBtn").click();
});

/* ---------- Category chips + icon grid ---------- */
function setActiveChip(container, btn) {
  container
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
}
document.getElementById("categoryChips").addEventListener("click", (e) => {
  if (!e.target.classList.contains("chip")) return;
  activeCategory = e.target.dataset.category;
  setActiveChip(document.getElementById("categoryChips"), e.target);
  applyFilters();
});
document.getElementById("budgetChips").addEventListener("click", (e) => {
  if (!e.target.classList.contains("chip")) return;
  activeBudget = e.target.dataset.budget;
  setActiveChip(document.getElementById("budgetChips"), e.target);
  applyFilters();
});
document.getElementById("seasonChips").addEventListener("click", (e) => {
  if (!e.target.classList.contains("chip")) return;
  activeSeason = e.target.dataset.season;
  setActiveChip(document.getElementById("seasonChips"), e.target);
  applyFilters();
});
document.getElementById("iconGrid").addEventListener("click", (e) => {
  const card = e.target.closest(".icon-card");
  if (!card) return;
  activeCategory = card.dataset.category;
  const chipBtn = document.querySelector(
    `#categoryChips [data-category="${activeCategory}"]`,
  );
  if (chipBtn) setActiveChip(document.getElementById("categoryChips"), chipBtn);
  document
    .getElementById("destinations")
    .scrollIntoView({ behavior: "smooth" });
  applyFilters();
});

/* ---------- Details Modal + Student Discount ---------- */
function openDetailsModal(dest) {
  currentModalDestination = dest;
  document.getElementById("modalImage").src = dest.image;
  document.getElementById("modalName").innerText = dest.name;
  document.getElementById("modalLocation").innerText = dest.location;
  document.getElementById("modalCategory").innerText = dest.category;
  document.getElementById("modalRating").innerText = dest.rating;
  document.getElementById("modalSeason").innerText = dest.bestSeason;
  document.getElementById("modalCost").innerText = dest.cost;
  document.getElementById("modalDescription").innerText = dest.description;

  document.getElementById("studentCheckbox").checked = false;
  document.getElementById("studentFields").classList.add("hidden");
  document.getElementById("discountResult").classList.add("hidden");
  ["studentName", "studentInstitution", "studentId"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );

  const favBtn = document.getElementById("favBtn");
  const isFav = favorites.some((f) => f.id === dest.id);
  favBtn.innerText = isFav ? "♥ Remove from Favorites" : "♡ Add to Favorites";

  openModal("detailsModal");
}

document
  .getElementById("studentCheckbox")
  .addEventListener("change", function () {
    document
      .getElementById("studentFields")
      .classList.toggle("hidden", !this.checked);
    document.getElementById("discountResult").classList.add("hidden");
  });
["studentName", "studentInstitution", "studentId"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("input", calculateStudentDiscount);
});
function calculateStudentDiscount() {
  const name = document.getElementById("studentName").value.trim();
  const institution = document
    .getElementById("studentInstitution")
    .value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const resultEl = document.getElementById("discountResult");

  if (name && institution && studentId && currentModalDestination) {
    const original = currentModalDestination.cost;
    const discounted = Math.round(original * 0.9);
    resultEl.innerHTML = `🎓 Student Discount Applied!<br>Original: ৳${original} → <span style="color:#4ade80">Discounted: ৳${discounted}</span> (10% off)`;
    resultEl.classList.remove("hidden");
  } else {
    resultEl.classList.add("hidden");
  }
}

/* ---------- Favorites ---------- */
document.getElementById("favBtn").addEventListener("click", () => {
  if (currentModalDestination) toggleFavorite(currentModalDestination, true);
});
function toggleFavorite(dest, fromModal = false) {
  const idx = favorites.findIndex((f) => f.id === dest.id);
  if (idx === -1) favorites.push(dest);
  else favorites.splice(idx, 1);

  document.getElementById("favCount").innerText = favorites.length;
  document.getElementById("favSavedCount").innerText =
    `${favorites.length} saved`;
  renderFavorites();
  applyFilters();
  if (fromModal) openDetailsModal(dest);
}
function renderFavorites() {
  const favGrid = document.getElementById("favoritesGrid");
  const favEmpty = document.getElementById("favEmpty");
  favGrid.innerHTML = "";

  if (favorites.length === 0) {
    favEmpty.classList.remove("hidden");
    return;
  }
  favEmpty.classList.add("hidden");
  favorites.forEach((dest) => favGrid.appendChild(buildCard(dest)));
}
document.getElementById("favPillBtn").addEventListener("click", () => {
  document.getElementById("favorites").scrollIntoView({ behavior: "smooth" });
});

/* ---------- Trip Planner ---------- */
document.getElementById("plannerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = Number(document.getElementById("plannerDestination").value);
  const days = Number(document.getElementById("plannerDays").value) || 1;
  const travelType = document.querySelector(
    'input[name="travelType"]:checked',
  ).value;
  const isStudent = document.getElementById("plannerStudentCheckbox").checked;
  const dest = allDestinations.find((d) => d.id === id);
  if (!dest) return;

  const multiplier =
    travelType === "Family" ? 2.5 : travelType === "Friends" ? 1.6 : 1;
  let estimatedBudget = Math.round(dest.cost * days * 0.6 * multiplier);

  let discountLine = "";
  if (isStudent) {
    const original = estimatedBudget;
    estimatedBudget = Math.round(estimatedBudget * 0.9);
    discountLine = `<p>🎓 Student discount applied: <s>৳${original}</s> → <strong style="color:#4ade80">৳${estimatedBudget}</strong> (10% off)</p>`;
  }

  document.getElementById("plannerResult").innerHTML = `
    <h3 style="margin-bottom:10px;">${dest.name} — ${days} day trip</h3>
    <p>👥 Travel type: ${travelType}</p>
    <p>📅 Best season: ${dest.bestSeason}</p>
    <p>💰 Estimated total budget: <strong>৳${estimatedBudget}</strong></p>
    ${discountLine}
    <p style="margin-top:10px; color:var(--text-muted);">${dest.description}</p>
  `;
});

/* ---------- Sign In / Log Out (Gmail only) ---------- */
document
  .getElementById("signInBtn")
  .addEventListener("click", () => openModal("signInModal"));

document.getElementById("submitLogin").addEventListener("click", () => {
  const name = document.getElementById("loginName").value.trim();
  const email = document
    .getElementById("loginEmail")
    .value.trim()
    .toLowerCase();
  const errorEl = document.getElementById("loginError");

  if (!name || !email) {
    alert("অনুগ্রহ করে নাম এবং Gmail address দিন।");
    return;
  }

  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailPattern.test(email)) {
    errorEl.classList.remove("hidden");
    return;
  }
  errorEl.classList.add("hidden");

  localStorage.setItem("travelUser", JSON.stringify({ name, email }));
  updateAuthUI();
  closeModal("signInModal");
});

document.getElementById("logOutBtn").addEventListener("click", () => {
  localStorage.removeItem("travelUser");
  updateAuthUI();
});

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem("travelUser"));
  const signInBtn = document.getElementById("signInBtn");
  const userInfo = document.getElementById("userInfo");
  if (user) {
    signInBtn.classList.add("hidden");
    userInfo.classList.remove("hidden");
    document.getElementById("userNameDisplay").innerText = "👤 " + user.name;
  } else {
    signInBtn.classList.remove("hidden");
    userInfo.classList.add("hidden");
  }
}

/* ---------- Modal Helpers ---------- */
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}
document.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", () => closeModal(el.dataset.close));
});

/* ---------- Init ---------- */
window.addEventListener("DOMContentLoaded", () => {
  loadDestinations();
  updateAuthUI();
});
