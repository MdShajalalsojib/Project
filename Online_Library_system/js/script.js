let allBooks = [];
let favorites = [];

// Load JSON data (AJAX using fetch)
async function loadBooks() {
  try {
    const response = await fetch("data/books.json");
    allBooks = await response.json();
    populateCategoryDropdown();
    renderCategoryCards();
    renderStats();
    renderBooks(allBooks, "bookGrid");
  } catch (err) {
    console.error("Error loading books:", err);
  }
}

// Navigation
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    goToSection(link.dataset.section);
  });
});

function goToSection(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document
    .querySelector(`.nav-link[data-section="${id}"]`)
    .classList.add("active");
  if (id === "favorites") renderFavorites();
}

// Render book cards
function renderBooks(books, containerId) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = "";
  if (books.length === 0) {
    grid.innerHTML = "<p>No books found.</p>";
    return;
  }
  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    const isFav = favorites.includes(book.id);
    card.innerHTML = `
      <img src="${book.image}" alt="${book.title}" class="book-cover">
      <h4>${book.title}</h4>
      <p>Author: ${book.author}</p>
      <p>Category: ${book.category}</p>
      <p class="status ${book.status.toLowerCase()}">${book.status}</p>
      <button onclick="showDetails(${book.id})">View Details</button>
      <button class="fav-btn" onclick="toggleFavorite(${book.id})">${isFav ? "♥" : "♡"}</button>
    `;
    grid.appendChild(card);
  });
}

// Search (Home page)
document.getElementById("homeSearchBtn").addEventListener("click", () => {
  const query = document.getElementById("homeSearchInput").value;
  goToSection("browse");
  document.getElementById("browseSearchInput").value = query;
  filterAndRender();
});

// Search + filter (Browse page)
document
  .getElementById("browseSearchInput")
  .addEventListener("input", filterAndRender);
document
  .getElementById("categoryFilter")
  .addEventListener("change", filterAndRender);
document
  .getElementById("sortFilter")
  .addEventListener("change", filterAndRender);

function filterAndRender() {
  const query = document
    .getElementById("browseSearchInput")
    .value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const sortBy = document.getElementById("sortFilter").value;

  let filtered = allBooks.filter(
    (b) =>
      (b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)) &&
      (category === "all" || b.category === category),
  );

  filtered.sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "year") return a.year - b.year;
  });

  renderBooks(filtered, "bookGrid");
}

// Category dropdown + cards
function populateCategoryDropdown() {
  const categories = [...new Set(allBooks.map((b) => b.category))];
  const select = document.getElementById("categoryFilter");
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function renderCategoryCards() {
  const categories = [...new Set(allBooks.map((b) => b.category))];
  const container = document.getElementById("categoryList");
  container.innerHTML = "";
  categories.forEach((cat) => {
    const div = document.createElement("div");
    div.className = "category-card";
    div.textContent = cat;
    div.onclick = () => {
      goToSection("browse");
      document.getElementById("categoryFilter").value = cat;
      filterAndRender();
    };
    container.appendChild(div);
  });
}

// Popular books shortcut
function showPopular() {
  goToSection("browse");
  document.getElementById("categoryFilter").value = "all";
  renderBooks(
    allBooks.filter((b) => b.status === "Available").slice(0, 6),
    "bookGrid",
  );
}

// Stats
function renderStats() {
  const total = allBooks.length;
  const available = allBooks.filter((b) => b.status === "Available").length;
  const borrowed = allBooks.filter((b) => b.status === "Borrowed").length;
  const categories = new Set(allBooks.map((b) => b.category)).size;

  document.getElementById("statsBox").innerHTML = `
    <div class="stat-box"><h3>${total}</h3><p>Total Books</p></div>
    <div class="stat-box"><h3>${available}</h3><p>Available</p></div>
    <div class="stat-box"><h3>${borrowed}</h3><p>Borrowed</p></div>
    <div class="stat-box"><h3>${categories}</h3><p>Categories</p></div>
  `;
}

// Book details modal
function showDetails(id) {
  const book = allBooks.find((b) => b.id === id);
  const isFav = favorites.includes(id);
  document.getElementById("modalContent").innerHTML = `
    <img src="${book.image}" alt="${book.title}" class="modal-cover">
    <h3>${book.title}</h3>
    <p><b>Author:</b> ${book.author}</p>
    <p><b>Category:</b> ${book.category}</p>
    <p><b>Published:</b> ${book.year}</p>
    <p><b>ISBN:</b> ${book.isbn}</p>
    <p><b>Status:</b> ${book.status}</p>
    <p>${book.description}</p>
    <button onclick="toggleFavorite(${book.id}); closeModal();">${isFav ? "Remove Favorite" : "Add to Favorites"}</button>
    <button onclick="closeModal()">Close</button>
  `;
  document.getElementById("detailsModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("detailsModal").classList.add("hidden");
}

// Favorites
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
  }
  filterAndRender();
}

function renderFavorites() {
  const favBooks = allBooks.filter((b) => favorites.includes(b.id));
  document.getElementById("noFavoritesMsg").style.display =
    favBooks.length === 0 ? "block" : "none";
  renderBooks(favBooks, "favoritesGrid");
}

// Membership form validation
document
  .getElementById("membershipForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const msg = document.getElementById("formMessage");

    if (name === "") {
      msg.style.color = "red";
      msg.textContent = "⚠ Please enter your name.";
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msg.style.color = "red";
      msg.textContent = "⚠ Please enter a valid email address.";
      return;
    }
    if (!document.getElementById("agree").checked) {
      msg.style.color = "red";
      msg.textContent = "⚠ You must agree to the library rules.";
      return;
    }

    msg.style.color = "green";
    msg.textContent = "✓ Registration successful!";
    this.reset();
  });

// Init
loadBooks();
