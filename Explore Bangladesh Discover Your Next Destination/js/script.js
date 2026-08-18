/* ======================================================
   DATA — simulates a destinations.json fetched via AJAX
   ====================================================== */
const destinationsData = [
    { id: 1, name: "Cox's Bazar", location: "Chattogram, Bangladesh", category: "Beach", glyph: "🏖️", bestSeason: "November – February", season: "Winter", cost: 5000, rating: 4.8, description: "The world's longest natural sea beach, with golden sand stretching over a hundred kilometres along the Bay of Bengal." },
    { id: 2, name: "Sajek Valley", location: "Rangamati, Bangladesh", category: "Mountain", glyph: "⛰️", bestSeason: "October – March", season: "Winter", cost: 4000, rating: 4.7, description: "A cloud-draped hill valley known as the 'roof of Rangamati', famous for sunrise views above a sea of clouds." },
    { id: 3, name: "Sundarbans", location: "Khulna, Bangladesh", category: "Forest", glyph: "🌳", bestSeason: "November – February", season: "Winter", cost: 7000, rating: 4.6, description: "The world's largest mangrove forest and home of the Royal Bengal Tiger, explored by river launch." },
    { id: 4, name: "Bandarban", location: "Chattogram Hill Tracts", category: "Mountain", glyph: "⛰️", bestSeason: "October – March", season: "Winter", cost: 4500, rating: 4.6, description: "Rugged hill terrain dotted with tribal villages, waterfalls and Bangladesh's highest peaks." },
    { id: 5, name: "Rangamati", location: "Chattogram Hill Tracts", category: "River", glyph: "🌊", bestSeason: "October – March", season: "Winter", cost: 3500, rating: 4.5, description: "A serene lakeside town built around Kaptai Lake, with a hanging bridge and tribal culture." },
    { id: 6, name: "Sylhet Tea Gardens", location: "Sylhet, Bangladesh", category: "Forest", glyph: "🍃", bestSeason: "June – September", season: "Monsoon", cost: 4000, rating: 4.5, description: "Rolling green tea estates and misty hills in Bangladesh's lush north-eastern region." },
    { id: 7, name: "Saint Martin Island", location: "Cox's Bazar, Bangladesh", category: "Beach", glyph: "🏝️", bestSeason: "November – February", season: "Winter", cost: 8000, rating: 4.7, description: "The country's only coral island, with clear turquoise water and coconut-lined shores." },
    { id: 8, name: "Srimangal", location: "Moulvibazar, Bangladesh", category: "Forest", glyph: "🍵", bestSeason: "June – September", season: "Monsoon", cost: 3000, rating: 4.4, description: "The 'tea capital of Bangladesh', known for seven-layer tea and the Lawachara rainforest." },
    { id: 9, name: "Paharpur", location: "Naogaon, Bangladesh", category: "Historical", glyph: "🏛️", bestSeason: "November – February", season: "Winter", cost: 2500, rating: 4.3, description: "A UNESCO World Heritage Buddhist monastery ruin dating back to the 8th century." },
    { id: 10, name: "Sonargaon", location: "Narayanganj, Bangladesh", category: "Historical", glyph: "🏛️", bestSeason: "November – March", season: "Winter", cost: 1800, rating: 4.2, description: "The old capital of Bengal, with Panam City's colonial-era merchant houses." },
    { id: 11, name: "Kuakata", location: "Patuakhali, Bangladesh", category: "Beach", glyph: "🌅", bestSeason: "November – February", season: "Winter", cost: 4500, rating: 4.4, description: "The 'Daughter of the Sea' — one of the few beaches where both sunrise and sunset are visible." },
    { id: 12, name: "Ratargul Swamp Forest", location: "Sylhet, Bangladesh", category: "Forest", glyph: "🌲", bestSeason: "June – September", season: "Monsoon", cost: 2200, rating: 4.5, description: "A freshwater swamp forest explored by boat, with trees rising straight out of the water." },
    { id: 13, name: "Lalbagh Fort", location: "Dhaka, Bangladesh", category: "Historical", glyph: "🏰", bestSeason: "October – March", season: "Winter", cost: 1200, rating: 4.1, description: "An unfinished 17th-century Mughal fort complex in the heart of old Dhaka." },
    { id: 14, name: "Ahsan Manzil", location: "Dhaka, Bangladesh", category: "Historical", glyph: "🏯", bestSeason: "October – March", season: "Winter", cost: 1000, rating: 4.0, description: "The pink 'Pink Palace' on the Buriganga river, once home to the Nawabs of Dhaka." },
    { id: 15, name: "Nafakhum Waterfall", location: "Bandarban, Bangladesh", category: "River", glyph: "💧", bestSeason: "June – September", season: "Monsoon", cost: 6000, rating: 4.6, description: "Bangladesh's largest waterfall, reached by boat and a rugged hike through the Remakri river." }
];

const categoryIcons = { Beach: "🏖️", Mountain: "⛰️", Forest: "🌳", Historical: "🏛️", River: "🌊" };

/* ======================================================
   STATE
   ====================================================== */
let state = {
    search: "",
    category: "All",
    budget: "All",
    season: "All",
    favorites: new Set()
};

/* ======================================================
   SIMULATED AJAX FETCH
   (swap the setTimeout for fetch('data/destinations.json')
   .then(r => r.json()) once you split the data into a
   real JSON file)
   ====================================================== */
function fetchDestinations() {
    return new Promise(resolve => {
        setTimeout(() => resolve(destinationsData), 250);
    });
}

/* ======================================================
   RENDER HELPERS
   ====================================================== */
function budgetMatch(cost, bucket) {
    if (bucket === "All") return true;
    if (bucket === "Under") return cost < 3000;
    if (bucket === "Mid") return cost >= 3000 && cost <= 5000;
    if (bucket === "High") return cost > 5000 && cost <= 10000;
    if (bucket === "Above") return cost > 10000;
    return true;
}

function getFiltered() {
    return destinationsData.filter(d => {
        const matchesSearch = state.search === "" ||
            d.name.toLowerCase().includes(state.search) ||
            d.location.toLowerCase().includes(state.search) ||
            d.category.toLowerCase().includes(state.search);
        const matchesCategory = state.category === "All" || d.category === state.category;
        const matchesBudget = budgetMatch(d.cost, state.budget);
        const matchesSeason = state.season === "All" || d.season === state.season;
        return matchesSearch && matchesCategory && matchesBudget && matchesSeason;
    });
}

function cardHTML(d) {
    const isFav = state.favorites.has(d.id);
    return `
    <div class="card" data-id="${d.id}">
      <div class="card-media" style="background:linear-gradient(135deg,#1B4A44,#0F2E2B);">
        <span class="badge">${d.category}</span>
        <button class="fav-btn ${isFav ? 'active' : ''}" data-fav="${d.id}">${isFav ? '♥' : '♡'}</button>
        ${d.glyph}
      </div>
      <div class="card-body">
        <h3>${d.name}</h3>
        <div class="card-loc">📍 ${d.location}</div>
        <div class="card-meta">
          <span>${d.bestSeason}</span>
          <span class="rating">⭐ ${d.rating}</span>
        </div>
        <div class="card-meta"><span>Est. cost</span><span>৳${d.cost.toLocaleString()}</span></div>
        <button class="card-cta" data-details="${d.id}">View Details</button>
      </div>
    </div>`;
}

function renderGrid() {
    const list = getFiltered();
    const grid = document.getElementById('cardGrid');
    document.getElementById('resultCount').textContent = list.length;
    if (list.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="glyph">🧭</div>
      <p>No destinations match your filters. Try clearing a filter or searching a different place.</p>
    </div>`;
        return;
    }
    grid.innerHTML = list.map(cardHTML).join('');
}

function renderFavorites() {
    const favGrid = document.getElementById('favGrid');
    const favs = destinationsData.filter(d => state.favorites.has(d.id));
    document.getElementById('favResultCount').textContent = favs.length;
    document.getElementById('favCount').textContent = favs.length;
    if (favs.length === 0) {
        favGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="glyph">♡</div>
      <p>You haven't saved any destinations yet. Tap the heart on a card to add it here.</p>
    </div>`;
        return;
    }
    favGrid.innerHTML = favs.map(cardHTML).join('');
}

function renderCategoryTiles() {
    const cats = [...new Set(destinationsData.map(d => d.category))];
    document.getElementById('catGrid').innerHTML = cats.map(c => `
    <div class="cat-tile" data-cat-tile="${c}">
      <div class="glyph">${categoryIcons[c] || '📍'}</div>
      <span>${c}</span>
    </div>`).join('');
    document.getElementById('statCats').textContent = cats.length;
}

function renderChips() {
    const cats = ["All", ...new Set(destinationsData.map(d => d.category))];
    document.getElementById('categoryChips').innerHTML = cats.map(c =>
        `<button class="chip ${state.category === c ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');

    const budgets = [
        { key: "All", label: "Any budget" },
        { key: "Under", label: "Under ৳3,000" },
        { key: "Mid", label: "৳3,000–5,000" },
        { key: "High", label: "৳5,000–10,000" },
        { key: "Above", label: "Above ৳10,000" }
    ];
    document.getElementById('budgetChips').innerHTML = budgets.map(b =>
        `<button class="chip ${state.budget === b.key ? 'active' : ''}" data-budget="${b.key}">${b.label}</button>`).join('');

    const seasons = ["All", "Summer", "Monsoon", "Winter"];
    document.getElementById('seasonChips').innerHTML = seasons.map(s =>
        `<button class="chip ${state.season === s ? 'active' : ''}" data-season="${s}">${s}</button>`).join('');
}

function renderPlannerOptions() {
    document.getElementById('planDest').innerHTML = destinationsData
        .map(d => `<option value="${d.id}">${d.name}</option>`).join('');
}

/* ======================================================
   MODAL
   ====================================================== */
function openModal(id) {
    const d = destinationsData.find(x => x.id === id);
    if (!d) return;
    document.getElementById('modalMedia').style.background = "linear-gradient(135deg,#1B4A44,#0F2E2B)";
    document.getElementById('modalMedia').innerHTML =
        `<button class="close-btn" id="modalCloseX">✕</button>${d.glyph}`;
    document.getElementById('modalName').textContent = d.name;
    document.getElementById('modalLoc').textContent = "📍 " + d.location;
    document.getElementById('modalCat').textContent = d.category;
    document.getElementById('modalRating').textContent = "⭐ " + d.rating + " / 5";
    document.getElementById('modalSeason').textContent = d.bestSeason;
    document.getElementById('modalCost').textContent = "৳" + d.cost.toLocaleString();
    document.getElementById('modalDesc').textContent = d.description;

    const favBtn = document.getElementById('modalFavBtn');
    const isFav = state.favorites.has(d.id);
    favBtn.textContent = isFav ? "♥ Saved to Favorites" : "♡ Add to Favorites";
    favBtn.classList.toggle('active', isFav);
    favBtn.dataset.id = d.id;

    document.getElementById('modalCloseX').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

/* ======================================================
   EVENTS
   ====================================================== */
function toggleFavorite(id) {
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    renderGrid();
    renderFavorites();
}

document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
        toggleFavorite(Number(favBtn.dataset.fav));
        return;
    }
    const detailsBtn = e.target.closest('[data-details]');
    if (detailsBtn) {
        openModal(Number(detailsBtn.dataset.details));
        return;
    }
    const catBtn = e.target.closest('[data-cat]');
    if (catBtn) {
        state.category = catBtn.dataset.cat;
        renderChips(); renderGrid();
        return;
    }
    const budgetBtn = e.target.closest('[data-budget]');
    if (budgetBtn) {
        state.budget = budgetBtn.dataset.budget;
        renderChips(); renderGrid();
        return;
    }
    const seasonBtn = e.target.closest('[data-season]');
    if (seasonBtn) {
        state.season = seasonBtn.dataset.season;
        renderChips(); renderGrid();
        return;
    }
    const catTile = e.target.closest('[data-cat-tile]');
    if (catTile) {
        state.category = catTile.dataset.catTile;
        renderChips(); renderGrid();
        document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    if (e.target.id === 'modalCloseBtn' || e.target.id === 'modalOverlay') closeModal();
    if (e.target.id === 'modalFavBtn') {
        toggleFavorite(Number(e.target.dataset.id));
        openModal(Number(e.target.dataset.id));
    }
});

function runSearch() {
    const val = document.getElementById('heroSearch').value.trim().toLowerCase();
    state.search = val;
    renderGrid();
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
}
document.getElementById('heroSearchBtn').addEventListener('click', runSearch);
document.getElementById('heroSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runSearch();
});
document.getElementById('heroSearch').addEventListener('input', (e) => {
    state.search = e.target.value.trim().toLowerCase();
    renderGrid();
});

document.getElementById('planBtn').addEventListener('click', () => {
    const id = Number(document.getElementById('planDest').value);
    const days = Number(document.getElementById('planDays').value) || 1;
    const type = document.querySelector('input[name="travelType"]:checked').value;
    const d = destinationsData.find(x => x.id === id);
    if (!d) return;

    const multiplier = type === "Solo" ? 1 : type === "Family" ? 3.2 : 2.4;
    const estTotal = Math.round(d.cost * (days / 3) * multiplier);

    document.getElementById('planResult').innerHTML = `
    <h4>${d.glyph} Trip to ${d.name}</h4>
    <div class="plan-line"><span>Duration</span><strong>${days} day${days > 1 ? 's' : ''}</strong></div>
    <div class="plan-line"><span>Travel type</span><strong>${type}</strong></div>
    <div class="plan-line"><span>Best season</span><strong>${d.bestSeason}</strong></div>
    <div class="plan-line"><span>Category</span><strong>${d.category}</strong></div>
    <div class="plan-line"><span>Estimated total cost</span><strong>৳${estTotal.toLocaleString()}</strong></div>
    <p class="plan-placeholder" style="margin-top:14px;">${d.description}</p>`;
});

/* ======================================================
   INIT — simulate AJAX load on page start
   ====================================================== */
async function init() {
    const data = await fetchDestinations();
    document.getElementById('statTotal').textContent = data.length;
    renderCategoryTiles();
    renderChips();
    renderGrid();
    renderFavorites();
    renderPlannerOptions();
}
init();